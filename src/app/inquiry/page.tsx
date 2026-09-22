'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { RequestService } from '@/services/requestService';
import { Send, Calendar, MapPin, Clock, MessageSquare, AlertCircle } from 'lucide-react';

function InquiryFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultVenue = searchParams.get('venue') || '';

  const [customerName, setCustomerName] = useState('');
  const [contactType, setContactType] = useState<'phone' | 'kakao' | 'email'>('phone');
  const [contactValue, setContactValue] = useState('');
  const [weddingDate, setWeddingDate] = useState('');
  const [isDateUndecided, setIsDateUndecided] = useState(false);
  const [weddingTime, setWeddingTime] = useState('');
  const [venue, setVenue] = useState(defaultVenue);
  const [isVenueUndecided, setIsVenueUndecided] = useState(false);
  const [customerNote, setCustomerNote] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 더블 서브밋 방지
    if (isSubmitting) return;

    if (!customerName.trim()) {
      setErrorMessage('성함 또는 호칭을 입력해주세요.');
      return;
    }
    if (!contactValue.trim()) {
      setErrorMessage('연락처(또는 카카오ID/이메일)를 입력해주세요.');
      return;
    }
    if (!isDateUndecided && !weddingDate.trim()) {
      setErrorMessage('예식일을 선택하시거나 [일정 미정]에 체크해주세요.');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage('');

      // 클라이언트 수준 idempotency key 생성
      const idempotencyKey = `inq-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;

      const created = await RequestService.submitRequest({
        type: 'inquiry',
        customer_name: customerName,
        contact_type: contactType,
        contact_value: contactValue,
        wedding_date: isDateUndecided ? '미정' : weddingDate,
        is_date_undecided: isDateUndecided,
        wedding_time: weddingTime,
        venue: isVenueUndecided ? '미정' : venue,
        is_venue_undecided: isVenueUndecided,
        customer_note: customerNote,
        idempotency_key: idempotencyKey,
      });

      router.push(`/request/success?number=${created.request_number}&type=inquiry`);
    } catch (err: any) {
      setErrorMessage('접수 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-600 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* 고객 기본 정보 */}
      <div className="space-y-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[#6e5c3d]">1. 문의자 정보</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-[#2b261f] mb-1.5">
              성함 또는 호칭 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="예: 김민수 신랑님 또는 이서연"
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
                placeholder={contactType === 'phone' ? '010-0000-0000' : 'ID 또는 이메일'}
                className="flex-1 px-4 py-3 rounded-xl border border-[#e8e2d8] focus:border-[#8f7a56] focus:outline-none text-xs bg-white"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 예식 일정 정보 */}
      <div className="space-y-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[#6e5c3d]">2. 예식 일정 및 장소</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-medium text-[#2b261f]">예식일자</label>
              <label className="text-[11px] text-[#8f7a56] flex items-center gap-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isDateUndecided}
                  onChange={(e) => setIsDateUndecided(e.target.checked)}
                  className="rounded border-[#c7b698] text-[#8f7a56] focus:ring-[#8f7a56]"
                />
                <span>날짜 미정</span>
              </label>
            </div>
            <input
              type="date"
              disabled={isDateUndecided}
              value={weddingDate}
              onChange={(e) => setWeddingDate(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[#e8e2d8] focus:border-[#8f7a56] focus:outline-none text-xs bg-white disabled:bg-[#f5f1ea] disabled:text-[#9e9484]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#2b261f] mb-1.5">예식 시간</label>
            <input
              type="text"
              value={weddingTime}
              onChange={(e) => setWeddingTime(e.target.value)}
              placeholder="예: 13시 30분 또는 미정"
              className="w-full px-4 py-3 rounded-xl border border-[#e8e2d8] focus:border-[#8f7a56] focus:outline-none text-xs bg-white"
            />
          </div>

          <div className="sm:col-span-2">
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-medium text-[#2b261f]">예식 웨딩홀 장소</label>
              <label className="text-[11px] text-[#8f7a56] flex items-center gap-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isVenueUndecided}
                  onChange={(e) => setIsVenueUndecided(e.target.checked)}
                  className="rounded border-[#c7b698] text-[#8f7a56] focus:ring-[#8f7a56]"
                />
                <span>장소 미정 (투어 중)</span>
              </label>
            </div>
            <input
              type="text"
              disabled={isVenueUndecided}
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              placeholder="예: 더채플앳청담 커스티아홀 또는 고려 중인 장소"
              className="w-full px-4 py-3 rounded-xl border border-[#e8e2d8] focus:border-[#8f7a56] focus:outline-none text-xs bg-white disabled:bg-[#f5f1ea] disabled:text-[#9e9484]"
            />
          </div>
        </div>
      </div>

      {/* 문의 내용 */}
      <div className="space-y-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[#6e5c3d]">3. 문의 내용</h3>
        <div>
          <textarea
            rows={4}
            value={customerNote}
            onChange={(e) => setCustomerNote(e.target.value)}
            placeholder="궁금하신 점이나 고려 중인 촬영 내용(메이크업샵 동행 여부, 2인 촬영 등)을 자유롭게 남겨주세요."
            className="w-full px-4 py-3 rounded-xl border border-[#e8e2d8] focus:border-[#8f7a56] focus:outline-none text-xs bg-white leading-relaxed"
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-4 border-t border-[#f1ede7]">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 bg-[#2b261f] hover:bg-[#473e32] disabled:bg-[#9e9484] text-[#faf8f5] rounded-full text-xs font-medium tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
        >
          {isSubmitting ? (
            <span>접수 중입니다...</span>
          ) : (
            <>
              <span>촬영 가능 여부 문의 접수하기</span>
              <Send className="w-4 h-4" />
            </>
          )}
        </button>
        <p className="text-[11px] text-[#9e9484] text-center mt-3">
          개인정보는 일정 안내 및 상담 목적으로만 안전하게 사용됩니다.
        </p>
      </div>
    </form>
  );
}

export default function InquiryPage() {
  return (
    <div className="py-16 sm:py-24 bg-[#faf8f5]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <p className="text-xs font-serif tracking-[0.25em] text-[#8f7a56] uppercase mb-2">Inquiry</p>
          <h1 className="text-3xl font-serif text-[#2b261f]">촬영 일정 문의</h1>
          <p className="mt-3 text-xs sm:text-sm text-[#5c5549] leading-relaxed">
            원하시는 예식 날짜의 예약 가능 여부와 상세 안내를 빠르게 확인해 드립니다.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#e8e2d8] shadow-sm">
          <Suspense fallback={<div className="p-8 text-center text-xs text-[#9e9484]">로딩 중...</div>}>
            <InquiryFormContent />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
