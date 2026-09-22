import React from 'react';
import { AdminNav } from '@/components/admin/AdminNav';
import { AdminAuthGuard } from '@/components/admin/AdminAuthGuard';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthGuard>
      <div className="min-h-screen bg-[#f5f1ea] flex flex-col">
        <AdminNav />
        <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8">
          {children}
        </div>
      </div>
    </AdminAuthGuard>
  );
}
