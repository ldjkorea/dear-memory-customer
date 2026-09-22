import React from 'react';
import AdminContractPreviewPageClient from './ContractPreviewClient';

export async function generateStaticParams() {
  return [
    { id: 'demo' },
    { id: 'preview' },
    { id: 'default' },
  ];
}

export default function Page() {
  return <AdminContractPreviewPageClient />;
}
