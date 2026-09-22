import React from 'react';
import { HeroSection } from '@/components/customer/HeroSection';
import { PortfolioPreview } from '@/components/customer/PortfolioPreview';
import { ProductPreview } from '@/components/customer/ProductPreview';
import { TrustGuide } from '@/components/customer/TrustGuide';
import { BottomCta } from '@/components/customer/BottomCta';

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <PortfolioPreview />
      <ProductPreview />
      <TrustGuide />
      <BottomCta />
    </div>
  );
}
