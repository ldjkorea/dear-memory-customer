import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CatalogService } from '@/services/catalogService';
import { Check, ArrowRight, ArrowLeft, ShieldCheck, Heart } from 'lucide-react';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return [
    { id: 'standard' },
    { id: 'album_plus' },
  ];
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  const product = CatalogService.getProductById(id);

  if (!product) {
    notFound();
  }

  const options = CatalogService.getOptions();

  return (
    <div className="py-16 sm:py-24 bg-[#faf8f5]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Back Link */}
        <div className="mb-8">
          <Link
            href="/product"
            className="inline-flex items-center gap-1.5 text-xs text-[#8f7a56] hover:text-[#2b261f] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>전체 상품 목록으로 돌아가기</span>
          </Link>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#e8e2d8] shadow-sm mb-12">
          {product.badge && (
            <span className="inline-block px-3 py-1 bg-[#8f7a56] text-white text-[11px] font-medium tracking-wider uppercase rounded-full mb-4">
              {product.badge}
            </span>
          )}

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-baseline gap-4 pb-6 border-b border-[#f1ede7] mb-8">
            <div>
              <h1 className="text-3xl font-serif text-[#2b261f]">{product.name}</h1>
              <p className="text-sm text-[#8f7a56] mt-1">{product.subtitle}</p>
            </div>
            <div className="text-right">
              <span className="text-xs text-[#6e5c3d] block">기본 상품가 (VAT 포함)</span>
              <span className="text-3xl font-serif font-light text-[#2b261f]">
                {product.base_price.toLocaleString()}원
              </span>
            </div>
          </div>

          <p className="text-sm text-[#5c5549] leading-relaxed mb-10">{product.description}</p>

          {/* Included Items */}
          <div className="mb-10">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#6e5c3d] mb-4">
              기본 제공 구성품
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {product.included_items.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-[#faf8f5]">
                  <Check className="w-4 h-4 text-[#8f7a56] shrink-0 mt-0.5" />
                  <span className="text-xs text-[#2b261f]">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Specs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 rounded-2xl bg-[#f5f1ea] text-xs text-[#5c5549] mb-10">
            <div>
              <span className="text-[#6e5c3d] block mb-1">원본 제공</span>
              <span className="font-medium text-sm text-[#2b261f]">{product.original_count}</span>
            </div>
            <div>
              <span className="text-[#6e5c3d] block mb-1">정밀 보정본</span>
              <span className="font-medium text-sm text-[#2b261f]">{product.retouched_count}장</span>
            </div>
            <div>
              <span className="text-[#6e5c3d] block mb-1">앨범 규격</span>
              <span className="font-medium text-sm text-[#2b261f]">{product.album_spec}</span>
            </div>
          </div>

          {/* Promotion / Policy Note */}
          {product.needs_confirmation && (
            <div className="p-4 rounded-2xl bg-[#f5f1ea] border border-[#e8e2d8] text-xs text-[#6e5c3d] mb-10 flex items-start gap-2">
              <Heart className="w-4 h-4 text-[#8f7a56] shrink-0 mt-0.5" />
              <div>
                <span className="font-medium text-[#2b261f]">스페셜 프로모션 안내: </span>
                <span>2인 촬영 등 프로모션 적용 가능 여부는 예식 일정 상담 후 친절히 안내해 드립니다.</span>
              </div>
            </div>
          )}

          {/* CTA Area */}
          <div className="pt-6 border-t border-[#f1ede7] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-[#73695c]">
              신청서 작성 후 일정 확인을 거쳐 계약서가 발행됩니다.
            </div>
            <Link
              href={`/apply?product=${product.id}`}
              className="w-full sm:w-auto px-8 py-4 bg-[#2b261f] hover:bg-[#473e32] text-[#faf8f5] rounded-full text-xs font-medium tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
            >
              <span>이 상품으로 촬영 신청</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
