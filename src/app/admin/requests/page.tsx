'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { RequestRepository } from '@/repositories/requestRepository';
import { CustomerRequest, RequestType, RequestStatus } from '@/types/customer';
import { CatalogService } from '@/services/catalogService';
import { Search, Filter, ArrowRight, Clock, CheckCircle2, XCircle } from 'lucide-react';

function RequestsListContent() {
  const searchParams = useSearchParams();
  const initialStatus = searchParams.get('status') || 'all';

  const [requests, setRequests] = useState<CustomerRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>(initialStatus);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function load() {
      const data = await RequestRepository.getAll();
      setRequests(data);
      setLoading(false);
    }
    load();
  }, []);

  const filtered = requests.filter((r) => {
    if (filterType !== 'all' && r.type !== filterType) return false;
    if (filterStatus !== 'all' && r.status !== filterStatus) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchName = r.customer_name.toLowerCase().includes(q);
      const matchVenue = r.venue.toLowerCase().includes(q);
      const matchNum = r.request_number.toLowerCase().includes(q);
      if (!matchName && !matchVenue && !matchNum) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Header & Search/Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-serif text-[#2b261f]">접수 내역 관리</h1>
          <p className="text-xs text-[#5c5549] mt-1">고객의 촬영 문의 및 신청 내역을 검토하고 계약을 진행합니다.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* Search Input */}
          <div className="relative flex-1 sm:w-60">
            <Search className="w-4 h-4 text-[#8f7a56] absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="고객명, 웨딩홀, 접수번호 검색"
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#e8e2d8] focus:border-[#8f7a56] focus:outline-none bg-white"
            />
          </div>

          {/* Type Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-[#e8e2d8] bg-white text-[#2b261f]"
          >
            <option value="all">전체 구분</option>
            <option value="application">촬영 신청</option>
            <option value="inquiry">촬영 문의</option>
          </select>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-[#e8e2d8] bg-white text-[#2b261f]"
          >
            <option value="all">전체 상태</option>
            <option value="new">신규 접수</option>
            <option value="reviewing">대표 검토 중</option>
            <option value="ready_for_contract">계약 준비</option>
            <option value="contracted">계약서 발행</option>
            <option value="rejected">반려/불가</option>
          </select>
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-2xl border border-[#e8e2d8] overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-12 text-center text-xs text-[#8f7a56]">데이터를 불러오는 중입니다...</div>
        ) : filtered.length === 0 ? (
          <div className="py-12 text-center text-xs text-[#9e9484]">조건에 일치하는 접수 건이 없습니다.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#faf8f5] border-b border-[#e8e2d8] text-[#6e5c3d] font-serif">
                  <th className="py-3 px-4">접수번호 / 일시</th>
                  <th className="py-3 px-4">구분</th>
                  <th className="py-3 px-4">고객명 / 연락처</th>
                  <th className="py-3 px-4">예식일시 / 장소</th>
                  <th className="py-3 px-4">선택 상품</th>
                  <th className="py-3 px-4">상태</th>
                  <th className="py-3 px-4 text-right">검토 / 관리</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1ede7]">
                {filtered.map((req) => {
                  const product = req.product_id ? CatalogService.getProductById(req.product_id) : null;
                  return (
                    <tr key={req.id} className="hover:bg-[#fdfaf6] transition-colors">
                      <td className="py-3.5 px-4 font-mono">
                        <span className="font-semibold text-[#2b261f] block">{req.request_number}</span>
                        <span className="text-[11px] text-[#9e9484]">
                          {new Date(req.created_at).toLocaleDateString('ko-KR')}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                            req.type === 'application'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {req.type === 'application' ? '촬영 신청' : '촬영 문의'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-medium text-[#2b261f] block">{req.customer_name}</span>
                        <span className="text-[11px] text-[#73695c]">{req.contact_value}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-medium text-[#2b261f] block">{req.wedding_date} {req.wedding_time}</span>
                        <span className="text-[11px] text-[#73695c]">
                          {req.venue} {req.hall_name && `(${req.hall_name})`}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        {product ? (
                          <span className="font-medium text-[#8f7a56]">{product.name}</span>
                        ) : (
                          <span className="text-[#9e9484]">-</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-1 rounded text-[10px] font-medium ${
                            req.status === 'new'
                              ? 'bg-amber-100 text-amber-800'
                              : req.status === 'ready_for_contract'
                              ? 'bg-blue-100 text-blue-800'
                              : req.status === 'contracted'
                              ? 'bg-emerald-100 text-emerald-800'
                              : req.status === 'rejected'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {req.status === 'new' && '신규 접수'}
                          {req.status === 'reviewing' && '대표 검토 중'}
                          {req.status === 'ready_for_contract' && '계약 준비 완료'}
                          {req.status === 'contracted' && '계약서 발행'}
                          {req.status === 'rejected' && '일정 불가'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Link
                          href={`/admin/requests/${req.id}`}
                          className="px-3 py-1.5 bg-[#2b261f] hover:bg-[#473e32] text-white rounded-lg text-xs font-medium inline-flex items-center gap-1 transition-colors"
                        >
                          <span>검토 및 상세</span>
                          <ArrowRight className="w-3 h-3" />
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

export default function AdminRequestsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-[#9e9484]">로딩 중...</div>}>
      <RequestsListContent />
    </Suspense>
  );
}
