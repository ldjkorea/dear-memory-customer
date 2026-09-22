'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { RequestRepository } from '@/repositories/requestRepository';
import { ContractRepository } from '@/repositories/contractRepository';
import { BookingRepository } from '@/repositories/bookingRepository';
import { CustomerRequest } from '@/types/customer';
import { Contract } from '@/types/contract';
import { CustomerBooking } from '@/types/booking';
import { Inbox, FileText, CheckCircle2, AlertCircle, ArrowRight, Clock } from 'lucide-react';

export default function AdminDashboardPage() {
  const [requests, setRequests] = useState<CustomerRequest[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [bookings, setBookings] = useState<CustomerBooking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const reqs = await RequestRepository.getAll();
      const ctrs = await ContractRepository.getContracts();
      const bkgs = await BookingRepository.getBookings();
      setRequests(reqs);
      setContracts(ctrs);
      setBookings(bkgs);
      setLoading(false);
    }
    load();
  }, []);

  const newRequests = requests.filter((r) => r.status === 'new');
  const reviewingRequests = requests.filter((r) => r.status === 'reviewing');
  const readyRequests = requests.filter((r) => r.status === 'ready_for_contract');
  const confirmedBookings = bookings.filter((b) => b.status === 'confirmed');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-serif text-[#2b261f]">운영 현황 대시보드</h1>
        <p className="text-xs text-[#5c5549] mt-1">
          신규 문의 및 신청, 계약 진행 상태, 예약 확정 현황을 한눈에 점검합니다.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#e8e2d8] shadow-sm">
          <div className="flex justify-between items-center text-xs text-[#6e5c3d] mb-2">
            <span>신규 미처리 접수</span>
            <Inbox className="w-4 h-4 text-[#8f7a56]" />
          </div>
          <p className="text-2xl font-serif text-[#2b261f]">{newRequests.length}건</p>
          <Link
            href="/admin/requests?status=new"
            className="text-[11px] text-[#8f7a56] hover:underline mt-2 inline-block"
          >
            접수 목록 바로가기 →
          </Link>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#e8e2d8] shadow-sm">
          <div className="flex justify-between items-center text-xs text-[#6e5c3d] mb-2">
            <span>대표 검토 중</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-serif text-[#2b261f]">{reviewingRequests.length}건</p>
          <span className="text-[11px] text-[#9e9484] mt-2 inline-block">일정/조건 조율 중</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#e8e2d8] shadow-sm">
          <div className="flex justify-between items-center text-xs text-[#6e5c3d] mb-2">
            <span>계약서 발행 건</span>
            <FileText className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-serif text-[#2b261f]">{contracts.length}건</p>
          <Link
            href="/admin/contracts"
            className="text-[11px] text-[#8f7a56] hover:underline mt-2 inline-block"
          >
            계약 목록 보기 →
          </Link>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#e8e2d8] shadow-sm">
          <div className="flex justify-between items-center text-xs text-[#6e5c3d] mb-2">
            <span>최종 예약 확정</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-serif text-[#2b261f]">{confirmedBookings.length}건</p>
          <span className="text-[11px] text-emerald-600 mt-2 inline-block">예약금 확인 완료</span>
        </div>
      </div>

      {/* Recent Requests Section */}
      <div className="bg-white rounded-2xl border border-[#e8e2d8] p-6 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-base font-serif text-[#2b261f]">최근 접수된 요청</h2>
          <Link
            href="/admin/requests"
            className="text-xs text-[#8f7a56] hover:text-[#2b261f] flex items-center gap-1 font-medium"
          >
            <span>전체 접수 보기</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {requests.length === 0 ? (
          <p className="text-xs text-[#9e9484] py-8 text-center">접수된 요청이 없습니다.</p>
        ) : (
          <div className="divide-y divide-[#f1ede7]">
            {requests.slice(0, 5).map((req) => (
              <div key={req.id} className="py-3.5 flex flex-col sm:flex-row justify-between sm:items-center gap-2 text-xs">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-[#2b261f]">{req.customer_name}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] ${
                        req.type === 'application'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {req.type === 'application' ? '촬영 신청' : '단순 문의'}
                    </span>
                    <span className="text-[#9e9484] font-mono text-[11px]">{req.request_number}</span>
                  </div>
                  <p className="text-[#5c5549]">
                    {req.wedding_date} | {req.venue} {req.hall_name && `(${req.hall_name})`}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[11px] px-2 py-1 rounded bg-[#faf8f5] text-[#6e5c3d] border border-[#e8e2d8]">
                    {req.status === 'new' && '신규 접수'}
                    {req.status === 'reviewing' && '대표 검토 중'}
                    {req.status === 'ready_for_contract' && '계약 준비 완료'}
                    {req.status === 'contracted' && '계약서 발행 완료'}
                    {req.status === 'rejected' && '일정 불가/반려'}
                  </span>
                  <Link
                    href={`/admin/requests/${req.id}`}
                    className="px-3 py-1.5 bg-[#2b261f] hover:bg-[#473e32] text-white rounded-lg text-xs"
                  >
                    검토 및 상세
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
