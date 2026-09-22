'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ArrowRight, HelpCircle } from 'lucide-react';

interface FaqItem {
  q: string;
  a: string;
}

const FAQ_LIST: FaqItem[] = [
  {
    q: '예약은 어떤 과정으로 진행되나요?',
    a: '1) 웹사이트를 통해 촬영 문의 또는 신청서를 접수합니다. 2) 대표작가가 일정과 웨딩홀 동선을 확인한 후 촬영 가능 여부와 최종 견적을 안내드립니다. 3) 온라인 계약서 확인 및 동의 후 48시간 이내에 예약금을 입금하시면 예약이 최종 확정됩니다.',
  },
  {
    q: '예식 원본과 수정본은 언제 받아볼 수 있나요?',
    a: '전체 고화질 원본은 예식일 기준 3주 이내에 다운로드 링크로 전달됩니다. 원본 수령 후 고객님께서 직접 보정 컷을 셀렉해 주시면, 셀렉 완료일로부터 약 90일 이내에 세부 정밀 보정본과 앨범 제작이 완료되어 배송됩니다.',
  },
  {
    q: '촬영 원본 RAW 파일도 함께 제공되나요?',
    a: 'RAW 파일은 디어메모리 고유의 색감과 톤을 구현하기 위한 작업용 원시 데이터로 별도 제공되지 않습니다. 대신 인화 및 대형 액자 출력이 가능한 장축 3500px 이상의 최고화질 JPG 파일로 원본 전체를 제공해 드립니다.',
  },
  {
    q: '메이크업 촬영 옵션은 어디서부터 시작되나요?',
    a: '메이크업 샵 아웃(OUT) 약 1시간~1시간 30분 전부터 동행합니다. 베이스 단계 이후 색조 메이크업 마무리, 드레스 피팅, 베일 연출, 티아라 착용 및 웨딩카 탑승 순간까지 자연스럽고 감각적인 무드를 기록합니다.',
  },
  {
    q: '1인 촬영과 2인 촬영의 차이는 무엇인가요?',
    a: '1인 촬영은 메인 작가가 신부대기실과 본식, 원판, 연회장을 밀착하여 진행합니다. 2인 촬영(서브 작가 추가) 시에는 메인 작가가 신부님께 집중하는 동안 서브 작가가 로비의 신랑님과 양가 부모님, 반가운 하객들의 표정, 버진로드의 다양한 화각을 입체적으로 교차 기록할 수 있는 큰 장점이 있습니다.',
  },
  {
    q: '계약금 및 잔금은 어떻게 결제하나요?',
    a: '계약서 확인 및 동의 후 예약금(300,000원)을 입금하시면 예약이 확정되며, 잔금은 본식 7일 전까지 입금해 주시면 됩니다. 모든 금액은 현금영수증 및 세금계산서 발행이 가능한 VAT 포함 금액입니다.',
  },
  {
    q: '예약 취소 및 환불 기준은 어떻게 되나요?',
    a: '공정거래위원회 소비자분쟁해결기준을 엄격히 준수합니다. 계약 체결일로부터 14일 이내 취소 시 예약금 전액이 환불됩니다. 단, 계약 14일 경과 후 또는 예식일 90일 이내 취소 시에는 예약금 환불이 불가하거나 위약금이 발생할 수 있습니다.',
  },
];

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="py-16 sm:py-24 bg-[#faf8f5]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-xs font-serif tracking-[0.25em] text-[#8f7a56] uppercase mb-2">FAQ</p>
          <h1 className="text-3xl sm:text-4xl font-serif text-[#2b261f]">자주 묻는 질문</h1>
          <p className="mt-3 text-sm text-[#5c5549] leading-relaxed">
            신랑신부님들께서 가장 많이 문의하시는 질문들을 정리했습니다.
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-4 mb-16">
          {FAQ_LIST.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-[#e8e2d8] overflow-hidden transition-all shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full p-6 text-left flex justify-between items-center gap-4 hover:bg-[#faf8f5] transition-colors"
                >
                  <span className="font-serif text-base text-[#2b261f] flex items-center gap-3">
                    <span className="text-[#8f7a56] font-sans text-sm font-semibold">Q.</span>
                    {item.q}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#8f7a56] shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 pt-2 border-t border-[#f1ede7] text-xs sm:text-sm text-[#5c5549] leading-relaxed bg-[#faf8f5]/50">
                    <div className="flex items-start gap-3">
                      <span className="text-[#6e5c3d] font-semibold">A.</span>
                      <p className="whitespace-pre-line">{item.a}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="bg-[#f5f1ea] rounded-3xl p-8 text-center border border-[#e8e2d8]">
          <h3 className="text-lg font-serif text-[#2b261f] mb-2">추가로 궁금한 점이 있으신가요?</h3>
          <p className="text-xs text-[#5c5549] mb-6">
            예식 날짜와 장소를 남겨주시면 대표작가가 직접 친절히 상담해 드립니다.
          </p>
          <Link
            href="/inquiry"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#2b261f] text-[#faf8f5] rounded-full text-xs font-medium hover:bg-[#473e32] transition-colors"
          >
            <span>촬영 문의 남기기</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
