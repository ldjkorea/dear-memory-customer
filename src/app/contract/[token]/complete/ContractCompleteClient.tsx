'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ContractRepository } from '@/repositories/contractRepository';
import { Contract, ContractVersion } from '@/types/contract';
import { CheckCircle2, Copy } from 'lucide-react';

export default function ContractCompleteClient() {
  const params = useParams();
  const token = params.token as string;

  const [contract, setContract] = useState<Contract | null>(null);
  const [version, setVersion] = useState<ContractVersion | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function load() {
      const ctr = await ContractRepository.getContractByToken(token);
      if (ctr) {
        setContract(ctr);
        const ver = await ContractRepository.getActiveVersion(ctr.id);
        setVersion(ver);
      }
    }
    if (token) load();
  }, [token]);

  const bankInfo = {
    bank: '국민은행',
    account: '123-4567-890123',
    holder: '디어메모리 (한민규)',
  };

  const handleCopy = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(`${bankInfo.bank} ${bankInfo.account}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const depositAmount = version?.snapshot.deposit_amount || 300000;

  return (
    <div className="py-16 sm:py-24 bg-[#faf8f5]">
      <div className="max-w-xl mx-auto px-4 sm:px-6 text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center mb-6">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-serif text-[#2b261f] mb-3">
          계약 동의가 성공적으로 완료되었습니다
        </h1>
        <p className="text-xs sm:text-sm text-[#5c5549] mb-8 leading-relaxed">
          마지막 단계로 아래 전용 계좌로 계약금을 입금해 주시면 확인 즉시 예약이 최종 확정됩니다.
        </p>

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e8e2d8] shadow-sm text-left mb-8 space-y-4">
          <div className="flex justify-between items-baseline border-b border-[#f1ede7] pb-4">
            <span className="text-xs font-serif text-[#8f7a56]">입금하실 계약금</span>
            <span className="text-2xl font-serif text-[#2b261f]">
              {depositAmount.toLocaleString()}원
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center bg-[#faf8f5] p-3 rounded-xl">
              <div>
                <span className="text-[#6e5c3d] block text-[11px]">입금 계좌</span>
                <span className="font-mono font-medium text-sm text-[#2b261f]">
                  {bankInfo.bank} {bankInfo.account}
                </span>
                <span className="text-[#73695c] block text-[11px] mt-0.5">예금주: {bankInfo.holder}</span>
              </div>
              <button
                type="button"
                onClick={handleCopy}
                className="px-3 py-1.5 bg-[#ede7dd] hover:bg-[#e3dacc] text-[#2b261f] text-xs rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copied ? '복사됨' : '복사'}</span>
              </button>
            </div>

            <div className="p-3 bg-[#fdf9f3] border border-[#f1d7b3] rounded-xl text-[11px] text-[#735738] space-y-1">
              <p className="font-semibold text-[#8f581e]">• 입금 시 유의사항</p>
              <p>1. 입금자명을 계약자 성함(예: {version?.snapshot.customer_name || '신랑/신부님'})으로 기재해 주세요.</p>
              <p>2. 계약 체결 후 48시간 이내 미입금 시 예약이 자동 보류될 수 있습니다.</p>
              <p>3. 입금 확인 후 대표작가가 카카오톡으로 예약 확정 메시지를 보내드립니다.</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href={`/contract/${token}`}
            className="w-full sm:w-auto px-6 py-3.5 border border-[#e8e2d8] text-[#5c5549] hover:text-[#2b261f] rounded-full text-xs transition-colors"
          >
            계약서 다시 보기
          </Link>
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3.5 bg-[#2b261f] text-[#faf8f5] rounded-full text-xs font-medium hover:bg-[#473e32] transition-colors"
          >
            홈으로 이동
          </Link>
        </div>
      </div>
    </div>
  );
}
