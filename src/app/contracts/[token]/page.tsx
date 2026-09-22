import React from 'react';
import ContractTokenClient from '@/app/contract/[token]/ContractTokenClient';

export async function generateStaticParams() {
  return [
    { token: 'demo-token' },
    { token: 'mock_token_abc' },
    { token: 'cnt_mock_001' },
    { token: 'preview' },
    { token: 'default' },
  ];
}

export default function CustomerContractsAliasPage() {
  return <ContractTokenClient />;
}
