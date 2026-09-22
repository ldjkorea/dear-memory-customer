/**
 * 상품 및 카탈로그 타입 정의
 * Dear Memory For Customer - Single Source of Truth
 */

export interface ProductItem {
  id: string;                    // 고유 ID (예: 'standard', 'album_plus')
  name: string;                  // 상품명 (예: '실속형', '화보형')
  subtitle: string;              // 부제목/한줄 소개
  base_price: number;            // 기본 가격 (원)
  description: string;           // 상세 설명
  included_items: string[];      // 포함 구성 (예: ['스냅 + 원판', '신부대기실 ~ 연회장'])
  original_count: string;        // 원본 수량 규격 (예: '2,000장 이상')
  retouched_count: number;       // 보정본 수량 (예: 70)
  album_spec: string;            // 앨범 구성 사양 (예: '부부앨범 15x12 70p 1권')
  active: boolean;               // 활성 상태
  display_order: number;         // 표시 순서
  badge?: string;                // 뱃지 (예: '인기', '추천')
  policy_note?: string;          // 정책 메모 (내부용/대표 확인 필요 등)
  needs_confirmation?: boolean;  // 대표 확정 필요 여부
}

export interface OptionItem {
  id: string;                    // 옵션 ID (예: 'makeup', 'second_shooter', 'pyebaek')
  name: string;                  // 옵션명 (예: '메이크업 촬영')
  price: number;                 // 추가 금액 (원)
  description: string;           // 상세 설명
  active: boolean;               // 활성 상태
  display_order: number;         // 표시 순서
  needs_confirmation?: boolean;  // 대표 확정 필요 여부
}

export interface DiscountItem {
  id: string;                    // 할인 ID (예: 'review_contract', 'review_main', 'partner', 'sunday', 'portfolio')
  name: string;                  // 할인명 (예: '계약 후기 작성')
  amount: number;                // 할인 금액 (원)
  description: string;           // 설명 및 조건
  active: boolean;               // 활성 상태
  customer_selectable: boolean;  // 고객 신청 가능 여부
  requires_verification: boolean;// 대표 검증/증빙 필요 여부
  settlement_stage: 'contract' | 'balance' | 'payback'; // 반영 시점 (계약시, 잔금시, 후기 페이백)
  start_date?: string;           // 적용 시작일
  end_date?: string;             // 적용 종료일
  policy_note?: string;          // 정책 메모
  status: 'draft' | 'confirmed'; // 정책 상태
}

export interface EstimatedPriceResult {
  product: ProductItem | null;
  selectedOptions: OptionItem[];
  selectedDiscounts: DiscountItem[];
  productBasePrice: number;
  optionsTotal: number;
  discountsTotal: number;
  estimatedTotal: number;
  notice: string;
}
