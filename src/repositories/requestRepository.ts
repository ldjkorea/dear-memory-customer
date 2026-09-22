/**
 * 고객 접수(문의 및 신청) 저장소 (RequestRepository)
 */

import { CustomerRequest } from '@/types/customer';
import { defaultStorageAdapter } from '@/lib/storage/LocalStorageAdapter';

export class RequestRepository {
  static async getAll(): Promise<CustomerRequest[]> {
    const state = await defaultStorageAdapter.loadState();
    return [...state.requests].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }

  static async getById(id: string): Promise<CustomerRequest | null> {
    const state = await defaultStorageAdapter.loadState();
    return state.requests.find((r) => r.id === id) || null;
  }

  static async getByNumber(requestNumber: string): Promise<CustomerRequest | null> {
    const state = await defaultStorageAdapter.loadState();
    return state.requests.find((r) => r.request_number === requestNumber) || null;
  }

  static async findByIdempotencyKey(key: string): Promise<CustomerRequest | null> {
    if (!key) return null;
    const state = await defaultStorageAdapter.loadState();
    return state.requests.find((r) => r.idempotency_key === key) || null;
  }

  static async create(request: CustomerRequest): Promise<CustomerRequest> {
    const state = await defaultStorageAdapter.loadState();

    // 중복 멱등키 존재 시 기존 요청 반환 (Double-submit 방지)
    if (request.idempotency_key) {
      const existing = state.requests.find((r) => r.idempotency_key === request.idempotency_key);
      if (existing) {
        return existing;
      }
    }

    state.requests.unshift(request);
    await defaultStorageAdapter.saveState(state);
    return request;
  }

  static async update(id: string, updates: Partial<CustomerRequest>): Promise<CustomerRequest | null> {
    const state = await defaultStorageAdapter.loadState();
    const index = state.requests.findIndex((r) => r.id === id);
    if (index === -1) return null;

    const updated: CustomerRequest = {
      ...state.requests[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };

    state.requests[index] = updated;
    await defaultStorageAdapter.saveState(state);
    return updated;
  }
}
