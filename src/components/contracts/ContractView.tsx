import React from 'react';
import { ContractSnapshot } from '@/types/contract';
import { Camera, Calendar, MapPin, Check, ShieldCheck, Printer, Download } from 'lucide-react';

interface Props {
  snapshot: ContractSnapshot;
  isDraft?: boolean;
}

export function ContractView({ snapshot, isDraft = false }: Props) {
  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-[#e8e2d8] p-8 sm:p-12 shadow-sm text-[#2b261f] print:p-0 print:border-none print:shadow-none">
      {/* Print Action Bar (화면에서만 노출, 인쇄 시 자동 숨김) */}
      <div className="flex justify-end mb-4 print:hidden">
        <button
          type="button"
          onClick={handlePrint}
          className="px-4 py-2 bg-[#2b261f] hover:bg-[#473e32] text-[#faf8f5] rounded-full text-xs font-medium flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
          title="A4 규격 PDF로 저장하거나 종이로 인쇄합니다"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>계약서 PDF 저장 / 인쇄</span>
        </button>
      </div>

      {/* Header */}
      <div className="border-b border-[#e8e2d8] pb-6 mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#8f7a56] mb-2">
            <Camera className="w-5 h-5" />
            <span className="font-serif tracking-[0.25em] text-xs font-semibold uppercase">
              DEAR MEMORY
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif text-[#2b261f]">
            본식스냅 촬영 계약서
          </h1>
        </div>

        <div className="text-left sm:text-right">
          {isDraft && (
            <span className="inline-block px-2.5 py-0.5 bg-amber-100 text-amber-800 text-[11px] font-medium rounded-full mb-1 print:hidden">
              DRAFT / 검토용
            </span>
          )}
          <p className="text-xs font-mono text-[#6e5c3d]">계약번호: {snapshot.contract_number}</p>
        </div>
      </div>

      {/* 1. 계약 당사자 및 예식 정보 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl bg-[#faf8f5] border border-[#f1ede7] mb-8 text-xs">
        <div>
          <h3 className="font-semibold text-[#8f7a56] uppercase tracking-wider mb-3">
            [고객 (의뢰인) 정보]
          </h3>
          <div className="space-y-1.5 text-[#5c5549]">
            <p>• 성함: <span className="font-medium text-[#2b261f]">{snapshot.customer_name}</span></p>
            <p>• 연락처: <span className="font-medium text-[#2b261f]">{snapshot.customer_contact}</span></p>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-[#8f7a56] uppercase tracking-wider mb-3">
            [예식 일정 및 장소]
          </h3>
          <div className="space-y-1.5 text-[#5c5549]">
            <p>• 예식일자: <span className="font-medium text-[#2b261f]">{snapshot.wedding_date}</span></p>
            <p>• 예식시간: <span className="font-medium text-[#2b261f]">{snapshot.wedding_time}</span></p>
            <p>
              • 장소: <span className="font-medium text-[#2b261f]">{snapshot.venue}</span>{' '}
              {snapshot.hall_name && <span>({snapshot.hall_name})</span>}
            </p>
          </div>
        </div>
      </div>

      {/* 2. 계약 상품 및 옵션 내역 */}
      <div className="mb-8">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[#6e5c3d] mb-3">
          1. 계약 상품 및 구성
        </h3>
        <div className="p-6 rounded-2xl border border-[#e8e2d8] bg-white space-y-4 text-xs">
          <div className="flex justify-between items-baseline border-b border-[#f1ede7] pb-3">
            <span className="font-serif text-base font-medium text-[#2b261f]">{snapshot.product_name}</span>
            <span className="font-serif text-base font-light text-[#2b261f]">
              {snapshot.product_base_price.toLocaleString()}원
            </span>
          </div>

          <ul className="space-y-1.5 text-[#5c5549]">
            {snapshot.product_included_items.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-[#8f7a56] shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <div className="pt-2 text-[11px] text-[#73695c] space-y-1 bg-[#faf8f5] p-3 rounded-xl">
            <p>• 원본 제공: {snapshot.product_original_count}</p>
            <p>• 정밀 보정본: {snapshot.product_retouched_count}장</p>
            <p>• 앨범 사양: {snapshot.product_album_spec}</p>
          </div>
        </div>
      </div>

      {/* 3. 옵션 및 할인 내역 */}
      {(snapshot.options.length > 0 || snapshot.discounts.length > 0) && (
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          {/* Options */}
          <div className="p-5 rounded-2xl border border-[#e8e2d8] bg-white">
            <h4 className="font-semibold text-[#6e5c3d] mb-3">추가 옵션</h4>
            {snapshot.options.length === 0 ? (
              <p className="text-[#9e9484]">선택된 추가 옵션이 없습니다.</p>
            ) : (
              <ul className="space-y-2">
                {snapshot.options.map((opt, idx) => (
                  <li key={idx} className="flex justify-between">
                    <span className="text-[#5c5549]">{opt.name}</span>
                    <span className="font-medium text-[#2b261f]">+{opt.price.toLocaleString()}원</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Discounts */}
          <div className="p-5 rounded-2xl border border-[#e8e2d8] bg-white">
            <h4 className="font-semibold text-[#6e5c3d] mb-3">적용 혜택 / 할인</h4>
            {snapshot.discounts.length === 0 ? (
              <p className="text-[#9e9484]">적용된 할인이 없습니다.</p>
            ) : (
              <ul className="space-y-2">
                {snapshot.discounts.map((disc, idx) => (
                  <li key={idx} className="flex justify-between">
                    <span className="text-[#5c5549]">{disc.name}</span>
                    <span className="font-medium text-[#8f7a56]">-{disc.price.toLocaleString()}원</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {/* 4. 금액 정산 내역 */}
      <div className="p-6 rounded-2xl bg-[#2b261f] text-[#faf8f5] mb-8 text-xs space-y-3">
        <div className="flex justify-between text-[#c9bfaf]">
          <span>기본 상품 금액</span>
          <span>{snapshot.total_base_price.toLocaleString()}원</span>
        </div>
        {snapshot.total_options_price > 0 && (
          <div className="flex justify-between text-[#c9bfaf]">
            <span>추가 옵션 합계</span>
            <span>+{snapshot.total_options_price.toLocaleString()}원</span>
          </div>
        )}
        {snapshot.total_discount_amount > 0 && (
          <div className="flex justify-between text-[#c7b698]">
            <span>할인 혜택 합계</span>
            <span>-{snapshot.total_discount_amount.toLocaleString()}원</span>
          </div>
        )}

        <div className="pt-3 border-t border-[#473e32] flex justify-between items-baseline">
          <span className="font-serif text-sm text-[#c7b698]">최종 계약 총액 (VAT 포함)</span>
          <span className="text-2xl font-serif font-light text-white">
            {snapshot.final_total_price.toLocaleString()}원
          </span>
        </div>

        <div className="pt-3 border-t border-[#473e32] grid grid-cols-2 gap-4 text-[11px] text-[#c9bfaf]">
          <div>
            <span className="block text-[#c7b698] font-medium">계약금 (예약금)</span>
            <span className="text-sm font-serif text-white">{snapshot.deposit_amount.toLocaleString()}원</span>
            <span className="block text-[#9e9484]">계약 후 48시간 이내 입금</span>
          </div>
          <div>
            <span className="block text-[#c7b698] font-medium">잔금</span>
            <span className="text-sm font-serif text-white">{snapshot.balance_amount.toLocaleString()}원</span>
            <span className="block text-[#9e9484]">예식 7일 전 완납</span>
          </div>
        </div>
      </div>

      {/* 5. 납품 및 일정 안내 */}
      <div className="p-5 rounded-2xl bg-[#faf8f5] border border-[#f1ede7] mb-8 text-xs space-y-2 text-[#5c5549]">
        <h4 className="font-semibold text-[#6e5c3d]">2. 촬영 범위 및 결과물 제공</h4>
        <p>• 촬영 범위: {snapshot.shooting_scope}</p>
        <p>• 납품 일정: {snapshot.delivery_schedule}</p>
      </div>

      {/* 6. 계약 약관 전문 (스냅샷 고정 약관) */}
      <div className="border-t border-[#e8e2d8] pt-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[#6e5c3d]">
            3. 계약 표준 약관 (버전: {snapshot.terms.version})
          </h4>
          <span className="text-[11px] text-[#8f7a56]">소비자분쟁해결기준 준수</span>
        </div>
        <div className="bg-[#faf8f5] p-5 rounded-2xl border border-[#f1ede7] max-h-60 overflow-y-auto text-[11px] text-[#5c5549] leading-relaxed whitespace-pre-line space-y-2">
          {snapshot.terms.all_terms_text}
        </div>
      </div>

      {/* 7. 기존 동의 내역이 있는 경우 표시 */}
      {snapshot.consent && (
        <div className="mt-8 p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 space-y-1">
          <div className="flex items-center gap-1.5 font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>고객 계약 동의 완료 내역</span>
          </div>
          <p>• 서명자 성함: {snapshot.consent.signer_name}</p>
          <p>• 약관 동의 일시: {new Date(snapshot.consent.terms_agreed_at || '').toLocaleString('ko-KR')}</p>
          <p>
            • 포트폴리오 활용 동의: {snapshot.consent.portfolio_agreed ? '동의함' : '동의하지 않음'}
          </p>
        </div>
      )}
    </div>
  );
}
