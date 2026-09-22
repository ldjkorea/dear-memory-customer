/**
 * 상품 및 가격 정책 서비스 (CatalogService)
 * Single Source of Truth + 대표 관리자 실시간 편집 및 동적 저장소 지원
 */

import { PRODUCTS_CONFIG } from '@/config/products';
import { OPTIONS_CONFIG } from '@/config/options';
import { DISCOUNTS_CONFIG } from '@/config/discounts';
import { ProductItem, OptionItem, DiscountItem, EstimatedPriceResult } from '@/types/catalog';
import { defaultStorageAdapter } from '@/lib/storage/LocalStorageAdapter';

export class CatalogService {
  /**
   * 브라우저 동기 캐시에서 저장된 상품 목록 조회 (Fallback: PRODUCTS_CONFIG)
   */
  static getProducts(): ProductItem[] {
    if (typeof window !== 'undefined') {
      try {
        const raw = window.localStorage.getItem('dear_memory_customer_v2');
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed.products && Array.isArray(parsed.products) && parsed.products.length > 0) {
            return [...parsed.products]
              .filter((p: ProductItem) => p.active)
              .sort((a: ProductItem, b: ProductItem) => a.display_order - b.display_order);
          }
        }
      } catch (e) {
        // fallback to static config
      }
    }
    return [...PRODUCTS_CONFIG]
      .filter((p) => p.active)
      .sort((a, b) => a.display_order - b.display_order);
  }

  /**
   * 특정 상품 조회
   */
  static getProductById(id: string): ProductItem | undefined {
    return this.getProducts().find((p) => p.id === id) || PRODUCTS_CONFIG.find((p) => p.id === id);
  }

  /**
   * 기본 추천 상품 반환
   */
  static getDefaultProduct(): ProductItem {
    return this.getProductById('album_plus') || this.getProducts()[0] || PRODUCTS_CONFIG[0];
  }

  /**
   * 활성 옵션 목록 반환
   */
  static getOptions(): OptionItem[] {
    if (typeof window !== 'undefined') {
      try {
        const raw = window.localStorage.getItem('dear_memory_customer_v2');
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed.options && Array.isArray(parsed.options) && parsed.options.length > 0) {
            return [...parsed.options]
              .filter((o: OptionItem) => o.active)
              .sort((a: OptionItem, b: OptionItem) => a.display_order - b.display_order);
          }
        }
      } catch (e) {
        // fallback to static config
      }
    }
    return [...OPTIONS_CONFIG]
      .filter((o) => o.active)
      .sort((a, b) => a.display_order - b.display_order);
  }

  /**
   * 특정 옵션 조회
   */
  static getOptionById(id: string): OptionItem | undefined {
    return this.getOptions().find((o) => o.id === id) || OPTIONS_CONFIG.find((o) => o.id === id);
  }

  /**
   * 활성 할인 목록 반환
   */
  static getDiscounts(): DiscountItem[] {
    if (typeof window !== 'undefined') {
      try {
        const raw = window.localStorage.getItem('dear_memory_customer_v2');
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed.discounts && Array.isArray(parsed.discounts) && parsed.discounts.length > 0) {
            return [...parsed.discounts].filter((d: DiscountItem) => d.active);
          }
        }
      } catch (e) {
        // fallback to static config
      }
    }
    return [...DISCOUNTS_CONFIG].filter((d) => d.active);
  }

  /**
   * 고객이 직접 선택 가능한 할인 목록 반환
   */
  static getCustomerSelectableDiscounts(): DiscountItem[] {
    return this.getDiscounts().filter((d) => d.active && d.customer_selectable);
  }

  /**
   * 특정 할인 조회
   */
  static getDiscountById(id: string): DiscountItem | undefined {
    return this.getDiscounts().find((d) => d.id === id) || DISCOUNTS_CONFIG.find((d) => d.id === id);
  }

  /**
   * [대표 관리자] 상품 정보 수정 및 저장
   */
  static async updateProduct(id: string, updates: Partial<ProductItem>): Promise<ProductItem | null> {
    const state = await defaultStorageAdapter.loadState();
    const currentProducts: ProductItem[] = state.products || [...PRODUCTS_CONFIG];
    const index = currentProducts.findIndex((p) => p.id === id);
    if (index === -1) return null;

    currentProducts[index] = { ...currentProducts[index], ...updates };
    state.products = currentProducts;
    await defaultStorageAdapter.saveState(state);
    return currentProducts[index];
  }

  /**
   * [대표 관리자] 옵션 정보 수정 및 저장
   */
  static async updateOption(id: string, updates: Partial<OptionItem>): Promise<OptionItem | null> {
    const state = await defaultStorageAdapter.loadState();
    const currentOptions: OptionItem[] = state.options || [...OPTIONS_CONFIG];
    const index = currentOptions.findIndex((o) => o.id === id);
    if (index === -1) return null;

    currentOptions[index] = { ...currentOptions[index], ...updates };
    state.options = currentOptions;
    await defaultStorageAdapter.saveState(state);
    return currentOptions[index];
  }

  /**
   * [대표 관리자] 신규 옵션 추가
   */
  static async addOption(option: OptionItem): Promise<OptionItem> {
    const state = await defaultStorageAdapter.loadState();
    const currentOptions: OptionItem[] = state.options || [...OPTIONS_CONFIG];
    currentOptions.push(option);
    state.options = currentOptions;
    await defaultStorageAdapter.saveState(state);
    return option;
  }

  /**
   * [대표 관리자] 할인 혜택 정보 수정 및 저장
   */
  static async updateDiscount(id: string, updates: Partial<DiscountItem>): Promise<DiscountItem | null> {
    const state = await defaultStorageAdapter.loadState();
    const currentDiscounts: DiscountItem[] = state.discounts || [...DISCOUNTS_CONFIG];
    const index = currentDiscounts.findIndex((d) => d.id === id);
    if (index === -1) return null;

    currentDiscounts[index] = { ...currentDiscounts[index], ...updates };
    state.discounts = currentDiscounts;
    await defaultStorageAdapter.saveState(state);
    return currentDiscounts[index];
  }

  /**
   * [대표 관리자] 카탈로그 설정을 초기 기본값으로 리셋
   */
  static async resetCatalogToDefault(): Promise<void> {
    const state = await defaultStorageAdapter.loadState();
    state.products = [...PRODUCTS_CONFIG];
    state.options = [...OPTIONS_CONFIG];
    state.discounts = [...DISCOUNTS_CONFIG];
    await defaultStorageAdapter.saveState(state);
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
