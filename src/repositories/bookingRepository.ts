/**
 * 예약 확정 및 예약금 결제 저장소 (BookingRepository)
 */

import { CustomerBooking, Payment, BookingStatus } from '@/types/booking';
import { defaultStorageAdapter } from '@/lib/storage/LocalStorageAdapter';

export class BookingRepository {
  static async getBookings(): Promise<CustomerBooking[]> {
    const state = await defaultStorageAdapter.loadState();
    return [...state.bookings].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }

  static async getBookingById(id: string): Promise<CustomerBooking | null> {
    const state = await defaultStorageAdapter.loadState();
    return state.bookings.find((b) => b.id === id) || null;
  }

  static async getBookingByContractId(contractId: string): Promise<CustomerBooking | null> {
    const state = await defaultStorageAdapter.loadState();
    return state.bookings.find((b) => b.contract_id === contractId) || null;
  }

  static async saveBooking(booking: CustomerBooking): Promise<CustomerBooking> {
    const state = await defaultStorageAdapter.loadState();
    const existingIndex = state.bookings.findIndex((b) => b.id === booking.id);
    if (existingIndex >= 0) {
      state.bookings[existingIndex] = booking;
    } else {
      state.bookings.unshift(booking);
    }
    await defaultStorageAdapter.saveState(state);
    return booking;
  }

  static async updateStatus(id: string, status: BookingStatus): Promise<CustomerBooking | null> {
    const state = await defaultStorageAdapter.loadState();
    const booking = state.bookings.find((b) => b.id === id);
    if (!booking) return null;

    booking.status = status;
    if (status === 'confirmed' && !booking.confirmed_at) {
      booking.confirmed_at = new Date().toISOString();
    }
    booking.updated_at = new Date().toISOString();
    await defaultStorageAdapter.saveState(state);
    return booking;
  }

  // 입금 내역 관리
  static async getPaymentsByContractId(contractId: string): Promise<Payment[]> {
    const state = await defaultStorageAdapter.loadState();
    return state.payments
      .filter((p) => p.contract_id === contractId)
      .sort((a, b) => new Date(b.occurred_at).getTime() - new Date(a.occurred_at).getTime());
  }

  static async addPayment(payment: Payment): Promise<Payment> {
    const state = await defaultStorageAdapter.loadState();
    state.payments.unshift(payment);
    await defaultStorageAdapter.saveState(state);
    return payment;
  }
}
