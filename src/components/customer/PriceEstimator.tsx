'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CatalogService } from '@/services/catalogService';
import { Calculator, Check, ArrowRight, Info } from 'lucide-react';

export function PriceEstimator({ defaultProductId = 'album_plus' }: { defaultProductId?: string }) {
  const products = CatalogService.getProducts();
  const options = CatalogService.getOptions();
  const discounts = CatalogService.getCustomerSelectableDiscounts();

  const [selectedProductId, setSelectedProductId] = useState<string>(defaultProductId);
  const [selectedOptionIds, setSelectedOptionIds] = useState<string[]>([]);
  const [selectedDiscountIds, setSelectedDiscountIds] = useState<string[]>(['portfolio']); // 기본 포트폴리오 선택 추천

  const estimate = CatalogService.calculateEstimate({
    productId: selectedProductId,
    optionIds: selectedOptionIds,
    discountIds: selectedDiscountIds,
  });

  const toggleOption = (id: string) => {
    setSelectedOptionIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleDiscount = (id: string) => {
    setSelectedDiscountIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const queryParams = new URLSearchParams();
  queryParams.set('product', selectedProductId);
  if (selectedOptionIds.length > 0) {
    queryParams.set('options', selectedOptionIds.join(','));
  }
  if (selectedDiscountIds.length > 0) {
    queryParams.set('discounts', selectedDiscountIds.join(','));
  }

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e8e2d8] shadow-sm">
      <div className="flex items-center gap-2 mb-6 text-[#8f7a56]">
        <Calculator className="w-5 h-5" />
        <h3 className="font-serif text-lg sm:text-xl text-[#2b261f]">실시간 예상 견적 확인</h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Step 1: 상품 선택 */}
        <div>
          <label className="block text-xs font-semibold text-[#6e5c3d] tracking-wider uppercase mb-3">
            1. 기본 패키지 선택
          </label>
          <div className="space-y-3">
            {products.map((p) => {
              const isSelected = selectedProductId === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelectedProductId(p.id)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all ${
                    isSelected
                      ? 'border-[#8f7a56] bg-[#f5f1ea] shadow-sm ring-1 ring-[#8f7a56]'
                      : 'border-[#e8e2d8] hover:border-[#c7b698] bg-[#faf8f5]'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-serif font-medium text-sm text-[#2b261f]">{p.name}</span>
                    <span className="font-serif text-sm font-light text-[#2b261f]">
                      {p.base_price.toLocaleString()}원
                    </span>
                  </div>
                  <p className="text-[11px] text-[#5c5549] line-clamp-1">{p.subtitle}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: 옵션 선택 */}
        <div>
          <label className="block text-xs font-semibold text-[#6e5c3d] tracking-wider uppercase mb-3">
            2. 추가 옵션 (선택)
          </label>
          <div className="space-y-3">
            {options.map((opt) => {
              const isSelected = selectedOptionIds.includes(opt.id);
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => toggleOption(opt.id)}
                  className={`w-full text-left p-3.5 rounded-2xl border flex items-center justify-between transition-all ${
                    isSelected
                      ? 'border-[#8f7a56] bg-[#f5f1ea]'
                      : 'border-[#e8e2d8] hover:border-[#c7b698] bg-[#faf8f5]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                        isSelected ? 'bg-[#8f7a56] border-[#8f7a56] text-white' : 'border-[#b09a74]'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3" />}
                    </div>
                    <span className="text-xs font-medium text-[#2b261f]">{opt.name}</span>
                  </div>
                  <span className="text-xs text-[#6e5c3d]">+{opt.price.toLocaleString()}원</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 3: 적용 가능 혜택 & 최종 예상 금액 */}
        <div>
          <label className="block text-xs font-semibold text-[#6e5c3d] tracking-wider uppercase mb-3">
            3. 혜택 및 할인 신청
          </label>
          <div className="space-y-2 mb-6">
            {discounts.map((disc) => {
              const isSelected = selectedDiscountIds.includes(disc.id);
              return (
                <button
                  key={disc.id}
                  type="button"
                  onClick={() => toggleDiscount(disc.id)}
                  className={`w-full text-left p-2.5 rounded-xl border flex items-center justify-between text-xs transition-all ${
                    isSelected
                      ? 'border-[#8f7a56] bg-[#f5f1ea]'
                      : 'border-[#e8e2d8] hover:border-[#c7b698] bg-[#faf8f5]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3.5 h-3.5 rounded border flex items-center justify-center ${
                        isSelected ? 'bg-[#8f7a56] border-[#8f7a56] text-white' : 'border-[#b09a74]'
                      }`}
                    >
                      {isSelected && <Check className="w-2.5 h-2.5" />}
                    </div>
                    <span className="text-[#2b261f]">{disc.name}</span>
                  </div>
                  <span className="text-[#8f7a56] font-medium">-{disc.amount.toLocaleString()}원</span>
                </button>
              );
            })}
          </div>

          {/* Result Card */}
          <div className="bg-[#2b261f] text-[#faf8f5] p-5 rounded-2xl">
            <div className="space-y-1.5 text-xs text-[#c9bfaf] mb-4 pb-3 border-b border-[#473e32]">
              <div className="flex justify-between">
                <span>기본 패키지</span>
                <span>{estimate.productBasePrice.toLocaleString()}원</span>
              </div>
              {estimate.optionsTotal > 0 && (
                <div className="flex justify-between">
                  <span>추가 옵션 ({estimate.selectedOptions.length}개)</span>
                  <span>+{estimate.optionsTotal.toLocaleString()}원</span>
                </div>
              )}
              {estimate.discountsTotal > 0 && (
                <div className="space-y-1 pt-1 border-t border-[#473e32]/40">
                  <div className="flex justify-between text-[#c7b698] font-medium">
                    <span>신청 혜택 ({estimate.selectedDiscounts.length}개)</span>
                    <span>-{estimate.discountsTotal.toLocaleString()}원</span>
                  </div>
                  {estimate.selectedDiscounts.map((disc) => (
                    <div key={disc.id} className="flex justify-between text-[11px] text-[#c9bfaf] pl-1.5">
                      <span>• {disc.name}</span>
                      <span>-{disc.amount.toLocaleString()}원</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-between items-baseline mb-4">
              <span className="text-xs font-serif text-[#c7b698]">예상 견적 총액</span>
              <span className="text-2xl font-serif font-light text-white">
                {estimate.estimatedTotal.toLocaleString()}원
              </span>
            </div>

            <Link
              href={`/apply?${queryParams.toString()}`}
              className="w-full py-3 bg-[#8f7a56] hover:bg-[#a68e65] text-white rounded-xl text-xs font-medium tracking-wider transition-colors flex items-center justify-center gap-1.5"
            >
              <span>이 조건으로 촬영 신청하기</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <p className="text-[11px] text-[#9e9484] mt-3 leading-relaxed flex items-start gap-1">
              <Info className="w-3 h-3 shrink-0 mt-0.5 text-[#c7b698]" />
              <span>{estimate.notice}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
