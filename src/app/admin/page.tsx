'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { RequestRepository } from '@/repositories/requestRepository';
import { ContractRepository } from '@/repositories/contractRepository';
import { BookingRepository } from '@/repositories/bookingRepository';
import { CustomerRequest } from '@/types/customer';
import { Contract, ContractVersion } from '@/types/contract';
import { CustomerBooking } from '@/types/booking';
import {
  Inbox,
  FileText,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Clock,
  Calendar,
  Download,
  Phone,
  Sparkles,
  MapPin,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [requests, setRequests] = useState<CustomerRequest[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [contractVersions, setContractVersions] = useState<Record<string, ContractVersion>>({});
  const [bookings, setBookings] = useState<CustomerBooking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const reqs = await RequestRepository.getAll();
      const ctrs = await ContractRepository.getContracts();
      const bkgs = await BookingRepository.getBookings();

      const versionMap: Record<string, ContractVersion> = {};
      for (const c of ctrs) {
        const v = await ContractRepository.getActiveVersion(c.id);
        if (v) versionMap[c.id] = v;
      }

      setRequests(reqs);
      setContracts(ctrs);
      setContractVersions(versionMap);
      setBookings(bkgs);
      setLoading(false);
    }
    load();
  }, []);

  const newRequests = requests.filter((r) => r.status === 'new');
  const reviewingRequests = requests.filter((r) => r.status === 'reviewing');
  const confirmedBookings = bookings.filter((b) => b.status === 'confirmed');

  // 다가오는 예식 일정 정렬 (오늘 이후 또는 등록된 일정 순)
  const upcomingSchedules = [...requests]
    .filter((r) => r.wedding_date && r.wedding_date !== '미정')
    .sort((a, b) => new Date(a.wedding_date).getTime() - new Date(b.wedding_date).getTime());

  // 엑셀(CSV) 다운로드 함수 (UTF-8 with BOM for Excel Korean support)
  const handleExportCSV = () => {
    if (requests.length === 0) {
      alert('내보낼 데이터가 없습니다.');
      return;
    }

    const headers = [
      '접수번호',
      '구분',
      '상태',
      '신랑성함',
      '신랑연락처',
      '신부성함',
      '신부연락처',
      '고객이메일',
      '예식일자',
      '예식시간',
      '웨딩홀',
      '홀이름',
      '메이크업샵',
      '메이크업아웃시간',
      '신랑직계가족',
      '신부직계가족',
      '선택상품',
      '포트폴리오동의',
      '짝꿍할인정보',
      '촬영요청사항',
      '보정요청사항',
      '접수일시',
    ];

    const rows = requests.map((r) => [
      `"${r.request_number}"`,
      `"${r.type === 'application' ? '촬영신청' : '단순문의'}"`,
      `"${r.status}"`,
      `"${r.groom_name || ''}"`,
      `"${r.groom_phone || ''}"`,
      `"${r.bride_name || ''}"`,
      `"${r.bride_phone || r.contact_value || ''}"`,
      `"${r.customer_email || ''}"`,
      `"${r.wedding_date}"`,
      `"${r.wedding_time || ''}"`,
      `"${r.venue}"`,
      `"${r.hall_name || ''}"`,
      `"${r.makeup_venue || ''}"`,
      `"${r.makeup_out_time || ''}"`,
      `"${r.groom_family_members || ''}"`,
      `"${r.bride_family_members || ''}"`,
      `"${r.product_id || ''}"`,
      `"${r.portfolio_agreed ? '동의' : '미동의'}"`,
      `"${r.mate_discount_info || ''}"`,
      `"${(r.shooting_requests || '').replace(/"/g, '""')}"`,
      `"${(r.retouch_requests || '').replace(/"/g, '""')}"`,
      `"${r.created_at}"`,
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((row) => row.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    link.href = url;
    link.setAttribute('download', `디어메모리_계약_신청_명단_${today}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* Header & Export Action */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-serif text-[#2b261f]">운영 현황 대시보드</h1>
          <p className="text-xs text-[#5c5549] mt-1">
            신규 접수, 이번 주말 예식 체크리스트, 계약 현황을 통합 관리합니다.
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportCSV}
          className="w-full sm:w-auto justify-center px-4 py-2.5 bg-[#8f7a56] hover:bg-[#a68e65] text-white rounded-xl text-xs font-medium flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
          title="왈라에서 안 되던 엑셀 저장을 원클릭으로 다운로드합니다"
        >
          <Download className="w-4 h-4 shrink-0" />
          <span>전체 계약/신청 명단 Excel(CSV) 다운로드</span>
        </button>
      </div>

      {/* ⭐️ 이번 주말 / 다가오는 예식 일정 집중 체크리스트 (민규 대표님 1순위 필요 기능) */}
      <div className="bg-gradient-to-br from-[#2b261f] to-[#3d362d] text-white p-5 sm:p-7 rounded-3xl shadow-lg border border-[#473e32] space-y-4">
        <div className="flex justify-between items-center border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#c7b698] shrink-0" />
            <h2 className="text-sm sm:text-base font-serif tracking-wide text-white">
              이번 주말 & 다가오는 예식 체크리스트 (D-Day 점검)
            </h2>
          </div>
          <span className="text-xs text-[#c7b698] font-mono whitespace-nowrap">
            등록 {upcomingSchedules.length}건
          </span>
        </div>

        {upcomingSchedules.length === 0 ? (
          <p className="text-xs text-[#c9bfaf] py-4 text-center">예정된 예식 일정이 없습니다.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-1">
            {upcomingSchedules.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 space-y-2.5 text-xs hover:bg-white/15 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <div className="min-w-0">
                      <span className="font-semibold text-white text-sm block truncate">
                        {item.customer_name}
                      </span>
                      <span className="text-[11px] text-[#c7b698] whitespace-nowrap">
                        {item.wedding_date} {item.wedding_time}
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-[#c7b698] text-[#2b261f] font-bold shrink-0">
                      D-Day
                    </span>
                  </div>

                  <div className="space-y-1.5 text-[11.5px] text-[#e8e2d8] border-t border-white/10 pt-2.5 mt-2.5 break-keep">
                    <p className="flex items-start gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#c7b698] shrink-0 mt-0.5" />
                      <span className="leading-snug">{item.venue} {item.hall_name && `(${item.hall_name})`}</span>
                    </p>
                    <p className="flex items-start gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#c7b698] shrink-0 mt-0.5" />
                      <span className="leading-snug">
                        메이크업: {item.makeup_venue || '미정'} (아웃: {item.makeup_out_time || '미정'})
                      </span>
                    </p>
                    <p className="flex items-start gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-[#c7b698] shrink-0 mt-0.5" />
                      <span className="leading-snug">신부: {item.bride_phone || item.contact_value} / 신랑: {item.groom_phone || '-'}</span>
                    </p>
                    {item.shooting_requests && (
                      <p className="text-[11px] text-[#c7b698] line-clamp-1 mt-1 leading-snug">
                        💡 요청: {item.shooting_requests}
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-3">
                  <Link
                    href={`/admin/requests/${item.id}`}
                    className="w-full py-1.5 bg-white text-[#2b261f] rounded-lg text-center block text-[11px] font-semibold hover:bg-[#faf8f5] transition-colors"
                  >
                    상세 및 계약 확인 →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
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
            className="text-[11px] text-[#8f7a56] hover:underline mt-2 inline-block font-medium"
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
            className="text-[11px] text-[#8f7a56] hover:underline mt-2 inline-block font-medium"
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
          <span className="text-[11px] text-emerald-600 mt-2 inline-block font-medium">예약금 확인 완료</span>
        </div>
      </div>

      {/* Recent Requests Section */}
      <div className="bg-white rounded-2xl border border-[#e8e2d8] p-6 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-base font-serif text-[#2b261f]">최근 접수된 신청서 (왈라 대체 실시간 목록)</h2>
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
              <div key={req.id} className="py-3.5 flex flex-col sm:flex-row justify-between sm:items-center gap-3 text-xs">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
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
                  <p className="text-[#5c5549] text-[11.5px] truncate max-w-full sm:max-w-xl">
                    {req.wedding_date} {req.wedding_time} | {req.venue} {req.hall_name && `(${req.hall_name})`}
                    {req.makeup_venue && ` | 메이크업: ${req.makeup_venue}`}
                  </p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0">
                  <span className="text-[11px] px-2 py-1 rounded bg-[#faf8f5] text-[#6e5c3d] border border-[#e8e2d8] whitespace-nowrap">
                    {req.status === 'new' && '신규 접수'}
                    {req.status === 'reviewing' && '대표 검토 중'}
                    {req.status === 'ready_for_contract' && '계약 준비 완료'}
                    {req.status === 'contracted' && '계약서 발행 완료'}
                    {req.status === 'rejected' && '일정 불가/반려'}
                  </span>
                  <Link
                    href={`/admin/requests/${req.id}`}
                    className="px-3 py-1.5 bg-[#2b261f] hover:bg-[#473e32] text-white rounded-lg text-xs whitespace-nowrap transition-colors"
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
