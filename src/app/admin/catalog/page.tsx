import React from 'react';
import { CatalogService } from '@/services/catalogService';
import { PolicyService } from '@/services/policyService';
import { BookOpen, AlertTriangle, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

export default function AdminCatalogPage() {
  const products = CatalogService.getProducts();
  const options = CatalogService.getOptions();
  const discounts = CatalogService.getDiscounts();
  const policy = PolicyService.getCurrentPolicy();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-serif text-[#2b261f]">카탈로그 및 운영 정책 점검</h1>
        <p className="text-xs text-[#5c5549] mt-1">
          중앙 Config(`src/config/...`)에 정의된 현재 상품 가격, 옵션, 할인 및 미확정 DRAFT 정책 현황입니다.
        </p>
      </div>

      {/* Draft Policy Warning Banner */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-start gap-2.5">
        <AlertTriangle className="w-5 h-5 shrink-0 text-amber-600 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold">정책 수정 안내 (Single Source of Truth)</p>
          <p className="leading-relaxed text-[#735738]">
            본 V0/V1 단계에서는 UI 화면에서 데이터를 직접 수정하지 않고, 코드 내의 중앙 Config 파일(`products.ts`, `options.ts`, `discounts.ts`, `contractPolicy.ts`)을 한 번 수정하면 상품/신청/계약서 등 모든 시스템에 즉시 반영됩니다.
          </p>
        </div>
      </div>

      {/* 1. 상품 설정 */}
      <div className="bg-white p-6 rounded-2xl border border-[#e8e2d8] shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-[#f1ede7] pb-3">
          <div className="flex items-center gap-2 text-[#8f7a56]">
            <BookOpen className="w-4 h-4" />
            <h2 className="font-serif text-base text-[#2b261f]">상품 패키지 목록</h2>
          </div>
          <span className="text-[11px] text-[#73695c]">src/config/products.ts</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {products.map((p) => (
            <div key={p.id} className="p-4 rounded-xl border border-[#e8e2d8] bg-[#faf8f5] text-xs space-y-2">
              <div className="flex justify-between items-baseline">
                <span className="font-semibold text-[#2b261f] text-sm">{p.name} ({p.id})</span>
                <span className="font-serif font-medium text-[#2b261f]">{p.base_price.toLocaleString()}원</span>
              </div>
              <p className="text-[#5c5549]">{p.subtitle}</p>
              <div className="text-[11px] text-[#73695c] space-y-0.5 pt-2 border-t border-[#f1ede7]">
                <p>• {p.original_count} | 보정 {p.retouched_count}장</p>
                <p>• {p.album_spec}</p>
                {p.needs_confirmation && (
                  <span className="inline-block mt-1 px-2 py-0.5 bg-amber-100 text-amber-800 rounded font-medium text-[10px]">
                    [DRAFT / 정책 확인 필요] {p.policy_note}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. 추가 옵션 & 할인 목록 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Options */}
        <div className="bg-white p-6 rounded-2xl border border-[#e8e2d8] shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#f1ede7] pb-3">
            <h3 className="font-serif text-base text-[#2b261f]">추가 옵션</h3>
            <span className="text-[11px] text-[#73695c]">src/config/options.ts</span>
          </div>
          <div className="space-y-2 text-xs">
            {options.map((opt) => (
              <div key={opt.id} className="p-3 rounded-xl bg-[#faf8f5] flex justify-between items-center">
                <div>
                  <span className="font-medium text-[#2b261f]">{opt.name}</span>
                  <span className="text-[11px] text-[#73695c] block">{opt.description}</span>
                </div>
                <span className="font-medium text-[#8f7a56]">+{opt.price.toLocaleString()}원</span>
              </div>
            ))}
          </div>
        </div>

        {/* Discounts */}
        <div className="bg-white p-6 rounded-2xl border border-[#e8e2d8] shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#f1ede7] pb-3">
            <h3 className="font-serif text-base text-[#2b261f]">할인 및 프로모션 혜택</h3>
            <span className="text-[11px] text-[#73695c]">src/config/discounts.ts</span>
          </div>
          <div className="space-y-2 text-xs">
            {discounts.map((d) => (
              <div key={d.id} className="p-3 rounded-xl bg-[#faf8f5] flex justify-between items-center">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium text-[#2b261f]">{d.name}</span>
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded font-medium ${
                        d.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {d.status === 'confirmed' ? '확정' : 'DRAFT'}
                    </span>
                  </div>
                  <span className="text-[11px] text-[#73695c] block">{d.description}</span>
                </div>
                <span className="font-medium text-[#8f7a56]">-{d.amount.toLocaleString()}원</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. 계약 약관 설정 */}
      <div className="bg-white p-6 rounded-2xl border border-[#e8e2d8] shadow-sm space-y-4 text-xs">
        <div className="flex items-center justify-between border-b border-[#f1ede7] pb-3">
          <h3 className="font-serif text-base text-[#2b261f]">계약 표준 약관 현황 (v{policy.version})</h3>
          <span className="text-[11px] text-[#73695c]">src/config/contractPolicy.ts</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[#5c5549]">
          <p>• 기본 계약금(예약금): <span className="font-medium text-[#2b261f]">{policy.default_deposit_amount.toLocaleString()}원</span></p>
          <p>• 납기 규정: <span className="font-medium text-[#2b261f]">{policy.delivery_timeline}</span></p>
          <p>• 파일 규격: <span className="font-medium text-[#2b261f]">{policy.image_spec}</span></p>
          <p>• 보관 정책: <span className="font-medium text-[#2b261f]">{policy.backup_retention}</span></p>
        </div>
      </div>
    </div>
  );
}
