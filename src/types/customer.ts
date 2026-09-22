/**
 * 고객 접수(문의 및 신청) 관련 도메인 타입 정의
 * Dear Memory For Customer - 통합 Request 모델
 */

export type RequestType = 'inquiry' | 'application';

export type RequestStatus =
  | 'new'                 // 신규 접수
  | 'reviewing'           // 대표 검토 중
  | 'needs_info'          // 추가 정보 확인 필요
  | 'ready_for_contract'  // 검토 완료 및 계약 준비
  | 'contracted'          // 계약서 발행 완료
  | 'rejected'            // 일정 불가 / 반려
  | 'cancelled';          // 고객 취소

export interface RepresentativeReview {
  reviewed_at: string;                // 검토 일시
  reviewed_by: string;                // 검토자 (대표작가)
  is_available: boolean;              // 촬영 가능 여부
  availability_note?: string;         // 일정 안내 메모
  confirmed_product_id: string;       // 대표 확정 상품 ID
  confirmed_option_ids: string[];     // 대표 확정 옵션 ID 목록
  confirmed_discount_ids: string[];   // 대표 확정 적용 할인 ID 목록
  custom_discount_amount?: number;    // 추가 임의 할인 금액
  custom_discount_reason?: string;    // 추가 할인 사유
  final_price: number;                // 최종 확정 금액 (원)
  deposit_amount: number;             // 계약금 (예약금)
  admin_memo?: string;                // 관리자 전용 메모 (고객 미노출)
}

export interface CustomerRequest {
  id: string;                         // 고유 ID (UUID)
  request_number: string;             // 사용자 친화적 접수번호 (예: REQ-20260922-A1B2)
  type: RequestType;                  // 문의('inquiry') 또는 신청('application')
  status: RequestStatus;              // 현재 처리 상태
  
  // 고객 기본 정보 (개인정보 최소화)
  customer_name: string;              // 성함 또는 호칭
  contact_type: 'phone' | 'kakao' | 'email'; // 연락 수단
  contact_value: string;             // 연락처 번호 또는 카카오ID / 이메일
  
  // 예식 정보 (미정 허용)
  wedding_date: string;               // 예식일 (YYYY-MM-DD 또는 '미정')
  is_date_undecided: boolean;         // 예식일 미정 여부
  wedding_time?: string;              // 예식 시간 (예: '14:00' 또는 '미정')
  venue: string;                      // 웨딩홀 장소 (또는 '미정')
  is_venue_undecided: boolean;        // 장소 미정 여부
  hall_name?: string;                 // 세부 홀 이름 (선택)
  
  // 선택 정보
  product_id?: string;                // 선택한 상품 ID
  selected_option_ids: string[];      // 선택한 옵션 ID 목록
  selected_discount_ids: string[];    // 신청한 혜택/할인 ID 목록
  
  // 요청사항
  customer_note?: string;             // 고객 요청/문의 사항
  
  // 대표 검토 결과 (검토 후 생성)
  review?: RepresentativeReview;
  
  // 메타데이터
  idempotency_key?: string;           // 중복 제출 방지 멱등키
  created_at: string;                 // 접수 일시 (ISO string)
  updated_at: string;                 // 최종 수정 일시 (ISO string)
}
