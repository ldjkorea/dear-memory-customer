/**
 * 고객용 서비스 스토리지 어댑터 인터페이스 및 상태 정의
 */

import { CustomerRequest } from '@/types/customer';
import { Contract, ContractVersion } from '@/types/contract';
import { CustomerBooking, Payment } from '@/types/booking';

export interface CustomerAppState {
  requests: CustomerRequest[];
  contracts: Contract[];
  contractVersions: ContractVersion[];
  bookings: CustomerBooking[];
  payments: Payment[];
  lastUpdated: string;
}

export interface IStorageAdapter {
  loadState(): Promise<CustomerAppState>;
  saveState(state: CustomerAppState): Promise<void>;
  resetToDemo(): Promise<CustomerAppState>;
}
