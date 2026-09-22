'use client';

import React, { useState } from 'react';
import { defaultStorageAdapter } from '@/lib/storage/LocalStorageAdapter';
import { Database, RefreshCw, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function AdminSettingsPage() {
  const [resetting, setResetting] = useState(false);
  const [message, setMessage] = useState('');

  const handleReset = async () => {
    if (confirm('모든 접수, 계약, 예약 데이터를 초기 데모(Demo) 상태로 되돌리시겠습니까?')) {
      setResetting(true);
      await defaultStorageAdapter.resetToDemo();
      setResetting(false);
      setMessage('데모 데이터로 초기화가 완료되었습니다.');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-2xl font-serif text-[#2b261f]">시스템 및 저장소 설정</h1>
        <p className="text-xs text-[#5c5549] mt-1">저장소 어댑터 상태 점검 및 개발용 데이터 초기화를 수행합니다.</p>
      </div>

      {message && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* Storage Mode Card */}
      <div className="bg-white p-6 rounded-2xl border border-[#e8e2d8] shadow-sm space-y-4 text-xs">
        <div className="flex items-center gap-2 text-[#8f7a56] border-b border-[#f1ede7] pb-3">
          <Database className="w-5 h-5" />
          <h3 className="font-serif text-base text-[#2b261f]">현재 활성 저장소 모드</h3>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3 py-1 bg-[#2b261f] text-white rounded-full font-mono text-[11px]">
            LocalStorage / Demo Mode
          </span>
          <span className="text-[#6e5c3d]">키: dear_memory_customer_v1</span>
        </div>

        <p className="text-[#5c5549] leading-relaxed">
          고객 웹 서비스는 내부 운영 시스템(Dear Memory OS)과 완전히 독립된 별도의 키(`dear_memory_customer_v1`)를 사용하므로, 양측의 데이터가 서로 충돌하거나 덮어쓰여지지 않습니다.
        </p>

        <div className="pt-4 border-t border-[#f1ede7]">
          <h4 className="font-semibold text-[#2b261f] mb-2">향후 Google Sheets 또는 Supabase 확장 안내</h4>
          <p className="text-[#73695c] leading-relaxed">
            저장소 어댑터 인터페이스(`IStorageAdapter`) 구조로 설계되어 있어, 향후 구글 시트 URL 또는 DB 연결 정보만 설정하면 UI나 비즈니스 로직 수정 없이 중앙 클라우드 저장소로 손쉽게 전환할 수 있습니다.
          </p>
        </div>
      </div>

      {/* Reset Data Card */}
      <div className="bg-white p-6 rounded-2xl border border-[#e8e2d8] shadow-sm space-y-4 text-xs">
        <h3 className="font-serif text-base text-[#2b261f] border-b border-[#f1ede7] pb-3">
          개발 및 테스트 데이터 초기화
        </h3>
        <p className="text-[#5c5549] leading-relaxed">
          테스트 과정에서 등록된 신규 접수, 계약서, 예약 내역을 초기 샘플(김민수, 박지현 고객) 데이터로 리셋합니다.
        </p>
        <button
          type="button"
          onClick={handleReset}
          disabled={resetting}
          className="px-4 py-2.5 bg-[#8f7a56] hover:bg-[#a68e65] text-white rounded-xl font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${resetting ? 'animate-spin' : ''}`} />
          <span>{resetting ? '초기화 중...' : '기본 데모 상태로 초기화'}</span>
        </button>
      </div>
    </div>
  );
}
