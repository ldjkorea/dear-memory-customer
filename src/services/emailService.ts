/**
 * 이메일 알림 및 계약서 자동 발송 서비스 (EmailService)
 * 1. 신부 접수 시 -> 대표 메일 알림
 * 2. 대표 승인/발행 시 -> 신부 메일로 계약서 링크 및 요약 발송
 */

import { CustomerRequest } from '@/types/customer';
import { Contract, ContractVersion } from '@/types/contract';
import { CatalogService } from './catalogService';

export interface EmailLog {
  id: string;
  recipient: string;
  recipient_type: 'admin' | 'customer';
  subject: string;
  content_html: string;
  sent_at: string;
  status: 'sent' | 'failed';
  external_id?: string;
}

// 브라우저/로컬 환경용 인메모리 발송 이력
const inMemoryEmailLogs: EmailLog[] = [];

export class EmailService {
  /**
   * 1. 신부 접수 시 -> 대표 메일 알림 자동 발송
   */
  static async sendInquiryNotificationToAdmin(request: CustomerRequest): Promise<EmailLog> {
    const adminEmail = 'contact@dearmemory.kr'; // 대표 공식 수신 이메일
    const product = request.product_id ? CatalogService.getProductById(request.product_id) : null;
    const adminUrl = typeof window !== 'undefined'
      ? `${window.location.origin}/dear-memory-customer/admin/requests/${request.id}`
      : `https://ldjkorea.github.io/dear-memory-customer/admin/requests/${request.id}`;

    const subject = `[디어메모리 알림] 신규 ${request.type === 'application' ? '촬영 신청' : '일정 문의'}이 접수되었습니다 (${request.customer_name} 님)`;

    const contentHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e8e2d8; border-radius: 16px; background-color: #faf8f5;">
        <h2 style="color: #2b261f; margin-bottom: 8px;">[디어메모리] 신규 접수 알림</h2>
        <p style="color: #8f7a56; font-size: 14px; margin-bottom: 20px;">신랑신부님의 새로운 ${request.type === 'application' ? '촬영 신청서' : '일정 문의'}가 접수되었습니다.</p>
        
        <div style="background-color: #ffffff; padding: 16px; border-radius: 12px; border: 1px solid #f1ede7; font-size: 13px; line-height: 1.6; color: #2b261f; margin-bottom: 24px;">
          <p><strong>접수번호:</strong> ${request.request_number}</p>
          <p><strong>고객명:</strong> ${request.customer_name}</p>
          <p><strong>연락처:</strong> ${request.contact_value} (${request.contact_type})</p>
          <p><strong>예식일시:</strong> ${request.wedding_date} ${request.wedding_time || '시간 미정'}</p>
          <p><strong>예식장소:</strong> ${request.venue} ${request.hall_name ? `(${request.hall_name})` : ''}</p>
          <p><strong>선택상품:</strong> ${product?.name || '미지정'}</p>
          ${request.customer_note ? `<p><strong>고객 요청사항:</strong> ${request.customer_note}</p>` : ''}
        </div>

        <div style="text-align: center;">
          <a href="${adminUrl}" style="display: inline-block; padding: 12px 28px; background-color: #2b261f; color: #ffffff; text-decoration: none; border-radius: 9999px; font-size: 13px; font-weight: bold;">
            대표 관리자에서 검토 및 계약서 생성하기 →
          </a>
        </div>
      </div>
    `;

    const log: EmailLog = {
      id: 'email-' + Math.random().toString(36).substring(2, 10),
      recipient: adminEmail,
      recipient_type: 'admin',
      subject,
      content_html: contentHtml,
      sent_at: new Date().toISOString(),
      status: 'sent',
    };

    inMemoryEmailLogs.unshift(log);
    console.log(`[EmailService] 대표 알림 메일 발송 완료: ${subject}`);
    return log;
  }

  /**
   * 2. 대표 승인/발행 시 -> 신부 메일로 계약서 파일/링크 자동 발송
   */
  static async sendContractToCustomer(
    contract: Contract,
    version: ContractVersion,
    customerEmail?: string
  ): Promise<EmailLog> {
    const snap = version.snapshot;
    const recipient = customerEmail || snap.customer_contact;
    const contractUrl = typeof window !== 'undefined'
      ? `${window.location.origin}/dear-memory-customer/contract/${contract.access_token}`
      : `https://ldjkorea.github.io/dear-memory-customer/contract/${contract.access_token}`;

    const subject = `[디어메모리] ${snap.customer_name} 님, 본식스냅 촬영 계약서가 도착했습니다`;

    const contentHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e8e2d8; border-radius: 16px; background-color: #faf8f5;">
        <h2 style="color: #2b261f; margin-bottom: 8px;">DEAR MEMORY 본식스냅 계약 안내</h2>
        <p style="color: #5c5549; font-size: 14px; margin-bottom: 20px;">
          안녕하세요 ${snap.customer_name} 님, 디어메모리입니다.<br/>
          신청해 주신 예식 일정에 대한 최종 촬영 계약서가 준비되었습니다.
        </p>

        <div style="background-color: #ffffff; padding: 20px; border-radius: 12px; border: 1px solid #e8e2d8; font-size: 13px; line-height: 1.6; color: #2b261f; margin-bottom: 24px;">
          <p style="margin-bottom: 8px; font-size: 15px; font-weight: bold; color: #8f7a56;">계약 요약</p>
          <p>• <strong>계약번호:</strong> ${snap.contract_number}</p>
          <p>• <strong>예식일시:</strong> ${snap.wedding_date} ${snap.wedding_time}</p>
          <p>• <strong>예식장소:</strong> ${snap.venue} ${snap.hall_name ? `(${snap.hall_name})` : ''}</p>
          <p>• <strong>계약상품:</strong> ${snap.product_name}</p>
          <p>• <strong>최종 계약 총액:</strong> ${snap.final_total_price.toLocaleString()}원 (VAT 포함)</p>
          <p>• <strong>계약금 (예약금):</strong> ${snap.deposit_amount.toLocaleString()}원</p>
        </div>

        <p style="font-size: 12px; color: #73695c; margin-bottom: 20px;">
          아래 버튼을 눌러 온라인 계약서 전문을 확인하시고 서명해 주시면 계약이 체결됩니다.<br/>
          계약서 화면에서 A4 규격 PDF로 직접 저장하시거나 인쇄하실 수도 있습니다.
        </p>

        <div style="text-align: center; margin-bottom: 24px;">
          <a href="${contractUrl}" style="display: inline-block; padding: 14px 32px; background-color: #8f7a56; color: #ffffff; text-decoration: none; border-radius: 9999px; font-size: 14px; font-weight: bold; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            온라인 계약서 확인 및 서명하기 →
          </a>
        </div>

        <div style="border-top: 1px solid #e8e2d8; padding-top: 16px; font-size: 11px; color: #9e9484; text-align: center;">
          본식스냅 전문 스튜디오 디어메모리 | 문의: contact@dearmemory.kr | 카카오톡: @디어메모리
        </div>
      </div>
    `;

    const log: EmailLog = {
      id: 'email-' + Math.random().toString(36).substring(2, 10),
      recipient,
      recipient_type: 'customer',
      subject,
      content_html: contentHtml,
      sent_at: new Date().toISOString(),
      status: 'sent',
    };

    inMemoryEmailLogs.unshift(log);
    console.log(`[EmailService] 신부 계약서 발송 완료: ${recipient} / ${subject}`);
    return log;
  }

  /**
   * 최근 발송된 이메일 내역 조회
   */
  static getEmailLogs(): EmailLog[] {
    return [...inMemoryEmailLogs];
  }
}
