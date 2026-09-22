'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ContractRepository } from '@/repositories/contractRepository';
import { BookingRepository } from '@/repositories/bookingRepository';
import { ContractService } from '@/services/contractService';
import { Contract, ContractVersion } from '@/types/contract';
import { Payment } from '@/types/booking';
import { ContractView } from '@/components/contracts/ContractView';
import { BookingActionModal } from '@/components/admin/BookingActionModal';
import { ArrowLeft, Copy, ExternalLink, Edit3, DollarSign, History } from 'lucide-react';

export default function AdminContractPreviewPageClient() {
  const params = useParams();
  const id = params.id as string;

  const [contract, setContract] = useState<Contract | null>(null);
  const [activeVersion, setActiveVersion] = useState<ContractVersion | null>(null);
  const [allVersions, setAllVersions] = useState<ContractVersion[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  const [copied, setCopied] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editReason, setEditReason] = useState('');
  const [submittingEdit, setSubmittingEdit] = useState(false);

  const loadData = async () => {
    const ctr = await ContractRepository.getContractById(id);
    if (ctr) {
      setContract(ctr);
      const ver = await ContractRepository.getActiveVersion(ctr.id);
      setActiveVersion(ver);
      if (ver) {
        setEditPrice(ver.snapshot.final_total_price);
      }
      const vers = await ContractRepository.getVersionsByContractId(ctr.id);
      setAllVersions(vers);
      const pays = await BookingRepository.getPaymentsByContractId(ctr.id);
      setPayments(pays);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (id) loadData();
  }, [id]);

  const customerUrl =
    typeof window !== 'undefined' && contract
      ? `${window.location.origin}/contract/${contract.access_token}`
      : '';

  const handleCopyLink = () => {
    if (customerUrl && navigator.clipboard) {
      navigator.clipboard.writeText(customerUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCreateNewVersion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contract || !activeVersion) return;
    if (!editReason.trim()) {
      alert('버전 변경 사유를 입력해 주세요.');
      return;
    }

    try {
      setSubmittingEdit(true);
      const newVer = await ContractService.createNewContractVersion(
        contract.id,
        {
          final_total_price: editPrice,
          balance_amount: Math.max(0, editPrice - activeVersion.snapshot.deposit_amount),
        },
        editReason.trim()
      );

      if (newVer) {
        alert(`신규 버전(v${newVer.version_number})이 성공적으로 생성되었습니다. (이전 버전 보존됨)`);
        setShowEditModal(false);
        setEditReason('');
        await loadData();
      }
    } catch (e: any) {
      alert('버전 생성 중 오류가 발생했습니다.');
    } finally {
      setSubmittingEdit(false);
    }
  };

  if (loading) {
    return <div className="py-12 text-center text-xs text-[#8f7a56]">계약 정보를 불러오는 중...</div>;
  }

  if (!contract || !activeVersion) {
    return <div className="py-12 text-center text-xs text-red-500">계약서를 찾을 수 없습니다.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 sm:p-6 rounded-2xl border border-[#e8e2d8] shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              href="/admin/contracts"
              className="text-xs text-[#8f7a56] hover:text-[#2b261f] flex items-center gap-1 font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>계약 목록</span>
            </Link>
            <span className="text-gray-300">|</span>
            <span className="text-xs font-mono font-semibold text-[#2b261f]">
              {contract.contract_number} (v{activeVersion.version_number})
            </span>
          </div>
          <h1 className="text-xl font-serif text-[#2b261f]">
            {activeVersion.snapshot.customer_name} 님 계약 미리보기
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={handleCopyLink}
            className="px-3.5 py-2 rounded-xl border border-[#c7b698] text-[#8f7a56] hover:bg-[#faf8f5] text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{copied ? '링크 복사됨!' : '고객 서명 링크 복사'}</span>
          </button>

          <a
            href={`/contract/${contract.access_token}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-xl border border-[#e8e2d8] text-[#5c5549] hover:bg-[#faf8f5] text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>고객 화면 확인</span>
          </a>

          <button
            type="button"
            onClick={() => setShowEditModal(true)}
            className="px-3.5 py-2 rounded-xl bg-[#473e32] hover:bg-[#5c5549] text-white text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>조건 수정 (신규 v2 생성)</span>
          </button>

          <button
            type="button"
            onClick={() => setShowBookingModal(true)}
            className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-medium flex items-center gap-1.5 transition-colors shadow-md cursor-pointer"
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>예약금 확인 & 예약 확정</span>
          </button>
        </div>
      </div>

      {allVersions.length > 1 && (
        <div className="flex items-center gap-2 bg-[#f5f1ea] p-3 rounded-xl border border-[#e8e2d8] text-xs">
          <History className="w-4 h-4 text-[#8f7a56]" />
          <span className="font-semibold text-[#6e5c3d]">계약 버전 이력 ({allVersions.length}개):</span>
          <div className="flex items-center gap-2">
            {allVersions.map((v) => (
              <span
                key={v.id}
                className={`px-2 py-0.5 rounded text-[11px] font-mono ${
                  v.is_active ? 'bg-[#2b261f] text-white' : 'bg-white border border-[#e8e2d8] text-[#73695c]'
                }`}
              >
                v{v.version_number} {v.change_reason ? `(${v.change_reason})` : ''}
              </span>
            ))}
          </div>
        </div>
      )}

      <ContractView snapshot={activeVersion.snapshot} isDraft={contract.status === 'sent'} />

      {showBookingModal && (
        <BookingActionModal
          contractId={contract.id}
          depositAmount={activeVersion.snapshot.deposit_amount}
          existingPayments={payments}
          onPaymentAdded={loadData}
          onBookingConfirmed={loadData}
          onClose={() => setShowBookingModal(false)}
        />
      )}

      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateNewVersion}
            className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 border border-[#e8e2d8] shadow-2xl text-xs space-y-4"
          >
            <h3 className="font-serif text-base text-[#2b261f] border-b border-[#f1ede7] pb-3">
              계약 내용 수정 및 신규 버전 발행
            </h3>
            <p className="text-[#5c5549] text-[11px] leading-relaxed">
              기존 계약 버전(v{activeVersion.version_number})은 삭제되거나 덮어쓰이지 않고 보존되며, 수정 사항이 적용된 새 버전(v{activeVersion.version_number + 1})이 생성됩니다.
            </p>

            <div>
              <label className="block text-[#6e5c3d] font-semibold mb-1">최종 계약 총액 수정 (원)</label>
              <input
                type="number"
                step={10000}
                required
                value={editPrice}
                onChange={(e) => setEditPrice(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-[#e8e2d8] text-xs bg-[#faf8f5]"
              />
            </div>

            <div>
              <label className="block text-[#6e5c3d] font-semibold mb-1">버전 변경 사유 <span className="text-red-500">*</span></label>
              <input
                type="text"
                required
                value={editReason}
                onChange={(e) => setEditReason(e.target.value)}
                placeholder="예: 고객 요청으로 추가 할인 반영"
                className="w-full px-3 py-2 rounded-xl border border-[#e8e2d8] text-xs bg-[#faf8f5]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#f1ede7]">
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 rounded-xl border border-[#e8e2d8] text-[#5c5549] cursor-pointer"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={submittingEdit}
                className="px-4 py-2 rounded-xl bg-[#2b261f] hover:bg-[#473e32] text-white font-medium cursor-pointer"
              >
                {submittingEdit ? '발행 중...' : `v${activeVersion.version_number + 1} 신규 버전 생성`}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
