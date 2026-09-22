import React from 'react';
import Link from 'next/link';
import { ArrowRight, MessageCircle } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-32 bg-gradient-to-b from-[#f5f1ea] via-[#faf8f5] to-[#faf8f5]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        {/* Subtitle / Tagline */}
        <p className="text-xs sm:text-sm font-serif tracking-[0.3em] uppercase text-[#8f7a56] mb-4">
          Wedding Photography Atelier
        </p>

        {/* Brand Main Heading */}
        <h1 className="text-4xl sm:text-6xl font-serif font-light text-[#2b261f] tracking-tight leading-tight sm:leading-tight">
          DEAR MEMORY
        </h1>

        <p className="mt-6 text-base sm:text-lg text-[#5c5549] max-w-xl mx-auto leading-relaxed">
          과장된 연출보다는 그날의 공기와 두 분의 진심 어린 눈빛을 따뜻한 온도로 기록합니다.
        </p>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/inquiry"
            className="w-full sm:w-auto px-8 py-4 bg-[#2b261f] text-[#faf8f5] rounded-full text-sm font-medium tracking-wider hover:bg-[#473e32] transition-all shadow-md flex items-center justify-center gap-2 group"
          >
            <span>내 예식 촬영 문의</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/gallery"
            className="w-full sm:w-auto px-8 py-4 bg-[#ede7dd] text-[#2b261f] rounded-full text-sm font-medium tracking-wider hover:bg-[#e3dacc] transition-colors flex items-center justify-center"
          >
            포트폴리오 보기
          </Link>
        </div>

        {/* Kakao Assistant Link */}
        <div className="mt-6">
          <a
            href="https://pf.kakao.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-[#8f7a56] hover:underline"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>실시간 카카오톡 상담 채널 바로가기</span>
          </a>
        </div>
      </div>
    </section>
  );
}
