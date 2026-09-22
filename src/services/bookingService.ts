/**
 * 예약금 결제 기록 및 예약 확정 서비스 (BookingService)
 */

import { CustomerBooking, Payment, PaymentType } from '@/types/booking';
import { BookingRepository } from '@/repositories/bookingRepository';
import { ContractRepository } from '@/repositories/contractRepository';

export class BookingService {
  /**
   * 고유 예약 번호 생성
   */
  private static generateBookingNumber(): string {
    const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, '');
    const randomHex = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `DM-BKG-${dateStr}-${randomHex}`;
  }

  /**
   * 입금(예약금/잔금 등) 내역 기록
   */
  static async recordPayment(params: {
    contract_id: string;
    type: PaymentType;
    amount: number;
    recorded_by: string;
    note?: string;
  }): Promise<Payment> {
    const newPayment: Payment = {
      id: 'pay-' + Math.random().toString(36).substring(2, 11),
      contract_id: params.contract_id,
      type: params.type,
      amount: params.amount,
      occurred_at: new Date().toISOString(),
      recorded_by: params.recorded_by,
      payment_method: 'bank_transfer',
      note: params.note,
      created_at: new Date().toISOString(),
    };

    return await BookingRepository.addPayment(newPayment);
  }

  /**
   * 계약 및 입금 여부 점검 후 예약 최종 확정
   */
  static async confirmBooking(params: {
    contract_id: string;
    confirmed_by: string;
  }): Promise<{ success: boolean; booking: CustomerBooking | null; message: string }> {
    const contract = await ContractRepository.getContractById(params.contract_id);
    if (!contract) {
      return { success: false, booking: null, message: '계약 정보를 찾을 수 없습니다.' };
    }

    const activeVersion = await ContractRepository.getActiveVersion(params.contract_id);
    if (!activeVersion) {
      return { success: false, booking: null, message: '유효한 계약 버전이 없습니다.' };
    }

    // 입금 내역 확인
    const payments = await BookingRepository.getPaymentsByContractId(params.contract_id);
    const totalDeposited = payments
      .filter((p) => p.type === 'deposit')
      .reduce((sum, p) => sum + p.amount, 0);

    const requiredDeposit = activeVersion.snapshot.deposit_amount;

    if (totalDeposited < requiredDeposit) {
      return {
        success: false,
        booking: null,
        message: `예약금 입금액(현재 ${totalDeposited.toLocaleString()}원)이 기준 예약금(${requiredDeposit.toLocaleString()}원)보다 부족합니다.`,
      };
    }

    let booking = await BookingRepository.getBookingByContractId(params.contract_id);
    const now = new Date().toISOString();

    if (booking) {
      booking.status = 'confirmed';
      booking.confirmed_at = now;
      booking.os_sync_status = 'pending';
      await BookingRepository.saveBooking(booking);
    } else {
      booking = {
        id: 'bkg-' + Math.random().toString(36).substring(2, 11),
        contract_id: params.contract_id,
        request_id: contract.request_id,
        booking_number: this.generateBookingNumber(),
        status: 'confirmed',
        confirmed_at: now,
        os_sync_status: 'pending',
        created_at: now,
        updated_at: now,
      };
      await BookingRepository.saveBooking(booking);
    }

    // 계약 상태를 확정으로 업데이트
    await ContractRepository.updateStatus(params.contract_id, 'confirmed');

    return {
      success: true,
      booking,
      message: '예약이 성공적으로 확정되었습니다.',
    };
  }
}
