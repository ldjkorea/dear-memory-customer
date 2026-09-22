'use client';

import React, { useState, useEffect } from 'react';
import { Lock, ShieldCheck, ArrowRight, AlertCircle } from 'lucide-react';

const ADMIN_AUTH_KEY = 'dm_admin_authenticated';
const DEFAULT_PIN = '1234';

export function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const auth = sessionStorage.getItem(ADMIN_AUTH_KEY);
      if (auth === 'true') {
        setIsAuthenticated(true);
      }
      setChecking(false);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.trim() === DEFAULT_PIN || pin.trim() === '0000') {
      sessionStorage.setItem(ADMIN_AUTH_KEY, 'true');
      setIsAuthenticated(true);
      setError(false);
    } else {
      setError(true);
      setPin('');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem(ADMIN_AUTH_KEY);
    setIsAuthenticated(false);
  };

  if (checking) {
    return <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center text-xs text-[#8f7a56]">보안 세션 확인 중...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-[#e8e2d8] shadow-xl text-center space-y-6">
          <div className="w-14 h-14 bg-[#2b261f] text-white rounded-2xl flex items-center justify-center mx-auto shadow-md">
            <Lock className="w-7 h-7 text-[#c7b698]" />
          </div>

          <div>
            <p className="text-[11px] font-mono tracking-widest uppercase text-[#8f7a56] font-semibold mb-1">
              SECURITY ACCESS
            </p>
            <h1 className="text-2xl font-serif text-[#2b261f]">대표 관리자 인증</h1>
            <p className="text-xs text-[#5c5549] mt-2 leading-relaxed">
              본 페이지는 디어메모리 내부 운영 전용 공간입니다.<br />
              대표 관리자 비밀번호(PIN)를 입력해 주세요.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <input
                type="password"
                maxLength={6}
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setError(false);
                }}
                placeholder="PIN 번호 입력 (기본: 1234)"
                autoFocus
                className="w-full text-center text-xl tracking-[0.4em] py-3.5 px-4 rounded-xl border border-[#e8e2d8] focus:border-[#8f7a56] focus:outline-none bg-[#faf8f5] font-mono font-bold"
              />
              {error && (
                <p className="text-[11px] text-red-500 flex items-center justify-center gap-1 mt-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>비밀번호가 올바르지 않습니다. 다시 입력해 주세요.</span>
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#2b261f] hover:bg-[#473e32] text-white rounded-xl text-xs font-medium tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md"
            >
              <span>관리자 패널 접속</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <p className="text-[10px] text-[#9e9484] border-t border-[#f1ede7] pt-4">
            초기 비밀번호는 <code className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-700">1234</code> 입니다.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-[#2b261f] text-[#c7b698] px-4 py-1.5 text-[11px] flex justify-between items-center">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>대표 관리자 보안 세션 활성화됨 (한민규 대표)</span>
        </div>
        <button
          onClick={handleLogout}
          className="text-xs text-[#faf8f5] hover:text-white underline cursor-pointer"
        >
          관리자 로그아웃
        </button>
      </div>
      {children}
    </>
  );
}
