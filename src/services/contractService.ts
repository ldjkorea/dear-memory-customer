/**
 * 계약 생성 및 스냅샷 버전 관리 서비스 (ContractService)
 * Contract Snapshot Immutability & Versioning (v1 -> v2) 구현체
 */

import { Contract, ContractSnapshot, ContractVersion, CustomerConsent } from '@/types/contract';
import { CustomerRequest } from '@/types/customer';
import { ContractRepository } from '@/repositories/contractRepository';
import { RequestRepository } from '@/repositories/requestRepository';
import { CatalogService } from './catalogService';
import { PolicyService } from './policyService';
import { EmailService } from './emailService';

export class ContractService {
  /**
   * 고유 계약 번호 생성 (예: DM-CTR-260922-A1B2)
   */
  private static generateContractNumber(): string {
    const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, '');
    const randomHex = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `DM-CTR-${dateStr}-${randomHex}`;
  }

  /**
   * 안전한 고객 접근 토큰 생성
   */
  private static generateAccessToken(): string {
    return 'token-' + Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  /**
   * Request와 대표 확정 결과를 바탕으로 Contract 및 v1 불변 스냅샷 생성
   */
  static async createContractFromRequest(requestId: string): Promise<{
    contract: Contract;
    version: ContractVersion;
  } | null> {
    const request = await RequestRepository.getById(requestId);
    if (!request || !request.review) {
      throw new Error('대표 검토가 완료되지 않은 요청입니다.');
    }

    const review = request.review;
    const product = CatalogService.getProductById(review.confirmed_product_id) || CatalogService.getDefaultProduct();

    // 옵션 스냅샷 구성
    const optionsSnapshot = review.confirmed_option_ids.map((optId) => {
      const opt = CatalogService.getOptionById(optId);
      return {
        name: opt ? opt.name : optId,
        price: opt ? opt.price : 0,
        description: opt?.description,
      };
    });

    // 할인 스냅샷 구성
    const discountsSnapshot = review.confirmed_discount_ids.map((discId) => {
      const disc = CatalogService.getDiscountById(discId);
      return {
        name: disc ? disc.name : discId,
        price: disc ? disc.amount : 0,
        description: disc?.description,
      };
    });

    // 추가 수기 할인이 있는 경우 포함
    if (review.custom_discount_amount && review.custom_discount_amount > 0) {
      discountsSnapshot.push({
        name: review.custom_discount_reason || '대표 특별 할인',
        price: review.custom_discount_amount,
        description: '대표 검토에 따른 추가 할인',
      });
    }

    const totalOptionsPrice = optionsSnapshot.reduce((acc, cur) => acc + cur.price, 0);
    const totalDiscountAmount = discountsSnapshot.reduce((acc, cur) => acc + cur.price, 0);
    const finalTotalPrice = review.final_price;
    const depositAmount = review.deposit_amount || 300000;
    const balanceAmount = Math.max(0, finalTotalPrice - depositAmount);

    // 약관 스냅샷 생성 (영구 고정)
    const termsSnapshot = PolicyService.createTermsSnapshot();

    const contractId = 'ctr-' + Math.random().toString(36).substring(2, 11);
    const versionId = 'ver-' + Math.random().toString(36).substring(2, 11);
    const contractNumber = this.generateContractNumber();
    const accessToken = this.generateAccessToken();

    // 계약 시점의 모든 정책과 가격을 스냅샷으로 영구 보존 (Config 사후 변경에 영향받지 않음)
    const snapshot: ContractSnapshot = {
      contract_number: contractNumber,
      customer_name: request.customer_name,
      customer_contact: request.contact_value,
      wedding_date: request.wedding_date,
      wedding_time: request.wedding_time || '시간 미정',
      venue: request.venue,
      hall_name: request.hall_name,
      product_name: product.name,
      product_base_price: product.base_price,
      product_included_items: [...product.included_items],
      product_original_count: product.original_count,
      product_retouched_count: product.retouched_count,
      product_album_spec: product.album_spec,
      options: optionsSnapshot,
      discounts: discountsSnapshot,
      total_base_price: product.base_price,
      total_options_price: totalOptionsPrice,
      total_discount_amount: totalDiscountAmount,
      final_total_price: finalTotalPrice,
      deposit_amount: depositAmount,
      balance_amount: balanceAmount,
      shooting_scope: '신부대기실 ~ 본식 ~ 원판 ~ 연회장',
      delivery_schedule: PolicyService.getCurrentPolicy().delivery_timeline,
      terms: termsSnapshot,
    };

    const version: ContractVersion = {
      id: versionId,
      contract_id: contractId,
      version_number: 1,
      snapshot,
      terms_version: termsSnapshot.version,
      created_at: new Date().toISOString(),
      is_active: true,
    };

    const contract: Contract = {
      id: contractId,
      request_id: requestId,
      contract_number: contractNumber,
      access_token: accessToken,
      status: 'sent',
      active_version_id: versionId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    await ContractRepository.saveVersion(version);
    await ContractRepository.saveContract(contract);
    await RequestRepository.update(requestId, { status: 'contracted' });

    // 신부 이메일로 계약서 링크 및 요약 자동 발송
    try {
      await EmailService.sendContractToCustomer(contract, version);
    } catch (e) {
      console.warn('[ContractService] 신부 계약서 이메일 발송 실패 (무시):', e);
    }

    return { contract, version };
  }

  /**
   * 계약 수정 시 기존 v1을 덮어쓰지 않고 신규 v2 버전 생성 (버전 관리 보장)
   */
  static async createNewContractVersion(
    contractId: string,
    updatedSnapshotData: Partial<ContractSnapshot>,
    changeReason: string
  ): Promise<ContractVersion | null> {
    const contract = await ContractRepository.getContractById(contractId);
    if (!contract) return null;

    const existingVersions = await ContractRepository.getVersionsByContractId(contractId);
    const activeVersion = existingVersions.find((v) => v.id === contract.active_version_id);
    if (!activeVersion) return null;

    const nextVersionNumber = existingVersions.length + 1;
    const newVersionId = 'ver-' + Math.random().toString(36).substring(2, 11);

    // 새 스냅샷 생성 (기존 스냅샷 계승 + 변경 사항 적용)
    const newSnapshot: ContractSnapshot = {
      ...activeVersion.snapshot,
      ...updatedSnapshotData,
    };

    // 금액 재계산 (필요시)
    if (updatedSnapshotData.options || updatedSnapshotData.discounts || updatedSnapshotData.product_base_price) {
      const base = newSnapshot.product_base_price;
      const opts = newSnapshot.options.reduce((a, b) => a + b.price, 0);
      const discs = newSnapshot.discounts.reduce((a, b) => a + b.price, 0);
      newSnapshot.total_base_price = base;
      newSnapshot.total_options_price = opts;
      newSnapshot.total_discount_amount = discs;
      newSnapshot.final_total_price = Math.max(0, base + opts - discs);
      newSnapshot.balance_amount = Math.max(0, newSnapshot.final_total_price - newSnapshot.deposit_amount);
    }

    const newVersion: ContractVersion = {
      id: newVersionId,
      contract_id: contractId,
      version_number: nextVersionNumber,
      snapshot: newSnapshot,
      terms_version: activeVersion.terms_version,
      created_at: new Date().toISOString(),
      change_reason: changeReason,
      is_active: true,
    };

    // 기존 버전은 유지하고 새 버전 저장
    await ContractRepository.saveVersion(newVersion);

    // Contract의 활성 버전 ID 변경
    contract.active_version_id = newVersionId;
    contract.updated_at = new Date().toISOString();
    await ContractRepository.saveContract(contract);

    return newVersion;
  }

  /**
   * 고객 계약 약관 및 포트폴리오 동의 제출
   */
  static async submitConsent(
    token: string,
    consent: {
      terms_agreed: boolean;
      portfolio_agreed: boolean;
      signer_name: string;
    }
  ): Promise<{ success: boolean; contract: Contract | null; message: string }> {
    const contract = await ContractRepository.getContractByToken(token);
    if (!contract) {
      return { success: false, contract: null, message: '유효하지 않은 계약 토큰입니다.' };
    }

    if (!consent.terms_agreed) {
      return { success: false, contract, message: '필수 계약 약관에 동의하셔야 진행할 수 있습니다.' };
    }

    if (!consent.signer_name.trim()) {
      return { success: false, contract, message: '서명자 성함을 입력해주세요.' };
    }

    const fullConsent: CustomerConsent = {
      terms_agreed: true,
      terms_agreed_at: new Date().toISOString(),
      portfolio_agreed: Boolean(consent.portfolio_agreed),
      portfolio_agreed_at: consent.portfolio_agreed ? new Date().toISOString() : undefined,
      signer_name: consent.signer_name.trim(),
    };

    await ContractRepository.recordConsent(contract.id, fullConsent);
    const updatedContract = await ContractRepository.getContractById(contract.id);

    return {
      success: true,
      contract: updatedContract,
      message: '계약 동의가 안전하게 접수되었습니다.',
    };
  }
}
