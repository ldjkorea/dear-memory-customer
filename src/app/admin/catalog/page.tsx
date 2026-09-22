'use client';

import React, { useState, useEffect } from 'react';
import { CatalogService } from '@/services/catalogService';
import { PolicyService } from '@/services/policyService';
import { ProductItem, OptionItem, DiscountItem } from '@/types/catalog';
import {
  BookOpen,
  Edit3,
  Check,
  RotateCcw,
  Plus,
  Save,
  X,
  Sparkles,
  ShieldCheck,
  Tag,
  DollarSign,
  Layers,
} from 'lucide-react';

export default function AdminCatalogPage() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [options, setOptions] = useState<OptionItem[]>([]);
  const [discounts, setDiscounts] = useState<DiscountItem[]>([]);
  const policy = PolicyService.getCurrentPolicy();

  // 편집 모달 상태
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [editingOption, setEditingOption] = useState<OptionItem | null>(null);
  const [editingDiscount, setEditingDiscount] = useState<DiscountItem | null>(null);
  const [isAddingOption, setIsAddingOption] = useState(false);
  const [newOption, setNewOption] = useState<Partial<OptionItem>>({
    name: '',
    price: 100000,
    description: '',
    active: true,
  });

  const loadData = () => {
    setProducts(CatalogService.getProducts());
    setOptions(CatalogService.getOptions());
    setDiscounts(CatalogService.getDiscounts());
  };

  useEffect(() => {
    loadData();
  }, []);

  // 1. 상품 저장
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    await CatalogService.updateProduct(editingProduct.id, {
      name: editingProduct.name,
      base_price: Number(editingProduct.base_price),
      subtitle: editingProduct.subtitle,
      original_count: editingProduct.original_count,
      retouched_count: Number(editingProduct.retouched_count),
      album_spec: editingProduct.album_spec,
    });
    setEditingProduct(null);
    loadData();
    alert(`[${editingProduct.name}] 상품 설정이 저장되었습니다.`);
  };

  // 2. 옵션 저장
  const handleSaveOption = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOption) return;
    await CatalogService.updateOption(editingOption.id, {
      name: editingOption.name,
      price: Number(editingOption.price),
      description: editingOption.description,
    });
    setEditingOption(null);
    loadData();
    alert(`[${editingOption.name}] 옵션이 저장되었습니다.`);
  };

  // 3. 새 옵션 추가
  const handleAddOption = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOption.name?.trim()) {
      alert('옵션명을 입력해 주세요.');
      return;
    }
    const optionItem: OptionItem = {
      id: 'opt_' + Math.random().toString(36).substring(2, 9),
      name: newOption.name.trim(),
      price: Number(newOption.price) || 0,
      description: newOption.description || '',
      active: true,
      display_order: options.length + 1,
      needs_confirmation: false,
    };
    await CatalogService.addOption(optionItem);
    setIsAddingOption(false);
    setNewOption({ name: '', price: 100000, description: '', active: true });
    loadData();
    alert('새 옵션이 추가되었습니다.');
  };

  // 4. 할인 저장
  const handleSaveDiscount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDiscount) return;
    await CatalogService.updateDiscount(editingDiscount.id, {
      name: editingDiscount.name,
      amount: Number(editingDiscount.amount),
      description: editingDiscount.description,
    });
    setEditingDiscount(null);
    loadData();
    alert(`[${editingDiscount.name}] 혜택이 저장되었습니다.`);
  };

  // 5. 기본값 초기화
  const handleResetToDefault = async () => {
    if (confirm('모든 상품, 옵션, 할인 설정을 시스템 초기 기본값으로 복원하시겠습니까?')) {
      await CatalogService.resetCatalogToDefault();
      loadData();
      alert('초기 설정값으로 복원되었습니다.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header & Reset Action */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#e8e2d8] pb-5">
        <div>
          <h1 className="text-2xl font-serif text-[#2b261f]">상품 및 가격 정책 관리</h1>
          <p className="text-xs text-[#5c5549] mt-1">
            대표 관리자 화면에서 상품 가격, 옵션 금액, 할인 혜택을 직접 수정하고 즉시 반영합니다.
          </p>
        </div>

        <button
          type="button"
          onClick={handleResetToDefault}
          className="px-3.5 py-2 border border-[#d8cdbc] bg-white hover:bg-[#faf8f5] text-[#73695c] rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5 text-[#8f7a56]" />
          <span>기본값으로 복원</span>
        </button>
      </div>

      {/* 1. 상품 패키지 관리 */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-[#e8e2d8] shadow-sm space-y-5">
        <div className="flex justify-between items-center border-b border-[#f1ede7] pb-3">
          <div className="flex items-center gap-2 text-[#8f7a56]">
            <BookOpen className="w-4 h-4" />
            <h2 className="font-serif text-base text-[#2b261f]">1. 상품 패키지 목록</h2>
          </div>
          <span className="text-[11px] text-[#8f7a56] font-medium">실시간 고객 화면 연동 중</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {products.map((p) => (
            <div
              key={p.id}
              className="p-5 rounded-2xl border border-[#e8e2d8] bg-[#faf8f5] text-xs space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <span className="font-serif font-semibold text-[#2b261f] text-base block">
                      {p.name}
                    </span>
                    <span className="text-[11px] text-[#8f7a56] font-mono">{p.id}</span>
                  </div>
                  <span className="text-base font-serif font-bold text-[#8f7a56] whitespace-nowrap">
                    {p.base_price.toLocaleString()}원
                  </span>
                </div>

                <p className="text-[#5c5549] text-[11.5px] leading-relaxed break-keep">{p.subtitle}</p>

                <div className="text-[11.5px] text-[#73695c] space-y-1 pt-2.5 border-t border-[#ede7dd]">
                  <div className="flex justify-between py-0.5">
                    <span className="text-[#9e9484]">원본 / 보정:</span>
                    <span className="font-medium text-[#2b261f]">{p.original_count} / 보정 {p.retouched_count}장</span>
                  </div>
                  <div className="flex justify-between py-0.5">
                    <span className="text-[#9e9484]">앨범 사양:</span>
                    <span className="font-medium text-[#2b261f]">{p.album_spec}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setEditingProduct(p)}
                  className="w-full py-2.5 bg-[#2b261f] hover:bg-[#473e32] text-white rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>상품 정보 및 가격 수정</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. 추가 옵션 & 할인 목록 (그리드 레이아웃) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Options */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-[#e8e2d8] shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-[#f1ede7] pb-3">
            <div className="flex items-center gap-2 text-[#8f7a56]">
              <Layers className="w-4 h-4" />
              <h3 className="font-serif text-base text-[#2b261f]">2. 추가 옵션 관리</h3>
            </div>
            <button
              type="button"
              onClick={() => setIsAddingOption(true)}
              className="px-2.5 py-1 bg-[#f5f1ea] hover:bg-[#ede7dd] text-[#6e5c3d] rounded-lg text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>새 옵션 추가</span>
            </button>
          </div>

          <div className="space-y-2.5 text-xs">
            {options.map((opt) => (
              <div
                key={opt.id}
                className="p-3.5 rounded-xl bg-[#faf8f5] border border-[#f1ede7] flex justify-between items-center gap-3 hover:border-[#c7b698] transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-semibold text-[#2b261f]">{opt.name}</span>
                    <span className="font-semibold text-[#8f7a56] font-mono whitespace-nowrap ml-2">
                      +{opt.price.toLocaleString()}원
                    </span>
                  </div>
                  <p className="text-[11px] text-[#73695c] truncate">{opt.description}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingOption(opt)}
                  className="p-1.5 text-[#8f7a56] hover:text-[#2b261f] rounded-lg hover:bg-white transition-colors shrink-0"
                  title="수정"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Discounts */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-[#e8e2d8] shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-[#f1ede7] pb-3">
            <div className="flex items-center gap-2 text-[#8f7a56]">
              <Tag className="w-4 h-4" />
              <h3 className="font-serif text-base text-[#2b261f]">3. 할인 및 프로모션 혜택</h3>
            </div>
            <span className="text-[11px] text-[#73695c]">자동 계산 연동</span>
          </div>

          <div className="space-y-2.5 text-xs">
            {discounts.map((d) => (
              <div
                key={d.id}
                className="p-3.5 rounded-xl bg-[#faf8f5] border border-[#f1ede7] flex justify-between items-center gap-3 hover:border-[#c7b698] transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-semibold text-[#2b261f]">{d.name}</span>
                    <span className="font-semibold text-emerald-700 font-mono whitespace-nowrap ml-2">
                      -{d.amount.toLocaleString()}원
                    </span>
                  </div>
                  <p className="text-[11px] text-[#73695c] truncate">{d.description}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingDiscount(d)}
                  className="p-1.5 text-[#8f7a56] hover:text-[#2b261f] rounded-lg hover:bg-white transition-colors shrink-0"
                  title="수정"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. 계약 약관 규정 점검 */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-[#e8e2d8] shadow-sm space-y-4 text-xs">
        <div className="flex items-center justify-between border-b border-[#f1ede7] pb-3">
          <div className="flex items-center gap-2 text-[#8f7a56]">
            <ShieldCheck className="w-4 h-4" />
            <h3 className="font-serif text-base text-[#2b261f]">4. 계약 표준 약관 규정 (v{policy.version})</h3>
          </div>
          <span className="text-[11px] text-emerald-700 font-medium">13개 조항 공식 약관 적용 중</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[#5c5549] text-[11.5px] leading-relaxed">
          <div className="p-3 rounded-xl bg-[#faf8f5] border border-[#f1ede7]">
            <span className="text-[#9e9484] block mb-0.5">기본 계약금(예약금):</span>
            <span className="font-semibold text-[#2b261f]">{policy.default_deposit_amount.toLocaleString()}원 (24시간 내 입금)</span>
          </div>
          <div className="p-3 rounded-xl bg-[#faf8f5] border border-[#f1ede7]">
            <span className="text-[#9e9484] block mb-0.5">환불 규정:</span>
            <span className="font-semibold text-[#2b261f]">입금 후 72시간 이내에만 전액 환불 가능</span>
          </div>
          <div className="p-3 rounded-xl bg-[#faf8f5] border border-[#f1ede7]">
            <span className="text-[#9e9484] block mb-0.5">제공 규격:</span>
            <span className="font-semibold text-[#2b261f]">{policy.image_spec}</span>
          </div>
          <div className="p-3 rounded-xl bg-[#faf8f5] border border-[#f1ede7]">
            <span className="text-[#9e9484] block mb-0.5">데이터 보관:</span>
            <span className="font-semibold text-[#2b261f]">{policy.backup_retention}</span>
          </div>
        </div>
      </div>

      {/* ===================== MODALS ===================== */}

      {/* 1. 상품 수정 모달 */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveProduct}
            className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 border border-[#e8e2d8] shadow-2xl text-xs space-y-4"
          >
            <div className="flex justify-between items-center border-b border-[#f1ede7] pb-3 sticky top-0 bg-white z-10">
              <h3 className="font-serif text-base text-[#2b261f]">상품 패키지 정보 수정</h3>
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="p-1 text-[#9e9484] hover:text-[#2b261f]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block font-semibold text-[#6e5c3d] mb-1">상품명</label>
              <input
                type="text"
                required
                value={editingProduct.name}
                onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#e8e2d8] text-xs bg-[#faf8f5]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#6e5c3d] mb-1">기본 가격 (원)</label>
              <input
                type="number"
                step={10000}
                required
                value={editingProduct.base_price}
                onChange={(e) => setEditingProduct({ ...editingProduct, base_price: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-[#e8e2d8] text-xs bg-[#faf8f5]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#6e5c3d] mb-1">부제 (설명 문구)</label>
              <input
                type="text"
                required
                value={editingProduct.subtitle}
                onChange={(e) => setEditingProduct({ ...editingProduct, subtitle: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#e8e2d8] text-xs bg-[#faf8f5]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-[#6e5c3d] mb-1">원본 제공</label>
                <input
                  type="text"
                  required
                  value={editingProduct.original_count}
                  onChange={(e) => setEditingProduct({ ...editingProduct, original_count: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#e8e2d8] text-xs bg-[#faf8f5]"
                />
              </div>
              <div>
                <label className="block font-semibold text-[#6e5c3d] mb-1">보정 장수</label>
                <input
                  type="number"
                  required
                  value={editingProduct.retouched_count}
                  onChange={(e) => setEditingProduct({ ...editingProduct, retouched_count: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-[#e8e2d8] text-xs bg-[#faf8f5]"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-[#6e5c3d] mb-1">앨범 사양</label>
              <input
                type="text"
                required
                value={editingProduct.album_spec}
                onChange={(e) => setEditingProduct({ ...editingProduct, album_spec: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#e8e2d8] text-xs bg-[#faf8f5]"
              />
            </div>

            <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-3 border-t border-[#f1ede7]">
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="w-full sm:w-auto px-4 py-2 rounded-xl border border-[#e8e2d8] text-[#5c5549] cursor-pointer text-center"
              >
                취소
              </button>
              <button
                type="submit"
                className="w-full sm:w-auto px-5 py-2 bg-[#2b261f] hover:bg-[#473e32] text-white rounded-xl font-medium cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>저장하기</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 2. 옵션 수정 모달 */}
      {editingOption && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveOption}
            className="bg-white rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 border border-[#e8e2d8] shadow-2xl text-xs space-y-4"
          >
            <div className="flex justify-between items-center border-b border-[#f1ede7] pb-3 sticky top-0 bg-white z-10">
              <h3 className="font-serif text-base text-[#2b261f]">추가 옵션 수정</h3>
              <button
                type="button"
                onClick={() => setEditingOption(null)}
                className="p-1 text-[#9e9484] hover:text-[#2b261f]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block font-semibold text-[#6e5c3d] mb-1">옵션명</label>
              <input
                type="text"
                required
                value={editingOption.name}
                onChange={(e) => setEditingOption({ ...editingOption, name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#e8e2d8] text-xs bg-[#faf8f5]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#6e5c3d] mb-1">추가 금액 (원)</label>
              <input
                type="number"
                step={10000}
                required
                value={editingOption.price}
                onChange={(e) => setEditingOption({ ...editingOption, price: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-[#e8e2d8] text-xs bg-[#faf8f5]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#6e5c3d] mb-1">설명</label>
              <textarea
                rows={2}
                required
                value={editingOption.description}
                onChange={(e) => setEditingOption({ ...editingOption, description: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#e8e2d8] text-xs bg-[#faf8f5]"
              />
            </div>

            <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-3 border-t border-[#f1ede7]">
              <button
                type="button"
                onClick={() => setEditingOption(null)}
                className="w-full sm:w-auto px-4 py-2 rounded-xl border border-[#e8e2d8] text-[#5c5549] cursor-pointer text-center"
              >
                취소
              </button>
              <button
                type="submit"
                className="w-full sm:w-auto px-5 py-2 bg-[#2b261f] hover:bg-[#473e32] text-white rounded-xl font-medium cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>저장하기</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 3. 새 옵션 추가 모달 */}
      {isAddingOption && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleAddOption}
            className="bg-white rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 border border-[#e8e2d8] shadow-2xl text-xs space-y-4"
          >
            <div className="flex justify-between items-center border-b border-[#f1ede7] pb-3 sticky top-0 bg-white z-10">
              <h3 className="font-serif text-base text-[#2b261f]">새 추가 옵션 등록</h3>
              <button
                type="button"
                onClick={() => setIsAddingOption(false)}
                className="p-1 text-[#9e9484] hover:text-[#2b261f]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block font-semibold text-[#6e5c3d] mb-1">옵션명</label>
              <input
                type="text"
                required
                placeholder="예: 야간 연회장 2부 촬영"
                value={newOption.name}
                onChange={(e) => setNewOption({ ...newOption, name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#e8e2d8] text-xs bg-[#faf8f5]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#6e5c3d] mb-1">추가 금액 (원)</label>
              <input
                type="number"
                step={10000}
                required
                value={newOption.price}
                onChange={(e) => setNewOption({ ...newOption, price: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-[#e8e2d8] text-xs bg-[#faf8f5]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#6e5c3d] mb-1">설명</label>
              <textarea
                rows={2}
                required
                placeholder="옵션에 대한 간략한 설명을 적어주세요."
                value={newOption.description}
                onChange={(e) => setNewOption({ ...newOption, description: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#e8e2d8] text-xs bg-[#faf8f5]"
              />
            </div>

            <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-3 border-t border-[#f1ede7]">
              <button
                type="button"
                onClick={() => setIsAddingOption(false)}
                className="w-full sm:w-auto px-4 py-2 rounded-xl border border-[#e8e2d8] text-[#5c5549] cursor-pointer text-center"
              >
                취소
              </button>
              <button
                type="submit"
                className="w-full sm:w-auto px-5 py-2 bg-[#8f7a56] hover:bg-[#a68e65] text-white rounded-xl font-medium cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>옵션 등록</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 4. 할인 혜택 수정 모달 */}
      {editingDiscount && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveDiscount}
            className="bg-white rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 border border-[#e8e2d8] shadow-2xl text-xs space-y-4"
          >
            <div className="flex justify-between items-center border-b border-[#f1ede7] pb-3 sticky top-0 bg-white z-10">
              <h3 className="font-serif text-base text-[#2b261f]">할인/프로모션 혜택 수정</h3>
              <button
                type="button"
                onClick={() => setEditingDiscount(null)}
                className="p-1 text-[#9e9484] hover:text-[#2b261f]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block font-semibold text-[#6e5c3d] mb-1">혜택명</label>
              <input
                type="text"
                required
                value={editingDiscount.name}
                onChange={(e) => setEditingDiscount({ ...editingDiscount, name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#e8e2d8] text-xs bg-[#faf8f5]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#6e5c3d] mb-1">할인 금액 (원)</label>
              <input
                type="number"
                step={10000}
                required
                value={editingDiscount.amount}
                onChange={(e) => setEditingDiscount({ ...editingDiscount, amount: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-[#e8e2d8] text-xs bg-[#faf8f5]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#6e5c3d] mb-1">혜택 적용 조건/설명</label>
              <textarea
                rows={2}
                required
                value={editingDiscount.description}
                onChange={(e) => setEditingDiscount({ ...editingDiscount, description: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#e8e2d8] text-xs bg-[#faf8f5]"
              />
            </div>

            <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-3 border-t border-[#f1ede7]">
              <button
                type="button"
                onClick={() => setEditingDiscount(null)}
                className="w-full sm:w-auto px-4 py-2 rounded-xl border border-[#e8e2d8] text-[#5c5549] cursor-pointer text-center"
              >
                취소
              </button>
              <button
                type="submit"
                className="w-full sm:w-auto px-5 py-2 bg-[#2b261f] hover:bg-[#473e32] text-white rounded-xl font-medium cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>저장하기</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
