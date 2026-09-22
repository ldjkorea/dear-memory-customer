/**
 * 상품 및 가격 정책 서비스 (CatalogService)
 * UI와 Config 간의 단일 창구 역할
 */

import { PRODUCTS_CONFIG } from '@/config/products';
import { OPTIONS_CONFIG } from '@/config/options';
import { DISCOUNTS_CONFIG } from '@/config/discounts';
import { ProductItem, OptionItem, DiscountItem, EstimatedPriceResult } from '@/types/catalog';

export class CatalogService {
  /**
   * 활성 상품 목록 반환 (표시 순서 정렬)
   */
  static getProducts(): ProductItem[] {
    return [...PRODUCTS_CONFIG]
      .filter((p) => p.active)
      .sort((a, b) => a.display_order - b.display_order);
  }

  /**
   * 특정 상품 조회
   */
  static getProductById(id: string): ProductItem | undefined {
    return PRODUCTS_CONFIG.find((p) => p.id === id);
  }

  /**
   * 기본 추천 상품 반환
   */
  static getDefaultProduct(): ProductItem {
    return PRODUCTS_CONFIG.find((p) => p.id === 'album_plus') || PRODUCTS_CONFIG[0];
  }

  /**
   * 활성 옵션 목록 반환
   */
  static getOptions(): OptionItem[] {
    return [...OPTIONS_CONFIG]
      .filter((o) => o.active)
      .sort((a, b) => a.display_order - b.display_order);
  }

  /**
   * 특정 옵션 조회
   */
  static getOptionById(id: string): OptionItem | undefined {
    return OPTIONS_CONFIG.find((o) => o.id === id);
  }

  /**
   * 활성 할인 목록 반환
   */
  static getDiscounts(): DiscountItem[] {
    return [...DISCOUNTS_CONFIG].filter((d) => d.active);
  }

  /**
   * 고객이 직접 선택 가능한 할인 목록 반환
   */
  static getCustomerSelectableDiscounts(): DiscountItem[] {
    return [...DISCOUNTS_CONFIG].filter((d) => d.active && d.customer_selectable);
  }

  /**
   * 특정 할인 조회
   */
  static getDiscountById(id: string): DiscountItem | undefined {
    return DISCOUNTS_CONFIG.find((d) => d.id === id);
  }

  /**
   * 선택 조합에 따른 실시간 예상 금액 계산
   */
  static calculateEstimate(params: {
    productId?: string;
    optionIds?: string[];
    discountIds?: string[];
  }): EstimatedPriceResult {
    const product = params.productId ? this.getProductById(params.productId) || null : null;
    const productBasePrice = product ? product.base_price : 0;

    const selectedOptions = (params.optionIds || [])
      .map((id) => this.getOptionById(id))
      .filter((opt): opt is OptionItem => Boolean(opt));

    const optionsTotal = selectedOptions.reduce((acc, opt) => acc + opt.price, 0);

    const selectedDiscounts = (params.discountIds || [])
      .map((id) => this.getDiscountById(id))
      .filter((disc): disc is DiscountItem => Boolean(disc));

    const discountsTotal = selectedDiscounts.reduce((acc, disc) => acc + disc.amount, 0);

    const estimatedTotal = Math.max(0, productBasePrice + optionsTotal - discountsTotal);

    return {
      product,
      selectedOptions,
      selectedDiscounts,
      productBasePrice,
      optionsTotal,
      discountsTotal,
      estimatedTotal,
      notice: '예상 금액이며 일정 및 적용 조건 확인 후 최종 확정됩니다.',
    };
  }
}
