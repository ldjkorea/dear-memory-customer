'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Camera, ArrowRight, Filter } from 'lucide-react';

interface GalleryItem {
  id: string;
  venue: string;
  hall: string;
  category: 'dark' | 'bright' | 'chapel' | 'outdoor';
  categoryName: string;
  title: string;
  description: string;
}

const GALLERY_SAMPLES: GalleryItem[] = [
  {
    id: 'g-1',
    venue: '더채플앳청담',
    hall: '커스티아홀',
    category: 'chapel',
    categoryName: '채플형',
    title: '따스한 조명 속 경건한 서약의 순간',
    description: '높은 층고의 웅장한 채플에서 울려 퍼지는 감동적인 예식을 고유의 온도로 기록했습니다.',
  },
  {
    id: 'g-2',
    venue: '빌라드지디 수서',
    hall: '르씨엘홀',
    category: 'bright',
    categoryName: '밝은 하우스',
    title: '자연 채광과 그리너리의 조화',
    description: '유리 천장으로 쏟아지는 화사한 햇살과 신랑신부님의 싱그러운 미소를 담았습니다.',
  },
  {
    id: 'g-3',
    venue: '그랜드힐컨벤션',
    hall: '사브리나홀',
    category: 'dark',
    categoryName: '어두운 호텔',
    title: '드라마틱한 핀조명과 깊이 있는 실루엣',
    description: '버진로드를 걷는 두 분에게 시선이 집중되는 럭셔리하고 우아한 명암 대비.',
  },
  {
    id: 'g-4',
    venue: '상록아트홀',
    hall: '그랜드디럭스홀',
    category: 'dark',
    categoryName: '어두운 호텔',
    title: '풍성한 플라워 샤워와 환희의 순간',
    description: '본식의 대미를 장식하는 행진 끝, 축복 가득한 꽃잎과 부부의 첫 입맞춤.',
  },
  {
    id: 'g-5',
    venue: '보코서울강남',
    hall: '루프탑가든',
    category: 'outdoor',
    categoryName: '야외 / 스페셜',
    title: '도심 속 특별한 가든 파티 웨딩',
    description: '자유로운 하객들과의 스냅, 석양 무렵 골든 아워의 로맨틱한 분위기.',
  },
  {
    id: 'g-6',
    venue: '아펠가모 선릉',
    hall: '단독홀',
    category: 'chapel',
    categoryName: '채플형',
    title: '단정하고 품격 있는 클래식 웨딩',
    description: '클래식한 인테리어와 정갈한 원판 가족사진, 세심한 신부대기실 스케치.',
  },
];

export default function GalleryPage() {
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const filteredItems =
    activeFilter === 'all'
      ? GALLERY_SAMPLES
      : GALLERY_SAMPLES.filter((item) => item.category === activeFilter);

  return (
    <div className="py-16 sm:py-24 bg-[#faf8f5]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-xs font-serif tracking-[0.25em] text-[#8f7a56] uppercase mb-2">Gallery</p>
          <h1 className="text-3xl sm:text-4xl font-serif text-[#2b261f]">포트폴리오</h1>
          <p className="mt-3 text-sm text-[#5c5549] leading-relaxed">
            실제 신랑신부님들의 소중한 순간들을 웨딩홀별 감각적인 앵글로 만나보세요.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {[
            { key: 'all', label: '전체' },
            { key: 'dark', label: '어두운 홀' },
            { key: 'bright', label: '밝은 / 하우스' },
            { key: 'chapel', label: '채플 웨딩' },
            { key: 'outdoor', label: '야외 / 가든' },
          ].map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveFilter(cat.key)}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                activeFilter === cat.key
                  ? 'bg-[#2b261f] text-[#faf8f5] shadow-sm'
                  : 'bg-[#ede7dd] text-[#5c5549] hover:bg-[#e3dacc]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Gallery Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl overflow-hidden border border-[#e8e2d8] hover:border-[#c7b698] transition-all hover:shadow-md flex flex-col justify-between group"
            >
              {/* Photo Frame Placeholder */}
              <div className="aspect-[4/3] bg-gradient-to-br from-[#ebe3d5] to-[#ddd1bd] relative flex items-center justify-center p-6 text-center overflow-hidden">
                <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
                <div className="relative z-10">
                  <div className="w-10 h-10 rounded-full bg-white/70 mx-auto flex items-center justify-center mb-2 text-[#8f7a56]">
                    <Camera className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] uppercase tracking-widest text-[#8f7a56] font-serif block">
                    {item.categoryName}
                  </span>
                  <p className="text-base font-serif text-[#2b261f] mt-1">{item.venue}</p>
                  <p className="text-xs text-[#6e5c3d]">{item.hall}</p>
                </div>
              </div>

              {/* Text Info */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-medium text-[#2b261f] mb-1">{item.title}</h3>
                  <p className="text-xs text-[#5c5549] leading-relaxed">{item.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#f1ede7] flex justify-between items-center text-xs">
                  <span className="text-[#8f7a56] font-medium">{item.venue}</span>
                  <Link
                    href={`/inquiry?venue=${encodeURIComponent(item.venue)}`}
                    className="text-[#5c5549] hover:text-[#2b261f] flex items-center gap-1 font-medium transition-colors"
                  >
                    <span>이 웨딩홀 문의</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Banner */}
        <div className="mt-16 bg-[#f5f1ea] rounded-3xl p-8 sm:p-10 text-center border border-[#e8e2d8]">
          <h2 className="text-xl font-serif text-[#2b261f]">찾으시는 웨딩홀의 포트폴리오가 궁금하신가요?</h2>
          <p className="text-xs text-[#5c5549] mt-2 mb-6">
            상담 문의 시 예식 장소를 적어주시면 해당 웨딩홀의 실제 촬영 레퍼런스를 개별 안내해드립니다.
          </p>
          <Link
            href="/inquiry"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#2b261f] text-[#faf8f5] rounded-full text-xs font-medium hover:bg-[#473e32] transition-colors"
          >
            <span>내 예식홀 촬영 문의하기</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
