'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ContractRepository } from '@/repositories/contractRepository';
import { ContractService } from '@/services/contractService';
import { Contract, ContractVersion } from '@/types/contract';
import { ContractView } from '@/components/contracts/ContractView';
import { ShieldCheck, AlertCircle, ArrowRight } from 'lucide-react';

export default function ContractTokenClient() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;

  const [contract, setContract] = useState<Contract | null>(null);
  const [version, setVersion] = useState<ContractVersion | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 동의 폼 상태
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [portfolioAgreed, setPortfolioAgreed] = useState(true);
  const [signerName, setSignerName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadContract() {
      try {
        const ctr = await ContractRepository.getContractByToken(token);
        if (!ctr) {
          setError('유효하지 않거나 만료된 계약서 링크입니다.');
          setLoading(false);
          return;
        }
        setContract(ctr);

        const ver = await ContractRepository.getActiveVersion(ctr.id);
        if (!ver) {
          setError('계약 버전 정보를 불러올 수 없습니다.');
          setLoading(false);
          return;
        }
        setVersion(ver);
        setSignerName(ver.snapshot.customer_name);
      } catch (e) {
        setError('계약서를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    }

    if (token) {
      loadContract();
    }
  }, [token]);

  const handleAgree = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    if (!termsAgreed) {
      alert('필수 계약 약관에 동의해 주셔야 계약이 체결됩니다.');
      return;
    }

    if (!signerName.trim()) {
      alert('서명자 성함을 입력해 주세요.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await ContractService.submitConsent(token, {
        terms_agreed: termsAgreed,
        portfolio_agreed: portfolioAgreed,
        signer_name: signerName.trim(),
      });

      if (res.success) {
        router.push(`/contract/${token}/complete`);
      } else {
        alert(res.message);
        setSubmitting(false);
      }
    } catch (e: any) {
      alert('동의 제출 중 오류가 발생했습니다.');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center text-xs text-[#8f7a56]">
        계약 정보를 안전하게 불러오는 중입니다...
      </div>
    );
  }

  if (error || !version) {
    return (
      <div className="py-24 text-center max-w-md mx-auto px-4">
        <div className="p-6 rounded-3xl bg-red-50 border border-red-200 text-xs text-red-600">
          <AlertCircle className="w-8 h-8 mx-auto mb-2 text-red-500" />
          <p className="font-medium text-sm mb-1">계약서 확인 불가</p>
          <p>{error || '계약서가 존재하지 않습니다.'}</p>
        </div>
      </div>
    );
  }

  const isAlreadyAgreed = Boolean(version.snapshot.consent?.terms_agreed);

  return (
    <div className="py-16 sm:py-24 bg-[#faf8f5]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="text-xs font-serif tracking-[0.25em] text-[#8f7a56] uppercase mb-2">Contract</p>
          <h1 className="text-3xl font-serif text-[#2b261f]">온라인 촬영 계약 확인</h1>
          <p className="mt-3 text-xs sm:text-sm text-[#5c5549] leading-relaxed">
            대표작가와 협의된 최종 촬영 조건 및 계약 내용을 확인하신 후 서명해 주세요.
          </p>
        </div>

        <div className="mb-12">
          <ContractView snapshot={version.snapshot} />
        </div>

        {isAlreadyAgreed ? (
          <div className="bg-white rounded-3xl p-8 border border-emerald-200 shadow-sm text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center mb-3">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-serif text-[#2b261f] mb-1">이미 계약 동의가 완료된 문서입니다</h3>
            <p className="text-xs text-[#5c5549] mb-6">
              예약금 입금 확인 후 대표작가가 예약을 최종 확정해 드립니다.
            </p>
            <button
              type="button"
              onClick={() => router.push(`/contract/${token}/complete`)}
              className="px-6 py-3 bg-[#2b261f] text-white rounded-full text-xs hover:bg-[#473e32] transition-colors"
            >
              예약금 입금 계좌 및 안내 다시 보기
            </button>
          </div>
        ) : (
          <form onSubmit={handleAgree} className="bg-white rounded-3xl p-6 sm:p-10 border border-[#e8e2d8] shadow-sm space-y-6">
            <h3 className="font-serif text-lg text-[#2b261f] border-b border-[#f1ede7] pb-3">
              계약 동의 및 전자 서명
            </h3>

            <label className="flex items-start gap-3 p-4 rounded-2xl bg-[#faf8f5] border border-[#e8e2d8] cursor-pointer hover:border-[#8f7a56] transition-colors">
              <input
                type="checkbox"
                required
                checked={termsAgreed}
                onChange={(e) => setTermsAgreed(e.target.checked)}
                className="mt-0.5 rounded border-[#c7b698] text-[#8f7a56] focus:ring-[#8f7a56]"
              />
              <div className="text-xs">
                <span className="font-semibold text-[#2b261f]">
                  [필수] 촬영 계약 약관, 결과물 규격 및 취소/환불 규정에 모두 동의합니다.
                </span>
                <p className="text-[#5c5549] mt-1 text-[11px] leading-relaxed">
                  위 명시된 촬영 범위, 납품 일정 및 공정거래위원회 기준에 따른 환불 정책을 충분히 확인하고 동의합니다.
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3 p-4 rounded-2xl bg-[#faf8f5] border border-[#e8e2d8] cursor-pointer hover:border-[#8f7a56] transition-colors">
              <input
                type="checkbox"
                checked={portfolioAgreed}
                onChange={(e) => setPortfolioAgreed(e.target.checked)}
                className="mt-0.5 rounded border-[#c7b698] text-[#8f7a56] focus:ring-[#8f7a56]"
              />
              <div className="text-xs">
                <span className="font-semibold text-[#2b261f]">
                  [선택] 포트폴리오 활용 동의 (혜택 적용)
                </span>
                <p className="text-[#5c5549] mt-1 text-[11px] leading-relaxed">
                  촬영된 사진의 디어메모리 공식 웹사이트 및 인스타그램 홍보 활용에 동의합니다.
                </p>
              </div>
            </label>

            <div className="pt-2">
              <label className="block text-xs font-medium text-[#2b261f] mb-1.5">
                서명자 성함 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={signerName}
                onChange={(e) => setSignerName(e.target.value)}
                placeholder="본인의 실명을 입력해 주세요 (예: 김민수)"
                className="w-full sm:w-72 px-4 py-3 rounded-xl border border-[#e8e2d8] focus:border-[#8f7a56] focus:outline-none text-xs bg-[#faf8f5]"
              />
            </div>

            <div className="pt-4 border-t border-[#f1ede7]">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-[#2b261f] hover:bg-[#473e32] disabled:bg-[#9e9484] text-[#faf8f5] rounded-full text-xs font-medium tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                {submitting ? (
                  <span>동의 처리 중...</span>
                ) : (
                  <>
                    <span>계약 내용에 동의하고 제출하기</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
