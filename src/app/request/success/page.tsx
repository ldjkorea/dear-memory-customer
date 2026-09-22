'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, Calendar, FileText, ArrowRight, MessageCircle, AlertTriangle } from 'lucide-react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const requestNumber = searchParams.get('number') || 'REQ-PENDING';
  const type = searchParams.get('type') || 'application';

  const isApplication = type === 'application';

  return (
    <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#e8e2d8] shadow-sm text-center max-w-xl mx-auto">
      {/* Icon */}
      <div className="w-16 h-16 rounded-full bg-[#f5f1ea] text-[#8f7a56] mx-auto flex items-center justify-center mb-6">
        <CheckCircle2 className="w-8 h-8" />
      </div>

      {/* Title */}
      <h1 className="text-2xl sm:text-3xl font-serif text-[#2b261f] mb-3">
        {isApplication ? '촬영 신청이 접수되었습니다.' : '촬영 문의가 접수되었습니다.'}
      </h1>

      {/* Request Number Box */}
      <div className="my-6 p-4 rounded-2xl bg-[#faf8f5] border border-[#e8e2d8] inline-block">
        <span className="text-[11px] uppercase tracking-widest text-[#8f7a56] font-serif block mb-1">
          접수 번호 (Request Number)
        </span>
        <span className="text-base sm:text-lg font-mono font-medium text-[#2b261f]">
          {requestNumber}
        </span>
      </div>

      {/* Critical Notice: Not Confirmed Yet (Test 2 충족 필수 문구) */}
      <div className="p-5 rounded-2xl bg-[#fdf9f3] border border-[#f1d7b3] text-left text-xs sm:text-sm text-[#735738] mb-8 space-y-2">
        <div className="flex items-center gap-2 font-semibold text-[#8f581e]">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>안내 사항 (예약 확정 아님)</span>
        </div>
        <p className="font-medium text-[#2b261f]">
          신청서 제출만으로 예약이 확정되지는 않습니다.
        </p>
        <p className="text-[#5c5549] leading-relaxed">
          대표작가가 일정과 촬영 조건을 확인한 후 계약 안내를 보내드립니다.
        </p>
      </div>

      {/* Next Steps */}
      <div className="text-xs text-[#5c5549] space-y-2 mb-10 text-left bg-[#faf8f5] p-5 rounded-2xl">
        <p className="font-semibold text-[#2b261f] mb-2">향후 진행 순서:</p>
        <p>1. 대표작가가 남겨주신 예식일의 촬영 가능 여부를 확인합니다.</p>
        <p>2. 유선 또는 카카오톡으로 일정 확인 및 온라인 계약서 링크를 전송해 드립니다.</p>
        <p>3. 고객 계약 동의 및 예약금(300,000원) 입금 확인 후 정식 예약이 확정됩니다.</p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          href="/"
          className="w-full sm:w-auto px-6 py-3.5 bg-[#2b261f] text-[#faf8f5] rounded-full text-xs font-medium hover:bg-[#473e32] transition-colors"
        >
          홈으로 돌아가기
        </Link>
        <a
          href="https://pf.kakao.com"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto px-6 py-3.5 border border-[#c7b698] text-[#8f7a56] hover:bg-[#f5f1ea] rounded-full text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          <span>카카오톡으로 빠른 확인 요청</span>
        </a>
      </div>
    </div>
  );
}

export default function RequestSuccessPage() {
  return (
    <div className="py-16 sm:py-24 bg-[#faf8f5]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <Suspense fallback={<div className="p-8 text-center text-xs text-[#9e9484]">로딩 중...</div>}>
          <SuccessContent />
        </Suspense>
      </div>
    </div>
  );
}
