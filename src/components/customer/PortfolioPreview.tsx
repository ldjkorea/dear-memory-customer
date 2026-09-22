import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

export function PortfolioPreview() {
  const previewItems = [
    {
      id: 'preview-1',
      venue: '더채플앳청담',
      hall: '커스티아홀',
      mood: '어두운 홀 · 웅장한 채플',
      tone: '따뜻한 골드 톤 & 드라마틱 하이라이트',
    },
    {
      id: 'preview-2',
      venue: '빌라드지디 수서',
      hall: '르씨엘홀',
      mood: '밝은 하우스 웨딩 · 자연채광',
      tone: '싱그러운 그리너리 & 화사한 스킨 톤',
    },
    {
      id: 'preview-3',
      venue: '그랜드힐컨벤션',
      hall: '사브리나홀',
      mood: '호텔형 웨딩 · 럭셔리',
      tone: '선명한 대비 & 우아한 블랙타이 톤',
    },
  ];

  return (
    <section className="py-20 bg-[#faf8f5]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-xs font-serif tracking-widest text-[#8f7a56] uppercase mb-2">Portfolio</p>
          <h2 className="text-2xl sm:text-3xl font-serif text-[#2b261f]">공간의 빛과 그날의 감정</h2>
          <p className="mt-3 text-sm text-[#5c5549]">
            웨딩홀 고유의 조명과 인테리어를 깊이 있게 해석하여 가장 돋보이는 구도를 찾아냅니다.
          </p>
        </div>

        {/* Portfolio Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {previewItems.map((item, index) => (
            <div
              key={item.id}
              className="group bg-[#f5f1ea] rounded-2xl overflow-hidden border border-[#e8e2d8] hover:border-[#c7b698] transition-all hover:shadow-lg flex flex-col justify-between"
            >
              {/* Image Placeholder Frame */}
              <div className="aspect-[4/5] bg-gradient-to-br from-[#ebe3d5] to-[#ddd1bd] relative flex items-center justify-center p-6 text-center">
                <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-full bg-white/60 mx-auto flex items-center justify-center mb-3 backdrop-blur-sm text-[#8f7a56]">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <span className="text-xs tracking-widest uppercase text-[#6e5c3d] font-serif block mb-1">
                    Gallery Sample 0{index + 1}
                  </span>
                  <p className="text-lg font-serif text-[#2b261f]">{item.venue}</p>
                  <p className="text-xs text-[#5c5549] mt-1">{item.hall}</p>
                </div>
              </div>

              {/* Meta Info */}
              <div className="p-5 bg-white flex-1 flex flex-col justify-between border-t border-[#e8e2d8]">
                <div>
                  <span className="inline-block px-2.5 py-1 text-[11px] font-medium bg-[#f5f1ea] text-[#6e5c3d] rounded-md mb-2">
                    {item.mood}
                  </span>
                  <p className="text-xs text-[#5c5549] leading-relaxed">{item.tone}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Link */}
        <div className="mt-12 text-center">
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#2b261f] hover:text-[#8f7a56] border-b border-[#2b261f] hover:border-[#8f7a56] pb-1 transition-all"
          >
            <span>전체 갤러리 둘러보기</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
