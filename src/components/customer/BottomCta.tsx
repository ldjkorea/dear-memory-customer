import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function BottomCta() {
  return (
    <section className="py-20 bg-[#2b261f] text-[#faf8f5] text-center">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <p className="text-xs font-serif tracking-[0.25em] text-[#c7b698] uppercase mb-3">
          Check Your Date
        </p>
        <h2 className="text-2xl sm:text-4xl font-serif font-light mb-6">
          가장 소중한 순간, 디어메모리와 함께하세요
        </h2>
        <p className="text-sm sm:text-base text-[#c9bfaf] max-w-xl mx-auto mb-10 leading-relaxed">
          예식 날짜와 장소를 알려주시면 촬영 일정 가능 여부 및 상세 안내를 빠르게 회신드립니다.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/inquiry"
            className="w-full sm:w-auto px-8 py-4 bg-[#8f7a56] hover:bg-[#a68e65] text-white rounded-full text-sm font-medium tracking-wider transition-colors shadow-lg flex items-center justify-center gap-2 group"
          >
            <span>내 예식 촬영 문의</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/product"
            className="w-full sm:w-auto px-8 py-4 border border-[#5c5549] hover:border-[#c7b698] text-[#e8e2d8] rounded-full text-sm font-medium tracking-wider transition-colors flex items-center justify-center"
          >
            상품 구성 확인
          </Link>
        </div>
      </div>
    </section>
  );
}
