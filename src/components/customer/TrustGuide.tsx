import React from 'react';
import { PolicyService } from '@/services/policyService';
import { ShieldCheck, Image, Clock, Sparkles } from 'lucide-react';

export function TrustGuide() {
  const policy = PolicyService.getCurrentPolicy();

  const trustItems = [
    {
      icon: ShieldCheck,
      title: '정찰제 & VAT 포함',
      desc: '모든 상품과 옵션 금액은 부가세가 포함된 투명한 최종 금액 기준입니다.',
    },
    {
      icon: Image,
      title: '고화질 JPG 규격',
      desc: policy.image_spec,
    },
    {
      icon: Clock,
      title: '명확한 납기 약속',
      desc: policy.delivery_timeline,
    },
    {
      icon: Sparkles,
      title: '체계적인 원본 백업',
      desc: policy.backup_retention,
    },
  ];

  return (
    <section className="py-20 bg-[#faf8f5]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-xs font-serif tracking-widest text-[#8f7a56] uppercase mb-2">Our Promise</p>
          <h2 className="text-2xl sm:text-3xl font-serif text-[#2b261f]">디어메모리의 약속</h2>
          <p className="mt-3 text-sm text-[#5c5549]">
            평생 남을 기록인 만큼, 투명한 규정과 정직한 프로세스로 신뢰를 드립니다.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trustItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white p-6 rounded-2xl border border-[#e8e2d8] hover:border-[#c7b698] transition-colors shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#f5f1ea] text-[#8f7a56] flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-medium text-[#2b261f] mb-2">{item.title}</h3>
                  <p className="text-xs text-[#5c5549] leading-relaxed">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
