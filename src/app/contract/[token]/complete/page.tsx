import React from 'react';
import ContractCompleteClient from './ContractCompleteClient';

export async function generateStaticParams() {
  return [
    { token: 'demo-token' },
    { token: 'preview' },
    { token: 'default' },
  ];
}

export default function ContractCompletePage() {
  return <ContractCompleteClient />;
}
