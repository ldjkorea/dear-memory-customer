/**
 * Dear Memory OS 내부 시스템 연동 서비스 (IntegrationService)
 * Customer Booking -> Dear Memory OS Job 데이터 페이로드 생성
 */

import { DearMemoryOsJobPayload } from '@/types/osIntegration';
import { BookingRepository } from '@/repositories/bookingRepository';
import { ContractRepository } from '@/repositories/contractRepository';
import { RequestRepository } from '@/repositories/requestRepository';

export class IntegrationService {
  /**
   * 예약 확정 건에 대해 Dear Memory OS의 Job 생성 규격과 1:1 호환되는 페이로드 생성
   */
  static async createOsJobPayload(bookingId: string): Promise<DearMemoryOsJobPayload> {
    const booking = await BookingRepository.getBookingById(bookingId);
    if (!booking) {
      throw new Error(`예약 정보를 찾을 수 없습니다: ${bookingId}`);
    }

    const contract = await ContractRepository.getContractById(booking.contract_id);
    if (!contract) {
      throw new Error(`계약 정보를 찾을 수 없습니다: ${booking.contract_id}`);
    }

    const activeVersion = await ContractRepository.getActiveVersion(contract.id);
    if (!activeVersion) {
      throw new Error('활성 계약 버전을 찾을 수 없습니다.');
    }

    const request = await RequestRepository.getById(contract.request_id);
    const snap = activeVersion.snapshot;

    // 2인 촬영 옵션 포함 여부에 따른 권장 작가 수 산출
    const hasSecondShooter = snap.options.some((opt) => opt.name.includes('2인'));
    const suggestedPhotographerCount = hasSecondShooter ? 2 : 1;

    const payload: DearMemoryOsJobPayload = {
      source: 'customer_web',
      external_booking_id: booking.booking_number,
      external_contract_id: contract.contract_number,
      external_contract_version: activeVersion.version_number,
      title: `${snap.wedding_date} [${snap.venue}] ${snap.customer_name} 본식스냅`,
      wedding_date: snap.wedding_date,
      wedding_time: snap.wedding_time,
      venue_name: snap.venue,
      hall_name: snap.hall_name,
      client_name: snap.customer_name,
      client_contact: snap.customer_contact,
      package_type: snap.product_name,
      options: snap.options.map((o) => o.name),
      shooting_scope: snap.shooting_scope,
      album_spec: snap.product_album_spec,
      delivery_requirements: snap.delivery_schedule,
      suggested_photographer_count: suggestedPhotographerCount,
      special_requests: request?.customer_note || '',
      admin_notes: request?.review?.admin_memo || '',
      payload_created_at: new Date().toISOString(),
    };

    return payload;
  }

  /**
   * OS 전송 성공 마킹
   */
  static async markSyncSuccess(bookingId: string, osJobId: string): Promise<void> {
    const booking = await BookingRepository.getBookingById(bookingId);
    if (booking) {
      booking.os_sync_status = 'succeeded';
      booking.os_job_id = osJobId;
      booking.last_synced_at = new Date().toISOString();
      await BookingRepository.saveBooking(booking);
    }
  }

  /**
   * OS 전송 실패 마킹 (재시도 가능)
   */
  static async markSyncFailed(bookingId: string, errorMsg: string): Promise<void> {
    const booking = await BookingRepository.getBookingById(bookingId);
    if (booking) {
      booking.os_sync_status = 'failed';
      booking.os_sync_error = errorMsg;
      booking.last_synced_at = new Date().toISOString();
      await BookingRepository.saveBooking(booking);
    }
  }
}
