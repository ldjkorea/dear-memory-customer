'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Camera, ShieldCheck } from 'lucide-react';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: '홈' },
    { href: '/gallery', label: '갤러리' },
    { href: '/product', label: '상품 안내' },
    { href: '/faq', label: 'FAQ' },
    { href: '/inquiry', label: '촬영 문의' },
  ];

  const isAdmin = pathname.startsWith('/admin');

  return (
    <header className="sticky top-0 z-50 bg-[#faf8f5]/90 backdrop-blur-md border-b border-[#e8e2d8]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <Camera className="w-5 h-5 text-[#8f7a56] group-hover:scale-110 transition-transform" />
          <span className="font-serif tracking-[0.2em] text-lg sm:text-xl font-medium text-[#2b261f]">
            DEAR MEMORY
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm tracking-wide transition-colors ${
                  isActive
                    ? 'text-[#8f7a56] font-semibold border-b-2 border-[#8f7a56] pb-1'
                    : 'text-[#5c5549] hover:text-[#2b261f]'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* CTA & Admin Link */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/apply"
            className="px-4 py-2 text-xs uppercase tracking-widest bg-[#2b261f] text-[#faf8f5] rounded-full hover:bg-[#473e32] transition-colors shadow-sm"
          >
            촬영 신청
          </Link>
          <Link
            href="/admin"
            title="대표 관리자 패널"
            className="p-2 text-[#8f7a56] hover:text-[#2b261f] transition-colors"
          >
            <ShieldCheck className="w-4 h-4" />
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          <Link
            href="/apply"
            className="px-3 py-1.5 text-xs bg-[#2b261f] text-[#faf8f5] rounded-full"
          >
            신청
          </Link>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-[#2b261f] hover:bg-[#ede7dd] rounded-lg transition-colors"
            aria-label="메뉴 열기"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden border-b border-[#e8e2d8] bg-[#faf8f5] px-4 py-4 space-y-3 shadow-lg">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="block py-2 text-sm text-[#473e32] hover:text-[#8f7a56] border-b border-[#f1ede7]"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 flex justify-between items-center">
            <Link
              href="/admin"
              onClick={() => setIsOpen(false)}
              className="text-xs text-[#8f7a56] flex items-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              대표 관리자 모드
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
