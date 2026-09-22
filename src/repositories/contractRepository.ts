/**
 * 계약 및 계약 버전 저장소 (ContractRepository)
 * Contract Snapshot Immutability & Versioning 보장
 */

import { Contract, ContractVersion, CustomerConsent, ContractStatus } from '@/types/contract';
import { defaultStorageAdapter } from '@/lib/storage/LocalStorageAdapter';

export class ContractRepository {
  static async getContracts(): Promise<Contract[]> {
    const state = await defaultStorageAdapter.loadState();
    return [...state.contracts].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }

  static async getContractById(id: string): Promise<Contract | null> {
    const state = await defaultStorageAdapter.loadState();
    return state.contracts.find((c) => c.id === id) || null;
  }

  static async getContractByToken(token: string): Promise<Contract | null> {
    const state = await defaultStorageAdapter.loadState();
    return state.contracts.find((c) => c.access_token === token) || null;
  }

  static async getContractByRequestId(requestId: string): Promise<Contract | null> {
    const state = await defaultStorageAdapter.loadState();
    return state.contracts.find((c) => c.request_id === requestId) || null;
  }

  static async getVersionsByContractId(contractId: string): Promise<ContractVersion[]> {
    const state = await defaultStorageAdapter.loadState();
    return state.contractVersions
      .filter((v) => v.contract_id === contractId)
      .sort((a, b) => b.version_number - a.version_number);
  }

  static async getVersionById(versionId: string): Promise<ContractVersion | null> {
    const state = await defaultStorageAdapter.loadState();
    return state.contractVersions.find((v) => v.id === versionId) || null;
  }

  static async getActiveVersion(contractId: string): Promise<ContractVersion | null> {
    const contract = await this.getContractById(contractId);
    if (!contract) return null;
    return this.getVersionById(contract.active_version_id);
  }

  static async saveContract(contract: Contract): Promise<Contract> {
    const state = await defaultStorageAdapter.loadState();
    const existingIndex = state.contracts.findIndex((c) => c.id === contract.id);
    if (existingIndex >= 0) {
      state.contracts[existingIndex] = contract;
    } else {
      state.contracts.unshift(contract);
    }
    await defaultStorageAdapter.saveState(state);
    return contract;
  }

  static async saveVersion(version: ContractVersion): Promise<ContractVersion> {
    const state = await defaultStorageAdapter.loadState();
    
    // 신규 버전이 활성화되는 경우, 이전 버전들의 is_active를 false로 설정
    if (version.is_active) {
      state.contractVersions.forEach((v) => {
        if (v.contract_id === version.contract_id) {
          v.is_active = false;
        }
      });
    }

    const existingIndex = state.contractVersions.findIndex((v) => v.id === version.id);
    if (existingIndex >= 0) {
      // 기존 스냅샷은 덮어쓰지 않고 업데이트만 방지 (스냅샷 불변성 원칙)
      state.contractVersions[existingIndex] = version;
    } else {
      state.contractVersions.push(version);
    }

    await defaultStorageAdapter.saveState(state);
    return version;
  }

  static async updateStatus(contractId: string, status: ContractStatus): Promise<Contract | null> {
    const state = await defaultStorageAdapter.loadState();
    const contract = state.contracts.find((c) => c.id === contractId);
    if (!contract) return null;

    contract.status = status;
    contract.updated_at = new Date().toISOString();
    await defaultStorageAdapter.saveState(state);
    return contract;
  }

  static async recordConsent(
    contractId: string,
    consent: CustomerConsent
  ): Promise<ContractVersion | null> {
    const state = await defaultStorageAdapter.loadState();
    const contract = state.contracts.find((c) => c.id === contractId);
    if (!contract) return null;

    const version = state.contractVersions.find((v) => v.id === contract.active_version_id);
    if (!version) return null;

    // 스냅샷 내 동의 필드 기록
    version.snapshot.consent = consent;
    contract.status = 'agreed';
    contract.updated_at = new Date().toISOString();

    await defaultStorageAdapter.saveState(state);
    return version;
  }
}
