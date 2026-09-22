import React from 'react';
import AdminRequestDetailPageClient from './RequestDetailClient';

export async function generateStaticParams() {
  return [
    { id: 'demo-req-001' },
    { id: 'demo-req-002' },
    { id: 'default' },
  ];
}

export default function Page() {
  return <AdminRequestDetailPageClient />;
}
