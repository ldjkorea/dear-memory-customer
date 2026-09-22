import React from 'react';
import Link from 'next/link';
import { CatalogService } from '@/services/catalogService';
import { PriceEstimator } from '@/components/customer/PriceEstimator';
import { Check, ArrowRight, Sparkles, Gift } from 'lucide-react';

export default function ProductPage() {
  const products = CatalogService.getProducts();
  const options = CatalogService.getOptions();
  const discounts = CatalogService.getDiscounts();

  return (
    <div className="py-16 sm:py-24 bg-[#faf8f5]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-xs font-serif tracking-[0.25em] text-[#8f7a56] uppercase mb-2">Package & Options</p>
          <h1 className="text-3xl sm:text-4xl font-serif text-[#2b261f]">상품 및 구성 안내</h1>
          <p className="mt-3 text-sm text-[#5c5549] leading-relaxed">
            두 분의 취향과 예식 스타일에 가장 적합한 패키지를 선택해 보세요. 모든 금액은 VAT 포함 정찰제입니다.
          </p>
        </div>

        {/* Products Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {products.map((p) => (
            <div
              key={p.id}
              className={`rounded-3xl p-8 sm:p-10 border flex flex-col justify-between transition-all ${
                p.id === 'album_plus'
                  ? 'bg-white border-[#c7b698] shadow-lg ring-1 ring-[#c7b698]/30 relative'
                  : 'bg-[#faf8f5] border-[#e8e2d8]'
              }`}
            >
              {p.badge && (
                <span className="absolute -top-3 left-10 px-3.5 py-1 bg-[#8f7a56] text-white text-[11px] font-medium tracking-wider uppercase rounded-full">
                  {p.badge}
                </span>
              )}

              <div>
                <div className="flex justify-between items-baseline mb-2">
                  <h2 className="text-2xl font-serif text-[#2b261f]">{p.name}</h2>
                  <span className="text-3xl font-serif font-light text-[#2b261f]">
                    {p.base_price.toLocaleString()}
                    <span className="text-sm font-sans text-[#6e5c3d] ml-1">원</span>
                  </span>
                </div>
                <p className="text-xs text-[#8f7a56] mb-6">{p.subtitle}</p>
                <p className="text-xs text-[#5c5549] leading-relaxed mb-8">{p.description}</p>

                <div className="space-y-4 mb-8">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#6e5c3d]">기본 제공 구성</h4>
                  <ul className="space-y-3 text-xs text-[#5c5549]">
                    {p.included_items.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-[#8f7a56] shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-[#f5f1ea] p-4 rounded-2xl space-y-2 text-xs text-[#5c5549] mb-8">
                  <div className="flex justify-between">
                    <span className="text-[#6e5c3d]">원본 제공</span>
                    <span className="font-medium text-[#2b261f]">{p.original_count}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6e5c3d]">정밀 보정본</span>
                    <span className="font-medium text-[#2b261f]">{p.retouched_count}장</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6e5c3d]">앨범 규격</span>
                    <span className="font-medium text-[#2b261f] text-right">{p.album_spec}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Link
                  href={`/apply?product=${p.id}`}
                  className="w-full py-3.5 bg-[#2b261f] hover:bg-[#473e32] text-[#faf8f5] rounded-full text-xs font-medium tracking-wider transition-colors flex items-center justify-center gap-2"
                >
                  <span>이 상품으로 촬영 신청</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href={`/product/${p.id}`}
                  className="w-full py-2.5 text-center block text-xs text-[#8f7a56] hover:text-[#2b261f] transition-colors"
                >
                  상품 상세 및 혜택 자세히 보기
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Addon Options & Discounts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
          {/* Options */}
          <div className="bg-white p-8 rounded-3xl border border-[#e8e2d8]">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-5 h-5 text-[#8f7a56]" />
              <h3 className="font-serif text-xl text-[#2b261f]">추가 촬영 옵션</h3>
            </div>
            <div className="space-y-4">
              {options.map((opt) => (
                <div key={opt.id} className="p-4 rounded-2xl bg-[#faf8f5] border border-[#f1ede7]">
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="text-sm font-medium text-[#2b261f]">{opt.name}</span>
                    <span className="text-sm font-serif text-[#8f7a56]">+{opt.price.toLocaleString()}원</span>
                  </div>
                  <p className="text-xs text-[#5c5549]">{opt.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Discounts */}
          <div className="bg-white p-8 rounded-3xl border border-[#e8e2d8]">
            <div className="flex items-center gap-2 mb-6">
              <Gift className="w-5 h-5 text-[#8f7a56]" />
              <h3 className="font-serif text-xl text-[#2b261f]">혜택 및 프로모션 안내</h3>
            </div>
            <div className="space-y-4">
              {discounts.map((disc) => (
                <div key={disc.id} className="p-4 rounded-2xl bg-[#faf8f5] border border-[#f1ede7]">
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="text-sm font-medium text-[#2b261f]">{disc.name}</span>
                    <span className="text-sm font-serif text-[#8f7a56]">-{disc.amount.toLocaleString()}원</span>
                  </div>
                  <p className="text-xs text-[#5c5549]">{disc.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Realtime Estimator */}
        <div className="mt-16">
          <PriceEstimator />
        </div>
      </div>
    </div>
  );
}
