/**
 * 로컬 스토리지 어댑터 (LocalStorageAdapter)
 * 브라우저 localStorage 사용 및 SSR/Node 환경 인메모리 Fallback 지원
 */

import { CustomerAppState, IStorageAdapter } from './types';
import { DEMO_REQUESTS, DEMO_CONTRACTS, DEMO_CONTRACT_VERSIONS } from '@/config/demoData';

const STORAGE_KEY = 'dear_memory_customer_v2';

export function getInitialDemoState(): CustomerAppState {
  return {
    requests: [...DEMO_REQUESTS],
    contracts: [...DEMO_CONTRACTS],
    contractVersions: [...DEMO_CONTRACT_VERSIONS],
    bookings: [],
    payments: [],
    lastUpdated: new Date().toISOString(),
  };
}

export class LocalStorageAdapter implements IStorageAdapter {
  private inMemoryState: CustomerAppState;

  constructor() {
    this.inMemoryState = getInitialDemoState();
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  }

  async loadState(): Promise<CustomerAppState> {
    if (!this.isBrowser()) {
      return this.inMemoryState;
    }

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        const initial = getInitialDemoState();
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
        return initial;
      }
      const parsed: CustomerAppState = JSON.parse(raw);
      // 기존 저장소에 계약서가 없으면 데모 계약서 자동 보충
      if (!parsed.contracts || parsed.contracts.length === 0) {
        parsed.contracts = [...DEMO_CONTRACTS];
        parsed.contractVersions = [...DEMO_CONTRACT_VERSIONS];
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
      }
      return parsed;
    } catch (e) {
      console.warn('[LocalStorageAdapter] 로드 실패, 기본 상태로 복원합니다:', e);
      return this.inMemoryState;
    }
  }

  async saveState(state: CustomerAppState): Promise<void> {
    state.lastUpdated = new Date().toISOString();
    this.inMemoryState = state;

    if (this.isBrowser()) {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch (e) {
        console.error('[LocalStorageAdapter] 저장 실패:', e);
      }
    }
  }

  async resetToDemo(): Promise<CustomerAppState> {
    const demo = getInitialDemoState();
    await this.saveState(demo);
    return demo;
  }
}

// 싱글톤 인스턴스
export const defaultStorageAdapter = new LocalStorageAdapter();
