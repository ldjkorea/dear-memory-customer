'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ContractRepository } from '@/repositories/contractRepository';
import { Contract, ContractVersion } from '@/types/contract';
import { FileText, ArrowRight, Eye, ExternalLink, ShieldCheck } from 'lucide-react';

interface ContractWithVersion {
  contract: Contract;
  version: ContractVersion | null;
}

export default function AdminContractsPage() {
  const [items, setItems] = useState<ContractWithVersion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const contracts = await ContractRepository.getContracts();
      const list: ContractWithVersion[] = [];
      for (const ctr of contracts) {
        const ver = await ContractRepository.getActiveVersion(ctr.id);
        list.push({ contract: ctr, version: ver });
      }
      setItems(list);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif text-[#2b261f]">계약서 관리</h1>
        <p className="text-xs text-[#5c5549] mt-1">발행된 전자 계약서의 스냅샷 버전 및 동의 상태를 관리합니다.</p>
      </div>

      <div className="bg-white rounded-2xl border border-[#e8e2d8] overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-12 text-center text-xs text-[#8f7a56]">데이터를 불러오는 중입니다...</div>
        ) : items.length === 0 ? (
          <div className="py-12 text-center text-xs text-[#9e9484]">발행된 계약서가 없습니다.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#faf8f5] border-b border-[#e8e2d8] text-[#6e5c3d] font-serif">
                  <th className="py-3 px-4">계약번호</th>
                  <th className="py-3 px-4">고객명 / 연락처</th>
                  <th className="py-3 px-4">예식일시 / 장소</th>
                  <th className="py-3 px-4">활성 버전</th>
                  <th className="py-3 px-4">계약 총액</th>
                  <th className="py-3 px-4">상태</th>
                  <th className="py-3 px-4 text-right">미리보기 / 관리</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1ede7]">
                {items.map(({ contract, version }) => {
                  const snap = version?.snapshot;
                  return (
                    <tr key={contract.id} className="hover:bg-[#fdfaf6] transition-colors">
                      <td className="py-3.5 px-4 font-mono font-semibold text-[#2b261f]">
                        {contract.contract_number}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-medium text-[#2b261f] block">{snap?.customer_name}</span>
                        <span className="text-[11px] text-[#73695c]">{snap?.customer_contact}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-[#2b261f] block">{snap?.wedding_date}</span>
                        <span className="text-[11px] text-[#73695c]">{snap?.venue}</span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[#8f7a56]">
                        v{version?.version_number || 1}
                      </td>
                      <td className="py-3.5 px-4 font-serif text-[#2b261f]">
                        {snap?.final_total_price.toLocaleString()}원
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                            contract.status === 'confirmed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : contract.status === 'agreed'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {contract.status === 'confirmed' && '예약 확정'}
                          {contract.status === 'agreed' && '고객 동의 완료'}
                          {contract.status === 'sent' && '서명 대기 중'}
                          {contract.status === 'draft' && '초안'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Link
                          href={`/admin/contracts/${contract.id}/preview`}
                          className="px-3 py-1.5 bg-[#2b261f] hover:bg-[#473e32] text-white rounded-lg text-xs font-medium inline-flex items-center gap-1 transition-colors"
                        >
                          <Eye className="w-3 h-3" />
                          <span>미리보기</span>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
