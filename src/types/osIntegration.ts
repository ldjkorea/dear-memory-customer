/**
 * Dear Memory OS 연동 페이로드 인터페이스
 * CustomerBooking -> createOsJobPayload() 규격
 */

export interface DearMemoryOsJobPayload {
  source: 'customer_web';
  external_booking_id: string;
  external_contract_id: string;
  external_contract_version: number;
  
  // 촬영 기본 정보
  title: string;
  wedding_date: string;
  wedding_time: string;
  venue_name: string;
  hall_name?: string;
  
  // 고객 연락처
  client_name: string;
  client_contact: string;
  
  // 상품 및 사양
  package_type: string;
  options: string[];
  shooting_scope: string;
  album_spec: string;
  delivery_requirements: string;
  
  // 권장 촬영 인원 (예: 1인 또는 2인)
  suggested_photographer_count: number;
  
  // 고객 특이사항 및 메모
  special_requests?: string;
  admin_notes?: string;
  
  // 생성 일시
  payload_created_at: string;
}
