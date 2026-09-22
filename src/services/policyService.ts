/**
 * 계약 및 운영 정책 서비스 (PolicyService)
 */

import { CONTRACT_POLICY_CONFIG } from '@/config/contractPolicy';
import { ContractPolicyTermsSnapshot } from '@/types/contract';

export class PolicyService {
  /**
   * 현행 약관 설정 반환
   */
  static getCurrentPolicy() {
    return CONTRACT_POLICY_CONFIG;
  }

  /**
   * 계약 체결 시점에 영구 고정할 약관 스냅샷 생성
   */
  static createTermsSnapshot(): ContractPolicyTermsSnapshot {
    const config = CONTRACT_POLICY_CONFIG;
    const allSectionsText = config.sections
      .map((s) => `[${s.title}]\n${s.content}`)
      .join('\n\n');

    return {
      version: config.version,
      title: '디어메모리 본식스냅 표준 촬영 계약 약관',
      deposit_terms: `계약 체결 후 48시간 이내 예약금 ${config.default_deposit_amount.toLocaleString()}원 입금 시 예약이 확정됩니다.`,
      balance_terms: '잔금은 예식 7일 전까지 입금 완료를 원칙으로 합니다.',
      delivery_terms: config.delivery_timeline,
      cancellation_refund_terms: config.sections.find((s) => s.id === 'cancellation_and_refund')?.content || '',
      portfolio_terms: config.sections.find((s) => s.id === 'portfolio_consent')?.content || '',
      copyright_terms: '촬영된 사진의 저작권은 디어메모리에 귀속되며, 고객의 초상권을 침해하지 않는 범위 내에서 상호 존중됩니다.',
      all_terms_text: allSectionsText,
    };
  }

  /**
   * 기본 계약금(예약금) 반환
   */
  static getDefaultDepositAmount(): number {
    return CONTRACT_POLICY_CONFIG.default_deposit_amount;
  }
}
