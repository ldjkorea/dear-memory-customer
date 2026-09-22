/**
 * 개발 및 테스트용 샘플(데모) 데이터
 * 모든 데이터는 명확히 [DEMO]로 표기되어 실제 데이터와 구분됩니다.
 */

import { CustomerRequest } from '@/types/customer';

export const DEMO_REQUESTS: CustomerRequest[] = [
  {
    id: 'demo-req-001',
    request_number: 'DEMO-REQ-20270417-A1',
    type: 'application',
    status: 'reviewing',
    customer_name: '김민수 (신부 이서연)',
    contact_type: 'phone',
    contact_value: '010-1234-5678',
    wedding_date: '2027-04-17',
    is_date_undecided: false,
    wedding_time: '14:00',
    venue: '더채플앳청담',
    is_venue_undecided: false,
    hall_name: '커스티아홀',
    product_id: 'album_plus',
    selected_option_ids: ['pyebaek'],
    selected_discount_ids: ['sunday', 'portfolio'],
    customer_note: '[DEMO 샘플] 본식 전 원판 촬영과 자연스러운 하객 스냅 위주로 요청드립니다.',
    review: {
      reviewed_at: '2026-09-22T09:00:00Z',
      reviewed_by: '한민규 대표',
      is_available: true,
      availability_note: '해당 일정 대표 촬영 배정 가능합니다.',
      confirmed_product_id: 'album_plus',
      confirmed_option_ids: ['pyebaek'],
      confirmed_discount_ids: ['sunday', 'portfolio'],
      final_price: 1350000, // 145만 + 10만(폐백) - 20만(일요일+포트폴리오)
      deposit_amount: 300000,
      admin_memo: '[DEMO] 대표 직접 진행 예정 건'
    },
    created_at: '2026-09-20T08:30:00Z',
    updated_at: '2026-09-20T09:00:00Z',
  },
  {
    id: 'demo-req-002',
    request_number: 'DEMO-REQ-20270523-B2',
    type: 'inquiry',
    status: 'new',
    customer_name: '박지현',
    contact_type: 'kakao',
    contact_value: 'jihyun_wedding',
    wedding_date: '2027-05-23',
    is_date_undecided: false,
    wedding_time: '12:30',
    venue: '빌라드지디 수서',
    is_venue_undecided: false,
    hall_name: '르씨엘홀',
    product_id: 'standard',
    selected_option_ids: ['makeup', 'second_shooter'],
    selected_discount_ids: ['sunday'],
    customer_note: '[DEMO 샘플] 메이크업 샵부터 동행하는 2인 촬영 가능 여부 문의드립니다.',
    created_at: '2026-09-20T09:15:00Z',
    updated_at: '2026-09-20T09:15:00Z',
  }
];
