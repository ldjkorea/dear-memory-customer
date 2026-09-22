/**
 * 계약 및 계약 스냅샷 버전 관리 도메인 타입 정의
 * Contract Snapshot Immutability & Versioning (v1 -> v2)
 */

export type ContractStatus = 'draft' | 'sent' | 'agreed' | 'confirmed' | 'cancelled';

export interface ContractItemSnapshot {
  name: string;
  price: number;
  description?: string;
}

export interface ContractPolicyTermsSnapshot {
  version: string;
  title: string;
  deposit_terms: string;
  balance_terms: string;
  delivery_terms: string;
  cancellation_refund_terms: string;
  portfolio_terms: string;
  copyright_terms: string;
  all_terms_text: string;
}

export interface CustomerConsent {
  terms_agreed: boolean;              // 필수 계약 약관 동의
  terms_agreed_at?: string;           // 약관 동의 일시
  portfolio_agreed: boolean;          // 선택 포트폴리오 활용 동의
  portfolio_agreed_at?: string;       // 포트폴리오 동의 일시
  signer_name: string;                // 동의자 성함
  signer_ip?: string;                 // 동의자 IP (참고용)
}

export interface ContractSnapshot {
  // 계약 기본 정보
  contract_number: string;
  customer_name: string;
  customer_contact: string;
  groom_name?: string;
  bride_name?: string;
  groom_phone?: string;
  bride_phone?: string;
  customer_email?: string;
  
  // 예식 및 메이크업 정보
  wedding_date: string;
  wedding_time: string;
  venue: string;
  hall_name?: string;
  makeup_venue?: string;
  makeup_out_time?: string;
  groom_family_members?: string;
  bride_family_members?: string;
  mate_discount_info?: string;
  shooting_requests?: string;
  retouch_requests?: string;
  
  // 상품 스냅샷 (Config가 바뀌어도 변경되지 않는 당시 정보)
  product_name: string;
  product_base_price: number;
  product_included_items: string[];
  product_original_count: string;
  product_retouched_count: number;
  product_album_spec: string;
  
  // 옵션 및 할인 스냅샷
  options: ContractItemSnapshot[];
  discounts: ContractItemSnapshot[];
  
  // 금액 계산 스냅샷
  total_base_price: number;
  total_options_price: number;
  total_discount_amount: number;
  final_total_price: number;
  deposit_amount: number;             // 계약금 (예약금)
  balance_amount: number;             // 잔금 (행사 당일 또는 전일 납부)
  
  // 납품 및 촬영 범위
  shooting_scope: string;
  delivery_schedule: string;
  
  // 약관 스냅샷
  terms: ContractPolicyTermsSnapshot;
  
  // 고객 동의 내역
  consent?: CustomerConsent;
}

export interface ContractVersion {
  id: string;                         // 버전 고유 ID
  contract_id: string;                // 소속 계약 ID
  version_number: number;             // 버전 번호 (1, 2, 3...)
  snapshot: ContractSnapshot;         // 불변 스냅샷
  terms_version: string;              // 적용된 약관 버전
  created_at: string;                 // 버전 생성 일시
  change_reason?: string;             // 변경 사유 (v2 생성 시)
  is_active: boolean;                 // 현재 유효 버전 여부
}

export interface Contract {
  id: string;                         // 계약 고유 ID
  request_id: string;                 // 원본 Request ID
  contract_number: string;            // 계약 번호 (예: DM-CTR-260922-001)
  access_token: string;               // 고객 접근용 안전 토큰 (UUID)
  status: ContractStatus;             // 계약 상태
  active_version_id: string;          // 현재 활성 ContractVersion ID
  created_at: string;
  updated_at: string;
}
