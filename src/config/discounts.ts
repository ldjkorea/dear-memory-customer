/**
 * 할인 혜택 중앙 설정
 * Dear Memory Config - Single Source of Truth
 */

import { DiscountItem } from '@/types/catalog';

export const DISCOUNTS_CONFIG: DiscountItem[] = [
  {
    id: 'sunday',
    name: '일요일 예식 프로모션',
    amount: 100000,
    description: '일요일에 예식을 진행하시는 신랑·신부님께 드리는 특별 일정 혜택입니다.',
    active: true,
    customer_selectable: true,
    requires_verification: false,
    settlement_stage: 'contract',
    status: 'confirmed',
  },
  {
    id: 'portfolio',
    name: '포트폴리오 활용 동의',
    amount: 100000,
    description: '디어메모리 공식 웹사이트 및 인스타그램에 사진 게재를 허락해주시는 감사 혜택입니다.',
    active: true,
    customer_selectable: true,
    requires_verification: false,
    settlement_stage: 'contract',
    status: 'confirmed',
  },
  {
    id: 'partner',
    name: '짝꿍 추천 할인',
    amount: 50000,
    description: '기존 계약자 또는 신규 계약자와 상호 추천 시 각각 5만원 잔금 할인 (추천인 코드 확인 필요).',
    active: true,
    customer_selectable: true,
    requires_verification: true,
    settlement_stage: 'balance',
    status: 'draft',
    policy_note: '신청 시 추천인 성함 또는 예식일 확인 후 잔금 반영.',
  },
  {
    id: 'review_contract',
    name: '계약 후기 작성 혜택',
    amount: 50000,
    description: '웨딩 커뮤니티(다이렉트, 멕마웨 등) 또는 블로그에 정성스러운 계약 후기 작성 시 잔금 차감.',
    active: true,
    customer_selectable: true,
    requires_verification: true,
    settlement_stage: 'balance',
    status: 'draft',
  },
  {
    id: 'review_main',
    name: '본식 촬영 후기 혜택',
    amount: 50000,
    description: '예식 후 결과물 수령 후 커뮤니티/블로그에 후기 작성 시 페이백 지급.',
    active: true,
    customer_selectable: false, // 사후 적용
    requires_verification: true,
    settlement_stage: 'payback',
    status: 'draft',
  },
];
