/**
 * 개발 및 테스트용 샘플(데모) 데이터
 * 모든 데이터는 명확히 [DEMO]로 표기되어 실제 데이터와 구분됩니다.
 */

import { CustomerRequest } from '@/types/customer';
import { Contract, ContractVersion } from '@/types/contract';
import { CONTRACT_POLICY_CONFIG } from './contractPolicy';

export const DEMO_REQUESTS: CustomerRequest[] = [
  {
    id: 'demo-req-001',
    request_number: 'DEMO-REQ-20270417-A1',
    type: 'application',
    status: 'contracted',
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
      final_price: 1350000,
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

export const DEMO_CONTRACTS: Contract[] = [
  {
    id: 'cnt_mock_001',
    request_id: 'demo-req-001',
    contract_number: 'DM-CTR-20270417-001',
    access_token: 'demo-token',
    status: 'sent',
    active_version_id: 'ver_mock_001_v1',
    created_at: '2026-09-22T09:30:00Z',
    updated_at: '2026-09-22T09:30:00Z',
  }
];

export const DEMO_CONTRACT_VERSIONS: ContractVersion[] = [
  {
    id: 'ver_mock_001_v1',
    contract_id: 'cnt_mock_001',
    version_number: 1,
    terms_version: CONTRACT_POLICY_CONFIG.version,
    is_active: true,
    created_at: '2026-09-22T09:30:00Z',
    snapshot: {
      contract_number: 'DM-CTR-20270417-001',
      customer_name: '김민수 (신부 이서연)',
      customer_contact: '010-1234-5678 (phone)',
      wedding_date: '2027-04-17',
      wedding_time: '14:00',
      venue: '더채플앳청담',
      hall_name: '커스티아홀',
      product_name: '데이터 + 앨범 플러스',
      product_base_price: 1450000,
      product_included_items: [
        '대표 1인 촬영 (신부대기실 ~ 본식 ~ 원판 ~ 연회장)',
        '전체 원본 고화질 웹 갤러리 제공 (1,000장 이상)',
        '정밀 보정본 60장 제공',
        '14x11인치 화보형 프리미엄 압축 앨범 60p 1권 (신랑신부용)',
        '11x9인치 미니 압축 앨범 40p 2권 (양가 부모님 선물용)'
      ],
      product_original_count: '1,000장 이상',
      product_retouched_count: 60,
      product_album_spec: '신랑신부 화보형 60p 1권 + 양가 미니 40p 2권',
      options: [
        {
          name: '폐백 촬영 추가',
          price: 100000,
          description: '전통 폐백 진행 시 수모비 별도, 폐백실 연출 및 친인척 촬영'
        }
      ],
      discounts: [
        {
          name: '일요일 / 비수기 예식 할인',
          price: 100000,
          description: '일요일 또는 1, 2, 7, 8월 예식 진행 고객 대상'
        },
        {
          name: '포트폴리오 공개 동의 혜택',
          price: 100000,
          description: '디어메모리 웹사이트 및 인스타그램 포트폴리오 활용 동의 시'
        }
      ],
      total_base_price: 1450000,
      total_options_price: 100000,
      total_discount_amount: 200000,
      final_total_price: 1350000,
      deposit_amount: 300000,
      balance_amount: 1050000,
      shooting_scope: '신부대기실 ~ 본식 ~ 원판 ~ 연회장 / 폐백실',
      delivery_schedule: '촬영일 기준 3주 이내 전체 원본 제공 / 셀렉 완료일 기준 90일 이내 최종 보정본 및 앨범 배송',
      terms: {
        version: CONTRACT_POLICY_CONFIG.version,
        title: '디어메모리 본식스냅 표준 계약 약관',
        deposit_terms: '계약 체결 후 48시간 이내에 계약금 300,000원을 입금하여야 예약이 최종 확정됩니다.',
        balance_terms: '잔금 1,050,000원은 본식 7일 전까지 전액 완납하는 것을 원칙으로 합니다.',
        delivery_terms: CONTRACT_POLICY_CONFIG.delivery_timeline,
        cancellation_refund_terms: '공정거래위원회 소비자분쟁해결기준을 준수합니다. 계약 체결일로부터 14일 이내 취소 시 계약금 전액 환불되며, 촬영일 90일 이내 취소 시 위약금이 발생합니다.',
        portfolio_terms: '포트폴리오 혜택 적용 시 디어메모리 공식 웹사이트 및 SNS에 사진이 품격 있게 소개될 수 있습니다.',
        copyright_terms: '촬영된 모든 사진의 저작권은 촬영자에게 있으며, 저작인격권 및 초상권은 상호 존중됩니다.',
        all_terms_text: CONTRACT_POLICY_CONFIG.sections.map((s) => `${s.title}\n${s.content}`).join('\n\n')
      }
    }
  }
];

