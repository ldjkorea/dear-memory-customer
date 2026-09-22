'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { RequestRepository } from '@/repositories/requestRepository';
import { ContractRepository } from '@/repositories/contractRepository';
import { RequestService } from '@/services/requestService';
import { ContractService } from '@/services/contractService';
import { CatalogService } from '@/services/catalogService';
import { CustomerRequest } from '@/types/customer';
import { Contract } from '@/types/contract';
import { ArrowLeft, Check, ShieldCheck, FileText } from 'lucide-react';

export default function AdminRequestDetailPageClient() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [request, setRequest] = useState<CustomerRequest | null>(null);
  const [existingContract, setExistingContract] = useState<Contract | null>(null);
  const [loading, setLoading] = useState(true);

  // 대표 검토 폼 상태
  const [isAvailable, setIsAvailable] = useState(true);
  const [availabilityNote, setAvailabilityNote] = useState('');
  const [confirmedProductId, setConfirmedProductId] = useState('album_plus');
  const [confirmedOptionIds, setConfirmedOptionIds] = useState<string[]>([]);
  const [confirmedDiscountIds, setConfirmedDiscountIds] = useState<string[]>([]);
  const [customDiscountAmount, setCustomDiscountAmount] = useState<number>(0);
  const [customDiscountReason, setCustomDiscountReason] = useState('');
  const [depositAmount, setDepositAmount] = useState<number>(300000);
  const [adminMemo, setAdminMemo] = useState('');

  const [savingReview, setSavingReview] = useState(false);
  const [creatingContract, setCreatingContract] = useState(false);

  const products = CatalogService.getProducts();
  const options = CatalogService.getOptions();
  const discounts = CatalogService.getDiscounts();

  useEffect(() => {
    async function load() {
      const req = await RequestRepository.getById(id);
      if (req) {
        setRequest(req);
        if (req.review) {
          setIsAvailable(req.review.is_available);
          setAvailabilityNote(req.review.availability_note || '');
          setConfirmedProductId(req.review.confirmed_product_id);
          setConfirmedOptionIds(req.review.confirmed_option_ids || []);
          setConfirmedDiscountIds(req.review.confirmed_discount_ids || []);
          setCustomDiscountAmount(req.review.custom_discount_amount || 0);
          setCustomDiscountReason(req.review.custom_discount_reason || '');
          setDepositAmount(req.review.deposit_amount || 300000);
          setAdminMemo(req.review.admin_memo || '');
        } else {
          if (req.product_id) setConfirmedProductId(req.product_id);
          if (req.selected_option_ids) setConfirmedOptionIds(req.selected_option_ids);
          if (req.selected_discount_ids) setConfirmedDiscountIds(req.selected_discount_ids);
        }

        const ctr = await ContractRepository.getContractByRequestId(req.id);
        if (ctr) {
          setExistingContract(ctr);
        }
      }
      setLoading(false);
    }
    load();
  }, [id]);

  const estimate = CatalogService.calculateEstimate({
    productId: confirmedProductId,
    optionIds: confirmedOptionIds,
    discountIds: confirmedDiscountIds,
  });

  const finalPrice = Math.max(0, estimate.estimatedTotal - (customDiscountAmount || 0));

  const toggleOption = (optId: string) => {
    setConfirmedOptionIds((prev) =>
      prev.includes(optId) ? prev.filter((i) => i !== optId) : [...prev, optId]
    );
  };

  const toggleDiscount = (discId: string) => {
    setConfirmedDiscountIds((prev) =>
      prev.includes(discId) ? prev.filter((i) => i !== discId) : [...prev, discId]
    );
  };

  const handleSaveReview = async () => {
    if (!request) return;
    try {
      setSavingReview(true);
      const updated = await RequestService.reviewRequest(request.id, {
        is_available: isAvailable,
        availability_note: availabilityNote,
        confirmed_product_id: confirmedProductId,
        confirmed_option_ids: confirmedOptionIds,
        confirmed_discount_ids: confirmedDiscountIds,
        custom_discount_amount: customDiscountAmount,
        custom_discount_reason: customDiscountReason,
        deposit_amount: depositAmount,
        admin_memo: adminMemo,
      });
      if (updated) {
        setRequest(updated);
        alert('대표 검토 조건이 저장되었습니다.');
      }
    } catch (e: any) {
      alert('저장 중 오류가 발생했습니다.');
    } finally {
      setSavingReview(false);
    }
  };

  const handleCreateContract = async () => {
    if (!request) return;
    try {
      setCreatingContract(true);
      await RequestService.reviewRequest(request.id, {
        is_available: isAvailable,
        availability_note: availabilityNote,
        confirmed_product_id: confirmedProductId,
        confirmed_option_ids: confirmedOptionIds,
        confirmed_discount_ids: confirmedDiscountIds,
        custom_discount_amount: customDiscountAmount,
        custom_discount_reason: customDiscountReason,
        deposit_amount: depositAmount,
        admin_memo: adminMemo,
      });

      const res = await ContractService.createContractFromRequest(request.id);
      if (res) {
        router.push(`/admin/contracts/${res.contract.id}/preview`);
      }
    } catch (e: any) {
      alert(e.message || '계약서 생성 중 오류가 발생했습니다.');
      setCreatingContract(false);
    }
  };

  if (loading) {
    return <div className="py-12 text-center text-xs text-[#8f7a56]">상세 정보를 불러오는 중...</div>;
  }

  if (!request) {
    return <div className="py-12 text-center text-xs text-red-500">요청을 찾을 수 없습니다.</div>;
  }

  const customerProduct = request.product_id ? CatalogService.getProductById(request.product_id) : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <Link
          href="/admin/requests"
          className="text-xs text-[#8f7a56] hover:text-[#2b261f] flex items-center gap-1 font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>접수 목록으로 돌아가기</span>
        </Link>

        {existingContract && (
          <Link
            href={`/admin/contracts/${existingContract.id}/preview`}
            className="w-full sm:w-auto justify-center px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>이미 발행된 계약서 보기 ({existingContract.contract_number})</span>
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-[#e8e2d8] shadow-sm space-y-4 text-xs">
            <div className="flex justify-between items-start border-b border-[#f1ede7] pb-3">
              <div>
                <span className="text-[11px] font-mono text-[#8f7a56] block">{request.request_number}</span>
                <h2 className="text-lg font-serif text-[#2b261f]">{request.customer_name}</h2>
              </div>
              <span
                className={`px-2 py-0.5 rounded text-[10px] ${
                  request.type === 'application' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                }`}
              >
                {request.type === 'application' ? '촬영 신청' : '단순 문의'}
              </span>
            </div>

            <div className="space-y-2 text-[#5c5549]">
              <p>• 회신 연락처: <span className="font-medium text-[#2b261f]">{request.contact_value}</span> ({request.contact_type})</p>
              <p>• 예식일자: <span className="font-medium text-[#2b261f]">{request.wedding_date}</span></p>
              <p>• 예식시간: <span className="font-medium text-[#2b261f]">{request.wedding_time}</span></p>
              <p>• 웨딩홀: <span className="font-medium text-[#2b261f]">{request.venue}</span> {request.hall_name && `(${request.hall_name})`}</p>
            </div>

            <div className="pt-3 border-t border-[#f1ede7]">
              <span className="text-[#6e5c3d] font-semibold block mb-1">고객 선택 상품</span>
              <p className="text-[#2b261f] font-medium">{customerProduct?.name || '미지정'}</p>
            </div>

            {request.selected_option_ids && request.selected_option_ids.length > 0 && (
              <div>
                <span className="text-[#6e5c3d] font-semibold block mb-1">고객 선택 옵션</span>
                <ul className="list-disc list-inside text-[#5c5549] space-y-0.5">
                  {request.selected_option_ids.map((optId) => {
                    const opt = CatalogService.getOptionById(optId);
                    return <li key={optId}>{opt?.name || optId}</li>;
                  })}
                </ul>
              </div>
            )}

            {request.selected_discount_ids && request.selected_discount_ids.length > 0 && (
              <div>
                <span className="text-[#6e5c3d] font-semibold block mb-1">고객 신청 혜택</span>
                <ul className="list-disc list-inside text-[#8f7a56] space-y-0.5">
                  {request.selected_discount_ids.map((discId) => {
                    const disc = CatalogService.getDiscountById(discId);
                    return <li key={discId}>{disc?.name || discId}</li>;
                  })}
                </ul>
              </div>
            )}

            {request.customer_note && (
              <div className="pt-3 border-t border-[#f1ede7]">
                <span className="text-[#6e5c3d] font-semibold block mb-1">고객 요청/문의 사항</span>
                <p className="p-3 bg-[#faf8f5] rounded-xl text-[#5c5549] leading-relaxed whitespace-pre-line">
                  {request.customer_note}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#c7b698] shadow-sm space-y-6 text-xs">
            <div className="flex justify-between items-center border-b border-[#f1ede7] pb-4">
              <div className="flex items-center gap-2 text-[#8f7a56]">
                <ShieldCheck className="w-5 h-5" />
                <h3 className="text-base font-serif text-[#2b261f]">대표 검토 및 촬영 조건 확정</h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-semibold">
                대표 확인 영역
              </span>
            </div>

            <div>
              <label className="block font-semibold text-[#6e5c3d] mb-2">1. 예식 일정 촬영 가능 여부</label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setIsAvailable(true)}
                  className={`flex-1 py-3 rounded-xl border font-medium flex items-center justify-center gap-1.5 transition-all ${
                    isAvailable
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-800 ring-1 ring-emerald-500'
                      : 'border-[#e8e2d8] text-[#9e9484]'
                  }`}
                >
                  <Check className="w-4 h-4" />
                  <span>촬영 가능 (수락)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsAvailable(false)}
                  className={`flex-1 py-3 rounded-xl border font-medium flex items-center justify-center gap-1.5 transition-all ${
                    !isAvailable
                      ? 'bg-rose-50 border-rose-500 text-rose-800 ring-1 ring-rose-500'
                      : 'border-[#e8e2d8] text-[#9e9484]'
                  }`}
                >
                  <span>일정 마감 (불가/반려)</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-[#6e5c3d] mb-2">2. 확정 상품 선택 (수정 가능)</label>
              <div className="grid grid-cols-2 gap-3">
                {products.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setConfirmedProductId(p.id)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      confirmedProductId === p.id
                        ? 'border-[#8f7a56] bg-[#f5f1ea] text-[#2b261f] font-semibold ring-1 ring-[#8f7a56]'
                        : 'border-[#e8e2d8] text-[#5c5549] hover:bg-[#faf8f5]'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span>{p.name}</span>
                      <span className="font-serif">{p.base_price.toLocaleString()}원</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-semibold text-[#6e5c3d] mb-2">3. 확정 추가 옵션</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {options.map((opt) => {
                  const isChecked = confirmedOptionIds.includes(opt.id);
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => toggleOption(opt.id)}
                      className={`p-2.5 rounded-xl border text-left flex justify-between items-center transition-all ${
                        isChecked
                          ? 'border-[#8f7a56] bg-[#f5f1ea] font-medium text-[#2b261f]'
                          : 'border-[#e8e2d8] text-[#5c5549]'
                      }`}
                    >
                      <span>{opt.name}</span>
                      <span className="text-[11px] text-[#8f7a56]">+{opt.price.toLocaleString()}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block font-semibold text-[#6e5c3d] mb-2">4. 적용 할인 혜택</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {discounts.map((disc) => {
                  const isChecked = confirmedDiscountIds.includes(disc.id);
                  return (
                    <button
                      key={disc.id}
                      type="button"
                      onClick={() => toggleDiscount(disc.id)}
                      className={`p-2 rounded-xl border text-left flex justify-between items-center transition-all ${
                        isChecked
                          ? 'border-[#8f7a56] bg-[#f5f1ea] font-medium text-[#2b261f]'
                          : 'border-[#e8e2d8] text-[#5c5549]'
                      }`}
                    >
                      <span>{disc.name}</span>
                      <span className="text-[11px] text-[#8f7a56]">-{disc.amount.toLocaleString()}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#f1ede7]">
              <div>
                <label className="block text-[#6e5c3d] mb-1 font-medium">추가 수기 할인 금액 (원)</label>
                <input
                  type="number"
                  step={10000}
                  value={customDiscountAmount}
                  onChange={(e) => setCustomDiscountAmount(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl border border-[#e8e2d8] text-xs bg-[#faf8f5]"
                  placeholder="예: 50000"
                />
              </div>
              <div>
                <label className="block text-[#6e5c3d] mb-1 font-medium">추가 할인 사유</label>
                <input
                  type="text"
                  value={customDiscountReason}
                  onChange={(e) => setCustomDiscountReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#e8e2d8] text-xs bg-[#faf8f5]"
                  placeholder="예: 대표 지인 특별 할인"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-[#6e5c3d] mb-1 font-medium">기준 계약금 (예약금)</label>
                <input
                  type="number"
                  step={50000}
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(Number(e.target.value) || 300000)}
                  className="w-full px-3 py-2 rounded-xl border border-[#e8e2d8] text-xs bg-[#faf8f5]"
                />
              </div>
              <div>
                <label className="block text-[#6e5c3d] mb-1 font-medium">관리자 내부 메모</label>
                <input
                  type="text"
                  value={adminMemo}
                  onChange={(e) => setAdminMemo(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#e8e2d8] text-xs bg-[#faf8f5]"
                  placeholder="외주작가 배정 계획 등 내부 참고사항"
                />
              </div>
            </div>

            <div className="bg-[#2b261f] text-[#faf8f5] p-5 sm:p-6 rounded-2xl flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div>
                <span className="text-[11px] text-[#c7b698] font-serif block">대표 확정 최종 계약 총액</span>
                <div className="flex flex-wrap items-baseline gap-2 mt-0.5">
                  <span className="text-2xl font-serif text-white">{finalPrice.toLocaleString()}원</span>
                  <span className="text-[11px] text-[#c9bfaf]">
                    (계약금 {depositAmount.toLocaleString()}원 / 잔금 {(finalPrice - depositAmount).toLocaleString()}원)
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
                <button
                  type="button"
                  onClick={handleSaveReview}
                  disabled={savingReview}
                  className="w-full sm:w-auto justify-center px-4 py-2.5 bg-[#473e32] hover:bg-[#5c5549] text-white rounded-xl text-xs font-medium transition-colors cursor-pointer text-center"
                >
                  {savingReview ? '저장 중...' : '검토 조건 저장'}
                </button>

                <button
                  type="button"
                  onClick={handleCreateContract}
                  disabled={creatingContract || !isAvailable}
                  className="w-full sm:w-auto justify-center px-5 py-2.5 bg-[#8f7a56] hover:bg-[#a68e65] disabled:bg-gray-600 text-white rounded-xl text-xs font-medium transition-colors flex items-center gap-1.5 shadow-md cursor-pointer text-center"
                >
                  {creatingContract ? (
                    '계약서 발행 중...'
                  ) : (
                    <>
                      <FileText className="w-4 h-4" />
                      <span>계약서 생성 및 미리보기</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
