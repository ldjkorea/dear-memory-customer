import React from 'react';
import Link from 'next/link';
import { CatalogService } from '@/services/catalogService';
import { Check, ArrowRight } from 'lucide-react';

export function ProductPreview() {
  const products = CatalogService.getProducts();

  return (
    <section className="py-20 bg-[#f5f1ea] border-y border-[#e8e2d8]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-xs font-serif tracking-widest text-[#8f7a56] uppercase mb-2">Package</p>
          <h2 className="text-2xl sm:text-3xl font-serif text-[#2b261f]">두 분을 위한 명확한 선택</h2>
          <p className="mt-3 text-sm text-[#5c5549]">
            불필요한 거품을 걷어내고 가장 소중한 순간에 집중할 수 있는 두 가지 패키지입니다.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className={`rounded-3xl p-8 border flex flex-col justify-between transition-all ${
                product.id === 'album_plus'
                  ? 'bg-white border-[#c7b698] shadow-md ring-1 ring-[#c7b698]/30 relative'
                  : 'bg-[#faf8f5] border-[#e8e2d8]'
              }`}
            >
              {product.badge && (
                <span className="absolute -top-3 left-8 px-3 py-1 bg-[#8f7a56] text-white text-[11px] font-medium tracking-wider uppercase rounded-full">
                  {product.badge}
                </span>
              )}

              <div>
                <div className="flex justify-between items-baseline mb-2">
                  <h3 className="text-xl font-serif font-medium text-[#2b261f]">{product.name}</h3>
                  <span className="text-2xl font-serif font-light text-[#2b261f]">
                    {product.base_price.toLocaleString()}원
                  </span>
                </div>
                <p className="text-xs text-[#6e5c3d] mb-6">{product.subtitle}</p>

                <ul className="space-y-3 mb-8 text-xs text-[#5c5549]">
                  {product.included_items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-[#8f7a56] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-[#f1ede7] flex items-center justify-between">
                <Link
                  href={`/product/${product.id}`}
                  className="text-xs font-medium text-[#8f7a56] hover:text-[#2b261f] flex items-center gap-1 transition-colors"
                >
                  <span>상품 상세 보기</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <Link
                  href={`/apply?product=${product.id}`}
                  className="px-4 py-2 text-xs bg-[#2b261f] text-[#faf8f5] rounded-full hover:bg-[#473e32] transition-colors"
                >
                  신청하기
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/product"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#5c5549] hover:text-[#2b261f] transition-colors"
          >
            <span>전체 상품 및 세부 옵션 안내 보기</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
