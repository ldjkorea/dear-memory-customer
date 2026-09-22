/**
 * 예약금 및 예약 확정(Booking) 도메인 타입 정의
 */

export type PaymentType = 'deposit' | 'balance' | 'additional';

export interface Payment {
  id: string;                         // 입금 기록 ID
  contract_id: string;                // 계약 ID
  type: PaymentType;                  // 구분 (계약금/잔금 등)
  amount: number;                     // 입금 금액 (원)
  occurred_at: string;                // 입금 일시
  recorded_by: string;                // 기록자 (대표자)
  payment_method?: 'bank_transfer' | 'card' | 'other'; // 입금 방식
  note?: string;                      // 비고 메모
  created_at: string;
}

export type BookingStatus = 'pending' | 'held' | 'confirmed' | 'cancelled';
export type OsSyncStatus = 'not_ready' | 'pending' | 'succeeded' | 'failed';

export interface CustomerBooking {
  id: string;                         // 예약 고유 ID
  contract_id: string;                // 관련 계약 ID
  request_id: string;                 // 원본 접수 ID
  booking_number: string;             // 예약 번호 (예: DM-BKG-260922-001)
  status: BookingStatus;              // 예약 확정 상태
  confirmed_at?: string;              // 확정 일시
  
  // 연동 상태
  os_sync_status: OsSyncStatus;       // Dear Memory OS 전송 상태
  os_sync_error?: string;             // 전송 실패 사유
  os_job_id?: string;                 // OS에서 발급받은 Job ID
  last_synced_at?: string;            // 최종 연동 시도 일시
  
  created_at: string;
  updated_at: string;
}
