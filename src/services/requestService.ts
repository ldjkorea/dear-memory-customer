/**
 * 고객 접수 및 대표 검토 서비스 (RequestService)
 */

import { CustomerRequest, RepresentativeReview, RequestType } from '@/types/customer';
import { RequestRepository } from '@/repositories/requestRepository';
import { CatalogService } from './catalogService';
import { EmailService } from './emailService';

export class RequestService {
  /**
   * 고유 접수 번호 생성 (예: REQ-260922-A1B2)
   */
  private static generateRequestNumber(type: RequestType): string {
    const prefix = type === 'inquiry' ? 'INQ' : 'APP';
    const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, '');
    const randomHex = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix}-${dateStr}-${randomHex}`;
  }

  /**
   * 신규 문의/신청 접수 (Double-submit 방지 멱등키 지원 및 왈라 상세 필드 수용)
   */
  static async submitRequest(
    params: Partial<CustomerRequest> & {
      type: RequestType;
      customer_name: string;
      contact_type: 'phone' | 'kakao' | 'email';
      contact_value: string;
    }
  ): Promise<CustomerRequest> {
    // 멱등키 검사
    if (params.idempotency_key) {
      const existing = await RequestRepository.findByIdempotencyKey(params.idempotency_key);
      if (existing) {
        return existing;
      }
    }

    const newRequest: CustomerRequest = {
      ...params,
      id: 'req-' + Math.random().toString(36).substring(2, 11),
      request_number: this.generateRequestNumber(params.type),
      type: params.type,
      status: 'new',
      customer_name: params.customer_name.trim(),
      contact_type: params.contact_type,
      contact_value: params.contact_value.trim(),
      wedding_date: params.is_date_undecided ? '미정' : (params.wedding_date || '미정'),
      is_date_undecided: Boolean(params.is_date_undecided),
      wedding_time: params.wedding_time || '미정',
      venue: params.is_venue_undecided ? '미정' : (params.venue || '미정'),
      is_venue_undecided: Boolean(params.is_venue_undecided),
      hall_name: params.hall_name || '',
      product_id: params.product_id,
      selected_option_ids: params.selected_option_ids || [],
      selected_discount_ids: params.selected_discount_ids || [],
      customer_note: params.customer_note || '',
      idempotency_key: params.idempotency_key,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const created = await RequestRepository.create(newRequest);

    // 대표 이메일로 자동 알림 발송
    try {
      await EmailService.sendInquiryNotificationToAdmin(created);
    } catch (e) {
      console.warn('[RequestService] 대표 알림 이메일 발송 실패 (무시):', e);
    }

    return created;
  }

  /**
   * 대표 검토 및 조건 확정
   */
  static async reviewRequest(
    requestId: string,
    reviewData: {
      is_available: boolean;
      availability_note?: string;
      confirmed_product_id: string;
      confirmed_option_ids: string[];
      confirmed_discount_ids: string[];
      custom_discount_amount?: number;
      custom_discount_reason?: string;
      deposit_amount?: number;
      admin_memo?: string;
      reviewed_by?: string;
    }
  ): Promise<CustomerRequest | null> {
    const request = await RequestRepository.getById(requestId);
    if (!request) return null;

    // 최종 금액 계산
    const estimate = CatalogService.calculateEstimate({
      productId: reviewData.confirmed_product_id,
      optionIds: reviewData.confirmed_option_ids,
      discountIds: reviewData.confirmed_discount_ids,
    });

    const customDiscount = reviewData.custom_discount_amount || 0;
    const finalPrice = Math.max(0, estimate.estimatedTotal - customDiscount);

    const review: RepresentativeReview = {
      reviewed_at: new Date().toISOString(),
      reviewed_by: reviewData.reviewed_by || '한민규 대표',
      is_available: reviewData.is_available,
      availability_note: reviewData.availability_note,
      confirmed_product_id: reviewData.confirmed_product_id,
      confirmed_option_ids: reviewData.confirmed_option_ids,
      confirmed_discount_ids: reviewData.confirmed_discount_ids,
      custom_discount_amount: customDiscount,
      custom_discount_reason: reviewData.custom_discount_reason,
      final_price: finalPrice,
      deposit_amount: reviewData.deposit_amount || 300000,
      admin_memo: reviewData.admin_memo,
    };

    const nextStatus = reviewData.is_available ? 'ready_for_contract' : 'rejected';

    return await RequestRepository.update(requestId, {
      review,
      status: nextStatus,
    });
  }
}
