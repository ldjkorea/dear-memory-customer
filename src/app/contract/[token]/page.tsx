import React from 'react';
import ContractTokenClient from './ContractTokenClient';

export async function generateStaticParams() {
  return [
    { token: 'demo-token' },
    { token: 'preview' },
    { token: 'default' },
  ];
}

export default function CustomerContractPage() {
  return <ContractTokenClient />;
}
