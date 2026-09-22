/**
 * 본식스냅 기본 상품 중앙 설정
 * Dear Memory Config - Single Source of Truth
 */

import { ProductItem } from '@/types/catalog';

export const PRODUCTS_CONFIG: ProductItem[] = [
  {
    id: 'standard',
    name: '실속형',
    subtitle: '알찬 구성으로 본식의 감동을 온전히 담아내는 기본 상품',
    base_price: 1250000,
    description: '신부대기실부터 예식 본식, 원판 사진, 연회장 인사까지 하루의 핵심 순간을 꼼꼼하게 기록합니다.',
    included_items: [
      '스냅 촬영 + 원판 촬영 포함',
      '신부대기실 ~ 본식 ~ 원판 ~ 연회장',
      '1인 작가 촬영 (대표/수석 작가)',
      '웹용 고화질 원본 전체 제공',
      '정밀 세부 보정본 70장',
      '최고급 화보형 부부앨범 15x12 70p 1권'
    ],
    original_count: '2,000장 이상',
    retouched_count: 70,
    album_spec: '화보형 부부앨범 15x12 70p 1권',
    active: true,
    display_order: 1,
    badge: '실속 추천',
    policy_note: '기본 1인 작가 진행. 2인 촬영 전환 시 옵션 추가 적용.',
    needs_confirmation: false,
  },
  {
    id: 'album_plus',
    name: '화보형',
    subtitle: '양가 부모님 앨범까지 함께 구성된 디어메모리 시그니처 패키지',
    base_price: 1450000,
    description: '더 풍부한 보정 컷과 함께 양가 부모님께 선물할 원판·스냅 합본 앨범이 기본 포함된 인기 구성입니다.',
    included_items: [
      '스냅 촬영 + 원판 촬영 포함',
      '신부대기실 ~ 본식 ~ 원판 ~ 연회장',
      '1인 작가 촬영 (대표/수석 작가)',
      '웹용 고화질 원본 전체 제공',
      '정밀 세부 보정본 80장',
      '최고급 화보형 부부앨범 15x12 80p 1권',
      '양가 부모님용 압축앨범 12x8 40p 2권'
    ],
    original_count: '2,500장 이상',
    retouched_count: 80,
    album_spec: '부부앨범 15x12 80p 1권 + 부모님앨범 12x8 40p 2권',
    active: true,
    display_order: 2,
    badge: '대표 추천',
    policy_note: '2인 촬영 무료 프로모션 적용 여부는 일정 상담 후 개별 확인 및 안내.',
    needs_confirmation: true,
  },
];
