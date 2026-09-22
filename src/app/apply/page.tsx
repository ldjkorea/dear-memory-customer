'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CatalogService } from '@/services/catalogService';
import { RequestService } from '@/services/requestService';
import { CONTRACT_POLICY_CONFIG } from '@/config/contractPolicy';
import {
  Send,
  Check,
  AlertCircle,
  Info,
  Sparkles,
  Shield,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Heart,
  Calendar,
  Clock,
  MapPin,
  Camera,
  Users,
  Mail,
  Phone,
  Gift,
} from 'lucide-react';

function ApplyFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const products = CatalogService.getProducts();
  const options = CatalogService.getOptions();

  // 단계 상태: 1 = 약관 동의, 2 = 신청서 폼 작성
  const [step, setStep] = useState<1 | 2>(1);

  // 약관 동의 상태
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [expandedArticles, setExpandedArticles] = useState<Record<string, boolean>>({});

  // 1. 신랑신부 기본 정보
  const [groomName, setGroomName] = useState('');
  const [groomPhone, setGroomPhone] = useState('');
  const [brideName, setBrideName] = useState('');
  const [bridePhone, setBridePhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');

  // 2. 예식 및 메이크업 정보
  const [weddingDate, setWeddingDate] = useState('');
  const [weddingTime, setWeddingTime] = useState('');
  const [venue, setVenue] = useState('');
  const [hallName, setHallName] = useState('');
  const [makeupVenue, setMakeupVenue] = useState('');
  const [makeupOutTime, setMakeupOutTime] = useState('');

  // 3. 직계 가족 구성원
  const [groomFamily, setGroomFamily] = useState('');
  const [brideFamily, setBrideFamily] = useState('');

  // 4. 상품 및 옵션/할인 (URL 파라미터에서 자동 파싱 및 복원)
  const paramProduct = searchParams.get('product') || 'album_plus';
  const paramOptions = searchParams.get('options')?.split(',').filter(Boolean) || [];
  const paramDiscounts = searchParams.get('discounts')?.split(',').filter(Boolean) || ['portfolio'];

  const [productId, setProductId] = useState<string>(paramProduct);
  const [selectedOptionIds, setSelectedOptionIds] = useState<string[]>(paramOptions);
  const [portfolioAgreed, setPortfolioAgreed] = useState(paramDiscounts.includes('portfolio'));
  const [mateDiscountInfo, setMateDiscountInfo] = useState(
    paramDiscounts.includes('partner') ? '짝꿍할인 신청' : ''
  );

  // 5. 요청사항 및 기타
  const [shootingRequests, setShootingRequests] = useState('');
  const [retouchRequests, setRetouchRequests] = useState('');
  const [otherRequests, setOtherRequests] = useState('');
  const [referralSource, setReferralSource] = useState('인스타그램');
  const [snsAccount, setSnsAccount] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const p = searchParams.get('product');
    if (p && products.some((item) => item.id === p)) {
      setProductId(p);
    }

    const optStr = searchParams.get('options');
    if (optStr !== null) {
      const opts = optStr.split(',').filter(Boolean);
      setSelectedOptionIds(opts);
    }

    const discStr = searchParams.get('discounts');
    if (discStr !== null) {
      const discs = discStr.split(',').filter(Boolean);
      setPortfolioAgreed(discs.includes('portfolio'));
      if (discs.includes('partner') && !mateDiscountInfo) {
        setMateDiscountInfo('짝꿍할인 신청');
      }
    }
  }, [searchParams, products]);

  const toggleOption = (id: string) => {
    setSelectedOptionIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleArticle = (id: string) => {
    setExpandedArticles((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // 실시간 예상 견적 계산
  const selectedProduct = products.find((p) => p.id === productId) || products[0];
  const productPrice = selectedProduct?.base_price || 0;
  const optionsPrice = options
    .filter((o) => selectedOptionIds.includes(o.id))
    .reduce((sum, o) => sum + o.price, 0);
  const portfolioDiscount = portfolioAgreed ? 100000 : 0;
  const mateDiscount = mateDiscountInfo.trim() ? 50000 : 0;
  const totalDiscounts = portfolioDiscount + mateDiscount;
  const estimatedTotal = Math.max(0, productPrice + optionsPrice - totalDiscounts);

  const handleStep1Proceed = () => {
    if (!termsAgreed) {
      setErrorMessage('약관 동의 및 개인정보 수집·이용에 동의하셔야 다음 단계로 진행하실 수 있습니다.');
      return;
    }
    setErrorMessage('');
    setStep(2);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!groomName.trim() && !brideName.trim()) {
      setErrorMessage('신랑님 또는 신부님 성함을 최소 한 분 이상 입력해 주세요.');
      return;
    }
    if (!groomPhone.trim() && !bridePhone.trim()) {
      setErrorMessage('신랑님 또는 신부님 연락처를 입력해 주세요.');
      return;
    }
    if (!customerEmail.trim()) {
      setErrorMessage('계약서 및 원본을 수령하실 이메일 주소를 입력해 주세요.');
      return;
    }
    if (!weddingDate.trim()) {
      setErrorMessage('예식 일자를 선택해 주세요.');
      return;
    }
    if (!venue.trim()) {
      setErrorMessage('예식 장소(웨딩홀 이름)를 입력해 주세요.');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage('');

      const combinedCustomerName = `${groomName.trim() ? `신랑 ${groomName.trim()}` : ''}${
        groomName.trim() && brideName.trim() ? ' / ' : ''
      }${brideName.trim() ? `신부 ${brideName.trim()}` : ''}`;

      const primaryContact = bridePhone.trim() || groomPhone.trim();
      const idempotencyKey = `app-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;

      const selectedDiscountIds = [
        ...(portfolioAgreed ? ['portfolio'] : []),
        ...(mateDiscountInfo.trim() ? ['partner'] : []),
      ];

      const created = await RequestService.submitRequest({
        type: 'application',
        customer_name: combinedCustomerName,
        contact_type: 'phone',
        contact_value: primaryContact,
        wedding_date: weddingDate,
        wedding_time: weddingTime || '미정',
        venue: venue,
        hall_name: hallName,
        product_id: productId,
        selected_option_ids: selectedOptionIds,
        selected_discount_ids: selectedDiscountIds,
        customer_note: [
          shootingRequests && `[촬영 요청] ${shootingRequests}`,
          retouchRequests && `[보정 요청] ${retouchRequests}`,
          makeupVenue && `[메이크업] ${makeupVenue} (아웃: ${makeupOutTime || '미정'})`,
          (groomFamily || brideFamily) && `[직계가족] 신랑(${groomFamily || '-'}) / 신부(${brideFamily || '-'})`,
          mateDiscountInfo && `[짝꿍할인] ${mateDiscountInfo}`,
          snsAccount && `[SNS] ${snsAccount}`,
          otherRequests && `[기타] ${otherRequests}`,
        ]
          .filter(Boolean)
          .join('\n'),

        // 왈라 상세 필드 보존
        groom_name: groomName.trim(),
        bride_name: brideName.trim(),
        groom_phone: groomPhone.trim(),
        bride_phone: bridePhone.trim(),
        customer_email: customerEmail.trim(),
        makeup_venue: makeupVenue.trim(),
        makeup_out_time: makeupOutTime.trim(),
        groom_family_members: groomFamily.trim(),
        bride_family_members: brideFamily.trim(),
        mate_discount_info: mateDiscountInfo.trim(),
        shooting_requests: shootingRequests.trim(),
        retouch_requests: retouchRequests.trim(),
        portfolio_agreed: portfolioAgreed,
        referral_source: referralSource,
        sns_account: snsAccount.trim(),
        terms_agreed: true,
        idempotency_key: idempotencyKey,
      });

      router.push(`/request/success?number=${created.request_number}&type=application`);
    } catch (err: any) {
      setErrorMessage('신청서 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-600 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* 단계 인디케이터 */}
      <div className="flex items-center justify-center gap-3 text-xs">
        <div
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-medium ${
            step === 1
              ? 'bg-[#2b261f] text-white shadow-sm'
              : 'bg-[#ede7dd] text-[#73695c]'
          }`}
        >
          <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px]">1</span>
          <span>계약 약관 동의</span>
        </div>
        <div className="w-6 h-px bg-[#d1c7b8]" />
        <div
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-medium ${
            step === 2
              ? 'bg-[#2b261f] text-white shadow-sm'
              : 'bg-[#ede7dd] text-[#73695c]'
          }`}
        >
          <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px]">2</span>
          <span>신청서 작성</span>
        </div>
      </div>

      {/* 선택된 견적 조건 요약 카드 */}
      <div className="bg-[#f5f1ea] border border-[#d8cdbc] p-4 rounded-2xl text-xs space-y-1.5 shadow-sm">
        <div className="flex justify-between items-center">
          <span className="font-semibold text-[#2b261f] flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#8f7a56]" />
            <span>선택하신 견적 조건이 신청서에 자동 적용되었습니다</span>
          </span>
          <span className="font-serif font-semibold text-sm text-[#8f7a56]">
            예상 {estimatedTotal.toLocaleString()}원
          </span>
        </div>
        <div className="text-[11.5px] text-[#5c5549] flex flex-wrap gap-x-3 gap-y-1 pt-1 border-t border-[#e3d9ca]">
          <span>• 기본 상품: <strong className="text-[#2b261f]">{selectedProduct?.name}</strong> ({productPrice.toLocaleString()}원)</span>
          {selectedOptionIds.length > 0 && (
            <span>
              • 추가 옵션: <strong className="text-[#2b261f]">{options.filter((o) => selectedOptionIds.includes(o.id)).map((o) => o.name).join(', ')}</strong> (+{optionsPrice.toLocaleString()}원)
            </span>
          )}
          {portfolioAgreed && (
            <span>• 신청 혜택: <strong className="text-emerald-700">포트폴리오 활용 동의 (-100,000원)</strong></span>
          )}
          {mateDiscountInfo && (
            <span>• 신청 혜택: <strong className="text-emerald-700">짝꿍할인 (-50,000원)</strong></span>
          )}
        </div>
      </div>

      {/* ======================= STEP 1: 약관 동의 ======================= */}
      {step === 1 && (
        <div className="space-y-6">
          <div className="border-b border-[#e8e2d8] pb-4">
            <div className="flex items-center gap-2 text-[#8f7a56] text-xs font-semibold mb-1">
              <Shield className="w-4 h-4" />
              <span>DEAR MEMORY CONTRACT POLICY</span>
            </div>
            <h2 className="text-xl font-serif text-[#2b261f]">본식스냅 계약 약관 (13개 조항)</h2>
            <p className="text-xs text-[#5c5549] mt-1">
              이 계약 약관 동의서는 디어메모리에서 제공하는 서비스를 이용함에 있어 전반적 사항에 대한 이용자의 동의를 확인하는 목적입니다.
            </p>
          </div>

          {/* 13개 조항 아코디언/스크롤 영역 */}
          <div className="max-h-[460px] overflow-y-auto space-y-3 pr-2 rounded-2xl p-1 scrollbar-thin">
            {CONTRACT_POLICY_CONFIG.sections.map((section) => {
              const isOpen = expandedArticles[section.id] !== false; // 기본 펼침
              return (
                <div
                  key={section.id}
                  className="bg-[#faf8f5] border border-[#e8e2d8] rounded-xl overflow-hidden text-xs"
                >
                  <button
                    type="button"
                    onClick={() => toggleArticle(section.id)}
                    className="w-full px-4 py-3 text-left font-semibold text-[#2b261f] flex justify-between items-center hover:bg-[#f3ede3] transition-colors"
                  >
                    <span>{section.title}</span>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-[#8f7a56]" /> : <ChevronDown className="w-4 h-4 text-[#8f7a56]" />}
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-3.5 pt-1 text-[#5c5549] leading-relaxed border-t border-[#f1ede7] whitespace-pre-line text-[11.5px]">
                      {section.content}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="bg-[#f5f1ea] p-5 rounded-2xl border border-[#e8e2d8] space-y-3">
            <p className="text-[11px] text-[#73695c] leading-relaxed">
              ※ 디어메모리의 모든 상품 계약은 본 촬영 약관의 동의 절차를 확인 후 진행되며, 계약 진행된 모든 상품은 촬영 약관에 동의한 것으로 간주됩니다. 디어메모리는 약관 동의 및 계약 체결을 위해 개인정보를 수집·이용합니다.
            </p>

            <label className="flex items-center gap-3 p-3.5 bg-white rounded-xl border border-[#c7b698] cursor-pointer hover:border-[#8f7a56] transition-colors">
              <input
                type="checkbox"
                checked={termsAgreed}
                onChange={(e) => setTermsAgreed(e.target.checked)}
                className="w-4 h-4 rounded border-[#c7b698] text-[#8f7a56] focus:ring-[#8f7a56]"
              />
              <span className="text-xs font-semibold text-[#2b261f]">
                [필수] 위 계약 약관 및 개인정보 수집·이용에 동의합니다.
              </span>
            </label>
          </div>

          <button
            type="button"
            onClick={handleStep1Proceed}
            className="w-full py-4 bg-[#2b261f] hover:bg-[#473e32] text-white rounded-full text-xs sm:text-sm font-medium tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>동의하고 신청서 작성하기</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ======================= STEP 2: 신청서 작성 ======================= */}
      {step === 2 && (
        <form onSubmit={handleSubmit} className="space-y-10">
          {/* 1. 신랑신부님 성함 및 연락처 */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#6e5c3d] flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-[#8f7a56]" />
              <span>1. 신랑신부님 성함 및 연락처 <span className="text-red-500">*</span></span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#2b261f] mb-1">
                  신랑님 성함 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={groomName}
                  onChange={(e) => setGroomName(e.target.value)}
                  placeholder="예: 원빈"
                  className="w-full px-4 py-3 rounded-xl border border-[#e8e2d8] focus:border-[#8f7a56] focus:outline-none text-xs bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#2b261f] mb-1">
                  신랑님 연락처 📞 <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={groomPhone}
                  onChange={(e) => setGroomPhone(e.target.value)}
                  placeholder="010-1234-5678"
                  className="w-full px-4 py-3 rounded-xl border border-[#e8e2d8] focus:border-[#8f7a56] focus:outline-none text-xs bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#2b261f] mb-1">
                  신부님 성함 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={brideName}
                  onChange={(e) => setBrideName(e.target.value)}
                  placeholder="예: 이나영"
                  className="w-full px-4 py-3 rounded-xl border border-[#e8e2d8] focus:border-[#8f7a56] focus:outline-none text-xs bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#2b261f] mb-1">
                  신부님 연락처 📞 <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={bridePhone}
                  onChange={(e) => setBridePhone(e.target.value)}
                  placeholder="010-9876-5432"
                  className="w-full px-4 py-3 rounded-xl border border-[#e8e2d8] focus:border-[#8f7a56] focus:outline-none text-xs bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#2b261f] mb-1">
                이메일 주소 ✉️ (계약서 및 원본파일 수령용) <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="wedding@example.com"
                className="w-full px-4 py-3 rounded-xl border border-[#e8e2d8] focus:border-[#8f7a56] focus:outline-none text-xs bg-white"
              />
            </div>
          </div>

          {/* 2. 예식 및 메이크업 정보 */}
          <div className="space-y-4 pt-4 border-t border-[#f1ede7]">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#6e5c3d] flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#8f7a56]" />
              <span>2. 예식 및 메이크업 정보 <span className="text-red-500">*</span></span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#2b261f] mb-1">
                  예식 날짜 📅 <span className="text-red-500">*</span>
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
                <label className="block text-xs font-medium text-[#2b261f] mb-1">
                  예식 시간 ⏰ <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={weddingTime}
                  onChange={(e) => setWeddingTime(e.target.value)}
                  placeholder="예: 14:00 식 (또는 2시 식)"
                  className="w-full px-4 py-3 rounded-xl border border-[#e8e2d8] focus:border-[#8f7a56] focus:outline-none text-xs bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#2b261f] mb-1">
                  예식장 (웨딩홀 장소) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  placeholder="예: 보타닉파크웨딩"
                  className="w-full px-4 py-3 rounded-xl border border-[#e8e2d8] focus:border-[#8f7a56] focus:outline-none text-xs bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#2b261f] mb-1">
                  홀 이름 (선택)
                </label>
                <input
                  type="text"
                  value={hallName}
                  onChange={(e) => setHallName(e.target.value)}
                  placeholder="예: 카라홀 (미정 시 생략 가능)"
                  className="w-full px-4 py-3 rounded-xl border border-[#e8e2d8] focus:border-[#8f7a56] focus:outline-none text-xs bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#2b261f] mb-1">
                  메이크업 샵 장소
                </label>
                <input
                  type="text"
                  value={makeupVenue}
                  onChange={(e) => setMakeupVenue(e.target.value)}
                  placeholder="예: 알루 청담점 (모르신다면 '미정')"
                  className="w-full px-4 py-3 rounded-xl border border-[#e8e2d8] focus:border-[#8f7a56] focus:outline-none text-xs bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#2b261f] mb-1">
                  메이크업 in / out 시간
                </label>
                <input
                  type="text"
                  value={makeupOutTime}
                  onChange={(e) => setMakeupOutTime(e.target.value)}
                  placeholder="예: IN 10:30 / OUT 12:30 (미정 가능)"
                  className="w-full px-4 py-3 rounded-xl border border-[#e8e2d8] focus:border-[#8f7a56] focus:outline-none text-xs bg-white"
                />
              </div>
            </div>
          </div>

          {/* 3. 직계 가족 구성원 */}
          <div className="space-y-4 pt-4 border-t border-[#f1ede7]">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#6e5c3d] flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-[#8f7a56]" />
              <span>3. 직계 가족 구성원 (원판 촬영 동선 확인용) <span className="text-red-500">*</span></span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#2b261f] mb-1">
                  신랑님 가족구성 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={groomFamily}
                  onChange={(e) => setGroomFamily(e.target.value)}
                  placeholder="예: 부모님, 형, 남동생"
                  className="w-full px-4 py-3 rounded-xl border border-[#e8e2d8] focus:border-[#8f7a56] focus:outline-none text-xs bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#2b261f] mb-1">
                  신부님 가족구성 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={brideFamily}
                  onChange={(e) => setBrideFamily(e.target.value)}
                  placeholder="예: 부모님, 언니"
                  className="w-full px-4 py-3 rounded-xl border border-[#e8e2d8] focus:border-[#8f7a56] focus:outline-none text-xs bg-white"
                />
              </div>
            </div>
          </div>

          {/* 4. 본식스냅 상품 선택 */}
          <div className="space-y-4 pt-4 border-t border-[#f1ede7]">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#6e5c3d] flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5 text-[#8f7a56]" />
              <span>4. 본식스냅 상품 선택 <span className="text-red-500">*</span></span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {products.map((p) => {
                const isSelected = productId === p.id;
                const albumSummary = p.id === 'standard' ? '실속형 (앨범 1권)' : '화보형 (앨범 3권)';
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setProductId(p.id)}
                    className={`p-5 rounded-2xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#8f7a56] bg-[#f5f1ea] shadow-md ring-2 ring-[#8f7a56]'
                        : 'border-[#e8e2d8] hover:border-[#c7b698] bg-white'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-serif font-medium text-base text-[#2b261f]">
                        {albumSummary}
                      </span>
                      <span className="font-serif text-sm font-semibold text-[#8f7a56]">
                        {p.base_price.toLocaleString()}원
                      </span>
                    </div>
                    <p className="text-xs text-[#73695c] mb-3">{p.subtitle}</p>
                    <ul className="text-[11px] text-[#5c5549] space-y-1">
                      <li>• 원본: {p.original_count} / 보정: {p.retouched_count}장</li>
                      <li>• {p.album_spec}</li>
                    </ul>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 5. 추가 옵션 (선택) */}
          <div className="space-y-4 pt-4 border-t border-[#f1ede7]">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#6e5c3d]">
              5. 추가 옵션 (선택)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {options.map((opt) => {
                const isSelected = selectedOptionIds.includes(opt.id);
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => toggleOption(opt.id)}
                    className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#8f7a56] bg-[#f5f1ea]'
                        : 'border-[#e8e2d8] hover:border-[#c7b698] bg-white'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold text-[#2b261f]">{opt.name}</span>
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

          {/* 6. 할인 및 혜택 신청 */}
          <div className="space-y-4 pt-4 border-t border-[#f1ede7]">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#6e5c3d] flex items-center gap-1.5">
              <Gift className="w-3.5 h-3.5 text-[#8f7a56]" />
              <span>6. 혜택 및 할인 신청</span>
            </h3>

            <div className="space-y-3">
              {/* 포트폴리오 동의 */}
              <label className="flex items-start gap-3 p-4 rounded-2xl bg-white border border-[#e8e2d8] cursor-pointer hover:border-[#8f7a56] transition-colors">
                <input
                  type="checkbox"
                  checked={portfolioAgreed}
                  onChange={(e) => setPortfolioAgreed(e.target.checked)}
                  className="mt-0.5 rounded border-[#c7b698] text-[#8f7a56] focus:ring-[#8f7a56]"
                />
                <div className="text-xs flex-1">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-[#2b261f]">
                      포트폴리오 활용 동의 (동의 시 -10만원 할인)
                    </span>
                    <span className="text-xs font-bold text-emerald-600">-100,000원</span>
                  </div>
                  <p className="text-[#73695c] mt-0.5 text-[11px]">
                    촬영된 사진의 디어메모리 공식 웹사이트 및 인스타그램 포트폴리오 게재에 동의합니다.
                  </p>
                </div>
              </label>

              {/* 짝꿍할인 */}
              <div className="p-4 rounded-2xl bg-white border border-[#e8e2d8] space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-[#2b261f]">짝꿍할인 (선택)</span>
                  <span className="text-[11px] text-[#8f7a56]">-50,000원 (확인 후 적용)</span>
                </div>
                <input
                  type="text"
                  value={mateDiscountInfo}
                  onChange={(e) => setMateDiscountInfo(e.target.value)}
                  placeholder='상대방 "예식일_성함" 입력 (예: 250522_김철수 / 없다면 생략)'
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e8e2d8] focus:border-[#8f7a56] focus:outline-none text-xs bg-[#faf8f5]"
                />
              </div>
            </div>
          </div>

          {/* 7. 세부 요청사항 및 기타 */}
          <div className="space-y-4 pt-4 border-t border-[#f1ede7]">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#6e5c3d]">
              7. 촬영 및 후보정 세부 요청사항
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#2b261f] mb-1">
                  본식스냅 촬영 시 요청사항 (자세히)
                </label>
                <textarea
                  rows={2}
                  value={shootingRequests}
                  onChange={(e) => setShootingRequests(e.target.value)}
                  placeholder="예: 신랑신부 위주로 담아주세요 / 부모님 사진도 많이 담아주세요 / 하객 자연스러운 스냅 위주 등"
                  className="w-full px-4 py-3 rounded-xl border border-[#e8e2d8] focus:border-[#8f7a56] focus:outline-none text-xs bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#2b261f] mb-1">
                  후보정 시 요청사항 (자세히)
                </label>
                <textarea
                  rows={2}
                  value={retouchRequests}
                  onChange={(e) => setRetouchRequests(e.target.value)}
                  placeholder="예: 피부 톤 밝고 투명하게 / 팔 라인 및 턱선 자연스러운 정리 / 색감 따뜻한 피치톤 선호 등"
                  className="w-full px-4 py-3 rounded-xl border border-[#e8e2d8] focus:border-[#8f7a56] focus:outline-none text-xs bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#2b261f] mb-1">
                    알게 된 경로
                  </label>
                  <select
                    value={referralSource}
                    onChange={(e) => setReferralSource(e.target.value)}
                    className="w-full px-3 py-3 rounded-xl border border-[#e8e2d8] text-xs bg-white"
                  >
                    <option value="인스타그램">인스타그램</option>
                    <option value="블로그 후기">블로그 후기</option>
                    <option value="카페 후기">웨딩 카페 후기 (다이렉트/멕마웨 등)</option>
                    <option value="지인소개">지인 소개</option>
                    <option value="기타 경로">기타 경로</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#2b261f] mb-1">
                    SNS 주소 (인스타그램 또는 블로그)
                  </label>
                  <input
                    type="text"
                    value={snsAccount}
                    onChange={(e) => setSnsAccount(e.target.value)}
                    placeholder="후기 할인 등 확인용 SNS 계정"
                    className="w-full px-4 py-3 rounded-xl border border-[#e8e2d8] focus:border-[#8f7a56] focus:outline-none text-xs bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#2b261f] mb-1">
                  기타 요청사항
                </label>
                <input
                  type="text"
                  value={otherRequests}
                  onChange={(e) => setOtherRequests(e.target.value)}
                  placeholder="추가로 전달하고 싶으신 메모가 있다면 적어주세요."
                  className="w-full px-4 py-3 rounded-xl border border-[#e8e2d8] focus:border-[#8f7a56] focus:outline-none text-xs bg-white"
                />
              </div>
            </div>
          </div>

          {/* 8. 예상 금액 요약 및 제출 */}
          <div className="bg-[#2b261f] text-[#faf8f5] p-6 sm:p-8 rounded-3xl space-y-4">
            <div className="flex justify-between items-baseline border-b border-[#473e32] pb-4">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#c7b698] font-serif block">
                  Estimated Total
                </span>
                <span className="text-xl sm:text-2xl font-serif text-white">
                  최종 예상 계약 금액
                </span>
              </div>
              <span className="text-2xl sm:text-3xl font-serif font-light text-[#c7b698]">
                {estimatedTotal.toLocaleString()}원
              </span>
            </div>

            <div className="text-xs text-[#c9bfaf] space-y-1">
              <p>• 선택 상품: {selectedProduct.name} ({productPrice.toLocaleString()}원)</p>
              {optionsPrice > 0 && <p>• 추가 옵션: +{optionsPrice.toLocaleString()}원</p>}
              {portfolioDiscount > 0 && <p>• 포트폴리오 할인: -100,000원</p>}
              {mateDiscount > 0 && <p>• 짝꿍할인: -50,000원 (검토 후 반영)</p>}
              <p className="text-[11px] text-[#9e9484] pt-1">
                ※ 계약금(예약금)은 300,000원이며, 신청서 제출 후 대표작가의 일정 검토가 완료되면 정식 계약서와 함께 계좌 안내가 발송됩니다.
              </p>
            </div>

            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="py-4 px-6 border border-[#5c5549] text-[#c9bfaf] hover:text-white rounded-full text-xs font-medium cursor-pointer"
              >
                약관 다시 보기
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-4 bg-[#8f7a56] hover:bg-[#a68e65] disabled:bg-[#5c5549] text-white rounded-full text-xs sm:text-sm font-medium tracking-wider transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <span>접수 처리 중입니다...</span>
                ) : (
                  <>
                    <span>촬영 계약 신청서 제출하기</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}

export default function ApplyPage() {
  return (
    <div className="py-16 sm:py-24 bg-[#faf8f5]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <p className="text-xs font-serif tracking-[0.25em] text-[#8f7a56] uppercase mb-2">Application</p>
          <h1 className="text-3xl font-serif text-[#2b261f]">본식스냅 계약 신청서</h1>
          <p className="mt-3 text-xs sm:text-sm text-[#5c5549] leading-relaxed">
            약관 동의 및 신청서를 작성해 주시면 대표작가가 일정을 검토한 후 온라인 계약서를 안내해 드립니다.
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
