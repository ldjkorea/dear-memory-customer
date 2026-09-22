'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CatalogService } from '@/services/catalogService';
import { RequestService } from '@/services/requestService';
import { Send, Check, AlertCircle, Info, Sparkles } from 'lucide-react';

function ApplyFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const products = CatalogService.getProducts();
  const options = CatalogService.getOptions();
  const discounts = CatalogService.getCustomerSelectableDiscounts();

  // URL 파라미터로부터 초기값 자동 설정 (Test 1 대응)
  const paramProduct = searchParams.get('product') || 'album_plus';
  const paramOptions = searchParams.get('options')?.split(',').filter(Boolean) || [];
  const paramDiscounts = searchParams.get('discounts')?.split(',').filter(Boolean) || ['portfolio'];

  const [productId, setProductId] = useState<string>(paramProduct);
  const [selectedOptionIds, setSelectedOptionIds] = useState<string[]>(paramOptions);
  const [selectedDiscountIds, setSelectedDiscountIds] = useState<string[]>(paramDiscounts);

  // 폼 입력 상태
  const [customerName, setCustomerName] = useState('');
  const [contactType, setContactType] = useState<'phone' | 'kakao' | 'email'>('phone');
  const [contactValue, setContactValue] = useState('');
  const [weddingDate, setWeddingDate] = useState('');
  const [weddingTime, setWeddingTime] = useState('');
  const [venue, setVenue] = useState('');
  const [hallName, setHallName] = useState('');
  const [customerNote, setCustomerNote] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const p = searchParams.get('product');
    if (p && products.some((item) => item.id === p)) {
      setProductId(p);
    }
  }, [searchParams, products]);

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

  const estimate = CatalogService.calculateEstimate({
    productId,
    optionIds: selectedOptionIds,
    discountIds: selectedDiscountIds,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Double submit 방지
    if (isSubmitting) return;

    if (!customerName.trim()) {
      setErrorMessage('성함(예: 신랑 또는 신부님 성함)을 입력해주세요.');
      return;
    }
    if (!contactValue.trim()) {
      setErrorMessage('회신받으실 연락처를 입력해주세요.');
      return;
    }
    if (!weddingDate.trim()) {
      setErrorMessage('예식 일자를 선택해주세요.');
      return;
    }
    if (!venue.trim()) {
      setErrorMessage('예식 장소(웨딩홀)를 입력해주세요.');
      return;
    }
    if (!productId) {
      setErrorMessage('촬영 패키지 상품을 선택해주세요.');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage('');

      // 클라이언트 수준 멱등키 생성
      const idempotencyKey = `app-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;

      const created = await RequestService.submitRequest({
        type: 'application',
        customer_name: customerName,
        contact_type: contactType,
        contact_value: contactValue,
        wedding_date: weddingDate,
        wedding_time: weddingTime || '미정',
        venue: venue,
        hall_name: hallName,
        product_id: productId,
        selected_option_ids: selectedOptionIds,
        selected_discount_ids: selectedDiscountIds,
        customer_note: customerNote,
        idempotency_key: idempotencyKey,
      });

      // 신청 접수 완료 페이지로 이동 (예약확정 아님 안내)
      router.push(`/request/success?number=${created.request_number}&type=application`);
    } catch (err: any) {
      setErrorMessage('신청서 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-600 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* 1. 상품 선택 */}
      <div>
        <div className="flex justify-between items-baseline mb-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#6e5c3d]">
            1. 촬영 상품 선택 <span className="text-red-500">*</span>
          </h3>
          <span className="text-[11px] text-[#8f7a56]">원하시는 패키지를 선택해주세요</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {products.map((p) => {
            const isSelected = productId === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setProductId(p.id)}
                className={`p-5 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? 'border-[#8f7a56] bg-[#f5f1ea] shadow-md ring-2 ring-[#8f7a56]'
                    : 'border-[#e8e2d8] hover:border-[#c7b698] bg-white'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-serif font-medium text-base text-[#2b261f]">{p.name}</span>
                  <span className="font-serif text-sm font-light text-[#2b261f]">
                    {p.base_price.toLocaleString()}원
                  </span>
                </div>
                <p className="text-xs text-[#8f7a56] mb-3">{p.subtitle}</p>
                <ul className="text-[11px] text-[#5c5549] space-y-1">
                  <li>• {p.original_count} 원본 / 보정 {p.retouched_count}장</li>
                  <li>• {p.album_spec}</li>
                </ul>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. 추가 옵션 */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[#6e5c3d] mb-4">
          2. 추가 옵션 (선택)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {options.map((opt) => {
            const isSelected = selectedOptionIds.includes(opt.id);
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => toggleOption(opt.id)}
                className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all ${
                  isSelected
                    ? 'border-[#8f7a56] bg-[#f5f1ea]'
                    : 'border-[#e8e2d8] hover:border-[#c7b698] bg-white'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-[#2b261f]">{opt.name}</span>
                    <div
                      className={`w-4 h-4 rounded border flex items-center justify-center ${
                        isSelected ? 'bg-[#8f7a56] border-[#8f7a56] text-white' : 'border-[#b09a74]'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3" />}
                    </div>
                  </div>
                  <p className="text-[11px] text-[#5c5549] mb-3">{opt.description}</p>
                </div>
                <span className="text-xs font-semibold text-[#8f7a56]">+{opt.price.toLocaleString()}원</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. 할인/혜택 신청 */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[#6e5c3d] mb-4">
          3. 적용 가능 혜택 신청
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {discounts.map((disc) => {
            const isSelected = selectedDiscountIds.includes(disc.id);
            return (
              <button
                key={disc.id}
                type="button"
                onClick={() => toggleDiscount(disc.id)}
                className={`p-3.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                  isSelected
                    ? 'border-[#8f7a56] bg-[#f5f1ea]'
                    : 'border-[#e8e2d8] hover:border-[#c7b698] bg-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-[#8f7a56] border-[#8f7a56] text-white' : 'border-[#b09a74]'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3" />}
                  </div>
                  <div>
                    <span className="text-xs font-medium text-[#2b261f] block">{disc.name}</span>
                    <span className="text-[10px] text-[#73695c]">{disc.description}</span>
                  </div>
                </div>
                <span className="text-xs text-[#8f7a56] font-medium shrink-0 ml-2">
                  -{disc.amount.toLocaleString()}원
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. 고객 및 예식 정보 */}
      <div className="space-y-4 pt-4 border-t border-[#f1ede7]">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[#6e5c3d]">
          4. 고객 정보 및 예식 세부 내용
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-[#2b261f] mb-1.5">
              성함 (신랑 또는 신부님) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="예: 김민수"
              className="w-full px-4 py-3 rounded-xl border border-[#e8e2d8] focus:border-[#8f7a56] focus:outline-none text-xs bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#2b261f] mb-1.5">
              회신받으실 연락처 <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <select
                value={contactType}
                onChange={(e) => setContactType(e.target.value as any)}
                className="px-3 py-3 rounded-xl border border-[#e8e2d8] text-xs bg-white"
              >
                <option value="phone">휴대폰</option>
                <option value="kakao">카카오ID</option>
                <option value="email">이메일</option>
              </select>
              <input
                type="text"
                required
                value={contactValue}
                onChange={(e) => setContactValue(e.target.value)}
                placeholder={contactType === 'phone' ? '010-1234-5678' : '연락 정보 입력'}
                className="flex-1 px-4 py-3 rounded-xl border border-[#e8e2d8] focus:border-[#8f7a56] focus:outline-none text-xs bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#2b261f] mb-1.5">
              예식 일자 <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              required
              value={weddingDate}
              onChange={(e) => setWeddingDate(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[#e8e2d8] focus:border-[#8f7a56] focus:outline-none text-xs bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#2b261f] mb-1.5">예식 시간</label>
            <input
              type="text"
              value={weddingTime}
              onChange={(e) => setWeddingTime(e.target.value)}
              placeholder="예: 14:00 (또는 미정)"
              className="w-full px-4 py-3 rounded-xl border border-[#e8e2d8] focus:border-[#8f7a56] focus:outline-none text-xs bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#2b261f] mb-1.5">
              웨딩홀 장소 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              placeholder="예: 더채플앳청담"
              className="w-full px-4 py-3 rounded-xl border border-[#e8e2d8] focus:border-[#8f7a56] focus:outline-none text-xs bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#2b261f] mb-1.5">홀 이름 (선택)</label>
            <input
              type="text"
              value={hallName}
              onChange={(e) => setHallName(e.target.value)}
              placeholder="예: 커스티아홀 (미정 시 생략 가능)"
              className="w-full px-4 py-3 rounded-xl border border-[#e8e2d8] focus:border-[#8f7a56] focus:outline-none text-xs bg-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-[#2b261f] mb-1.5">
            추가 요청사항 및 메모
          </label>
          <textarea
            rows={3}
            value={customerNote}
            onChange={(e) => setCustomerNote(e.target.value)}
            placeholder="촬영 시 특별히 신경 써주셨으면 하는 부분이나 하객 관련 특이사항을 적어주세요."
            className="w-full px-4 py-3 rounded-xl border border-[#e8e2d8] focus:border-[#8f7a56] focus:outline-none text-xs bg-white"
          />
        </div>
      </div>

      {/* 5. 예상 금액 요약 및 제출 */}
      <div className="bg-[#2b261f] text-[#faf8f5] p-6 sm:p-8 rounded-3xl space-y-4">
        <div className="flex justify-between items-baseline border-b border-[#473e32] pb-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#c7b698] font-serif block">
              Estimated Total
            </span>
            <span className="text-xl sm:text-2xl font-serif text-white">
              현재 선택 기준 예상 금액
            </span>
          </div>
          <span className="text-2xl sm:text-3xl font-serif font-light text-[#c7b698]">
            {estimate.estimatedTotal.toLocaleString()}원
          </span>
        </div>

        <div className="text-xs text-[#c9bfaf] space-y-1">
          <p>• 기본 패키지: {estimate.product?.name} ({estimate.productBasePrice.toLocaleString()}원)</p>
          {estimate.optionsTotal > 0 && (
            <p>• 추가 옵션: +{estimate.optionsTotal.toLocaleString()}원</p>
          )}
          {estimate.discountsTotal > 0 && (
            <p>• 신청 혜택: -{estimate.discountsTotal.toLocaleString()}원</p>
          )}
        </div>

        <p className="text-[11px] text-[#9e9484] flex items-start gap-1">
          <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[#c7b698]" />
          <span>{estimate.notice}</span>
        </p>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-[#8f7a56] hover:bg-[#a68e65] disabled:bg-[#5c5549] text-white rounded-full text-xs sm:text-sm font-medium tracking-wider transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
          >
            {isSubmitting ? (
              <span>접수 처리 중입니다...</span>
            ) : (
              <>
                <span>촬영 신청서 제출하기</span>
                <Send className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}

export default function ApplyPage() {
  return (
    <div className="py-16 sm:py-24 bg-[#faf8f5]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <p className="text-xs font-serif tracking-[0.25em] text-[#8f7a56] uppercase mb-2">Application</p>
          <h1 className="text-3xl font-serif text-[#2b261f]">본식스냅 촬영 신청</h1>
          <p className="mt-3 text-xs sm:text-sm text-[#5c5549] leading-relaxed">
            신청서를 제출해 주시면 대표작가가 일정을 검토한 후 계약 안내를 진행해 드립니다.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#e8e2d8] shadow-sm">
          <Suspense fallback={<div className="p-8 text-center text-xs text-[#9e9484]">로딩 중...</div>}>
            <ApplyFormContent />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
