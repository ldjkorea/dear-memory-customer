import React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-[#24201a] text-[#c9bfaf] py-12 border-t border-[#3b342b]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <span className="font-serif tracking-[0.25em] text-lg font-medium text-[#f5f1ea]">
              DEAR MEMORY
            </span>
            <p className="mt-3 text-xs leading-relaxed text-[#9e9484]">
              인생에서 가장 찬란한 날, 과장되지 않은 따뜻한 시선으로 두 분의 온기를 기록합니다.
            </p>
          </div>

          <div className="text-xs space-y-1.5 text-[#9e9484]">
            <p className="font-medium text-[#f5f1ea] mb-2">안내 및 상담</p>
            <p>상담 운영: 화~일 10:00 ~ 19:00 (월요일 휴무)</p>
            <p>카카오톡: @디어메모리</p>
            <p>이메일: contact@dearmemory.kr</p>
          </div>

          <div className="text-xs space-y-1.5 text-[#9e9484]">
            <p className="font-medium text-[#f5f1ea] mb-2">이용 안내</p>
            <div className="flex flex-col gap-1">
              <Link href="/faq" className="hover:text-[#f5f1ea] transition-colors">
                자주 묻는 질문 (FAQ)
              </Link>
              <Link href="/product" className="hover:text-[#f5f1ea] transition-colors">
                상품 및 구성 안내
              </Link>
              <Link href="/inquiry" className="hover:text-[#f5f1ea] transition-colors">
                예식 일정 문의하기
              </Link>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-[#3b342b] flex flex-col sm:flex-row justify-between items-center text-[11px] text-[#73695c] gap-4">
          <p>© {new Date().getFullYear()} DEAR MEMORY. All rights reserved.</p>
          <p>본식스냅 전문 스튜디오 디어메모리 | 대표: 한민규</p>
        </div>
      </div>
    </footer>
  );
}
