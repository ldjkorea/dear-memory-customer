'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldCheck, Inbox, FileText, Settings, BookOpen, ArrowLeft } from 'lucide-react';

export function AdminNav() {
  const pathname = usePathname();

  const links = [
    { href: '/admin', label: '대시보드', icon: ShieldCheck, exact: true },
    { href: '/admin/requests', label: '접수 관리', icon: Inbox },
    { href: '/admin/contracts', label: '계약 관리', icon: FileText },
    { href: '/admin/catalog', label: '카탈로그 / 정책', icon: BookOpen },
    { href: '/admin/settings', label: '저장소 설정', icon: Settings },
  ];

  return (
    <div className="bg-[#24201a] text-[#c9bfaf] border-b border-[#3b342b]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
        <div className="flex items-center gap-6">
          <Link href="/admin" className="flex items-center gap-2 text-white font-serif text-sm shrink-0">
            <ShieldCheck className="w-4 h-4 text-[#c7b698]" />
            <span>대표 관리자 모드</span>
          </Link>

          {/* PC 데스크톱 내비게이션 */}
          <nav className="hidden md:flex items-center gap-1">
            {links.map((link) => {
              const isActive = link.exact
                ? pathname === link.href
                : pathname.startsWith(link.href);
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                    isActive
                      ? 'bg-[#3b342b] text-white font-semibold'
                      : 'text-[#9e9484] hover:text-white hover:bg-[#2e2922]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <Link
          href="/"
          className="text-xs text-[#c7b698] hover:text-white flex items-center gap-1 transition-colors shrink-0"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span className="hidden xs:inline">고객 화면</span>
          <span className="xs:hidden">나가기</span>
        </Link>
      </div>

      {/* 모바일 가로 스크롤 메뉴 탭바 (md 미만 전용) */}
      <div className="md:hidden border-t border-[#342e26] px-3 py-1.5 overflow-x-auto no-scrollbar flex items-center gap-1.5">
        {links.map((link) => {
          const isActive = link.exact
            ? pathname === link.href
            : pathname.startsWith(link.href);
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 shrink-0 transition-colors whitespace-nowrap ${
                isActive
                  ? 'bg-[#8f7a56] text-white font-semibold shadow-xs'
                  : 'text-[#a89d8d] hover:text-white bg-[#2d2720]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
