'use client';

import React from 'react';
import Link from 'next/link';
import { Camera, Home, ArrowRight, FileText } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-20 px-4 bg-[#faf8f5]">
      <div className="max-w-md w-full text-center space-y-6 bg-white p-8 sm:p-10 rounded-3xl border border-[#e8e2d8] shadow-sm">
        <div className="w-14 h-14 bg-[#f5f1ea] text-[#8f7a56] rounded-2xl flex items-center justify-center mx-auto">
          <Camera className="w-7 h-7" />
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-[#8f7a56] font-semibold mb-1">
            404 NOT FOUND
          </p>
          <h1 className="text-2xl font-serif text-[#2b261f]">페이지를 찾을 수 없습니다</h1>
          <p className="text-xs text-[#5c5549] mt-2 leading-relaxed">
            요청하신 페이지가 이동되었거나 주소가 잘못 입력되었습니다.
            아래 바로가기 링크를 통해 원하시는 서비스를 이용해 주세요.
          </p>
        </div>

        <div className="pt-2 space-y-2.5">
          <Link
            href="/"
            className="w-full py-3 px-4 bg-[#2b261f] hover:bg-[#473e32] text-white text-xs rounded-xl flex items-center justify-center gap-2 font-medium transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>디어메모리 홈으로 이동</span>
          </Link>

          <Link
            href="/apply"
            className="w-full py-3 px-4 bg-[#8f7a56] hover:bg-[#a68e65] text-white text-xs rounded-xl flex items-center justify-center gap-2 font-medium transition-colors"
          >
            <span>촬영 신청서 작성하기</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/contract/demo-token"
            className="w-full py-3 px-4 border border-[#e8e2d8] hover:bg-[#faf8f5] text-[#5c5549] text-xs rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            <FileText className="w-4 h-4 text-[#8f7a56]" />
            <span>온라인 계약서 샘플 확인</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
