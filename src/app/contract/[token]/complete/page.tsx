import React from 'react';
import ContractCompleteClient from './ContractCompleteClient';

export async function generateStaticParams() {
  return [
    { token: 'demo-token' },
    { token: 'mock_token_abc' },
    { token: 'cnt_mock_001' },
    { token: 'preview' },
    { token: 'default' },
  ];
}

export default function ContractCompletePage() {
  return <ContractCompleteClient />;
}
