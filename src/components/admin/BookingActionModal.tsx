'use client';

import React, { useState } from 'react';
import { BookingService } from '@/services/bookingService';
import { IntegrationService } from '@/services/integrationService';
import { Payment } from '@/types/booking';
import { DearMemoryOsJobPayload } from '@/types/osIntegration';
import { CheckCircle2, DollarSign, X, ExternalLink, Send } from 'lucide-react';

interface Props {
  contractId: string;
  depositAmount: number;
  existingPayments: Payment[];
  onPaymentAdded: () => void;
  onBookingConfirmed: () => void;
  onClose: () => void;
}

export function BookingActionModal({
  contractId,
  depositAmount,
  existingPayments,
  onPaymentAdded,
  onBookingConfirmed,
  onClose,
}: Props) {
  const [payAmount, setPayAmount] = useState<number>(depositAmount);
  const [payNote, setPayNote] = useState('');
  const [recording, setRecording] = useState(false);

  const [confirming, setConfirming] = useState(false);
  const [osPayload, setOsPayload] = useState<DearMemoryOsJobPayload | null>(null);

  const totalDeposited = existingPayments
    .filter((p) => p.type === 'deposit')
    .reduce((sum, p) => sum + p.amount, 0);

  const isDepositComplete = totalDeposited >= depositAmount;

  const handleRecordDeposit = async () => {
    try {
      setRecording(true);
      await BookingService.recordPayment({
        contract_id: contractId,
        type: 'deposit',
        amount: payAmount,
        recorded_by: '한민규 대표',
        note: payNote || '예약금 입금 확인',
      });
      onPaymentAdded();
      alert('입금 내역이 등록되었습니다.');
    } catch (e: any) {
      alert('입금 기록 중 오류 발생');
    } finally {
      setRecording(false);
    }
  };

  const handleConfirmBooking = async () => {
    try {
      setConfirming(true);
      const res = await BookingService.confirmBooking({
        contract_id: contractId,
        confirmed_by: '한민규 대표',
      });

      if (res.success && res.booking) {
        // OS 연동 페이로드 생성
        const payload = await IntegrationService.createOsJobPayload(res.booking.id);
        setOsPayload(payload);
        onBookingConfirmed();
      } else {
        alert(res.message);
      }
    } catch (e: any) {
      alert('예약 확정 처리 중 오류가 발생했습니다.');
    } finally {
      setConfirming(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-[#e8e2d8] shadow-2xl text-xs space-y-6">
        <div className="flex justify-between items-center border-b border-[#f1ede7] pb-3">
          <div className="flex items-center gap-2 text-[#8f7a56]">
            <DollarSign className="w-5 h-5" />
            <h3 className="font-serif text-base text-[#2b261f]">예약금 입금 확인 및 예약 확정</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-[#9e9484] hover:text-[#2b261f] rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Box */}
        <div className="p-4 rounded-2xl bg-[#faf8f5] border border-[#e8e2d8] space-y-2">
          <div className="flex justify-between items-baseline">
            <span className="text-[#6e5c3d] font-semibold">기준 계약금</span>
            <span className="font-serif text-sm font-medium text-[#2b261f]">
              {depositAmount.toLocaleString()}원
            </span>
          </div>
          <div className="flex justify-between items-baseline">
            <span className="text-[#6e5c3d] font-semibold">현재 입금 확인 누적</span>
            <span
              className={`font-serif text-sm font-medium ${
                isDepositComplete ? 'text-emerald-600' : 'text-amber-600'
              }`}
            >
              {totalDeposited.toLocaleString()}원
            </span>
          </div>
        </div>

        {/* Existing Payments List */}
        {existingPayments.length > 0 && (
          <div>
            <h4 className="font-semibold text-[#6e5c3d] mb-2">기록된 입금 내역</h4>
            <div className="divide-y divide-[#f1ede7] border border-[#e8e2d8] rounded-xl overflow-hidden">
              {existingPayments.map((p) => (
                <div key={p.id} className="p-2.5 bg-white flex justify-between items-center">
                  <div>
                    <span className="font-medium text-[#2b261f]">{p.amount.toLocaleString()}원</span>
                    <span className="text-[10px] text-[#9e9484] ml-2">
                      ({new Date(p.occurred_at).toLocaleDateString('ko-KR')})
                    </span>
                    {p.note && <span className="block text-[11px] text-[#73695c]">{p.note}</span>}
                  </div>
                  <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    확인됨
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Record Payment Form */}
        <div className="space-y-3 pt-2 border-t border-[#f1ede7]">
          <h4 className="font-semibold text-[#6e5c3d]">신규 입금 내역 수기 등록</h4>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] text-[#73695c] mb-1">입금 금액 (원)</label>
              <input
                type="number"
                value={payAmount}
                onChange={(e) => setPayAmount(Number(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl border border-[#e8e2d8] text-xs bg-[#faf8f5]"
              />
            </div>
            <div>
              <label className="block text-[11px] text-[#73695c] mb-1">메모</label>
              <input
                type="text"
                value={payNote}
                onChange={(e) => setPayNote(e.target.value)}
                placeholder="예: 국민은행 계좌이체 확인"
                className="w-full px-3 py-2 rounded-xl border border-[#e8e2d8] text-xs bg-[#faf8f5]"
              />
            </div>
          </div>
          <button
            type="button"
            onClick={handleRecordDeposit}
            disabled={recording || payAmount <= 0}
            className="w-full py-2.5 bg-[#473e32] hover:bg-[#5c5549] text-white rounded-xl font-medium transition-colors"
          >
            {recording ? '등록 중...' : '입금 내역 등록'}
          </button>
        </div>

        {/* Final Booking Confirm Button */}
        <div className="pt-3 border-t border-[#f1ede7]">
          <button
            type="button"
            onClick={handleConfirmBooking}
            disabled={confirming || !isDepositComplete}
            className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 disabled:bg-gray-400 text-white rounded-xl text-xs font-semibold tracking-wider transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{confirming ? '확정 처리 중...' : '촬영 일정 최종 확정하기 (Booking)'}</span>
          </button>
          {!isDepositComplete && (
            <p className="text-[11px] text-amber-600 mt-2 text-center">
              기준 계약금({depositAmount.toLocaleString()}원) 이상 입금되어야 최종 확정할 수 있습니다.
            </p>
          )}
        </div>

        {/* OS Payload Modal Preview */}
        {osPayload && (
          <div className="p-4 rounded-2xl bg-[#24201a] text-[#c9bfaf] space-y-2">
            <div className="flex justify-between items-center text-white">
              <span className="font-semibold text-emerald-400">Dear Memory OS 연동 페이로드 생성 완료</span>
              <span className="text-[10px] text-[#9e9484]">integrationService</span>
            </div>
            <pre className="p-3 bg-black/40 rounded-xl overflow-x-auto text-[10px] font-mono text-emerald-300 max-h-40">
              {JSON.stringify(osPayload, null, 2)}
            </pre>
            <p className="text-[10px] text-[#9e9484]">
              이 페이로드는 Dear Memory OS의 Job 생성 규격과 1:1로 매핑됩니다.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
