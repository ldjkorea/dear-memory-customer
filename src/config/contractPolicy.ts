/**
 * 계약 약관 및 운영 정책 중앙 설정
 * Dear Memory Config - Single Source of Truth
 */

export interface ContractPolicyConfig {
  version: string;
  default_deposit_amount: number;
  image_spec: string;
  raw_file_policy: string;
  delivery_timeline: string;
  backup_retention: string;
  sections: {
    id: string;
    title: string;
    content: string;
  }[];
}

export const CONTRACT_POLICY_CONFIG: ContractPolicyConfig = {
  version: '2026.09.v1',
  default_deposit_amount: 300000,
  image_spec: 'JPG 형식 (장축 3500px 이상 초고화질, 인화 및 대형 액자 출력 가능)',
  raw_file_policy: '원본 RAW 파일은 작업용 내부 데이터로 고객에게 별도 제공되지 않습니다.',
  delivery_timeline: '촬영일 기준 3주 이내 전체 원본 제공 / 셀렉 완료일 기준 90일 이내 최종 보정본 및 앨범 배송',
  backup_retention: '최종 납품일로부터 60일간 안전하게 보관되며, 이후 파일이 영구 삭제될 수 있으니 수령 즉시 개인 백업을 권장합니다.',
  sections: [
    {
      id: 'general',
      title: '제1조 (목적 및 효력)',
      content: '본 계약은 디어메모리(이하 "촬영자")와 의뢰인(이하 "고객") 간의 본식스냅 촬영 및 상품 납품에 대한 권리와 의무를 규정함을 목적으로 합니다. 고객이 온라인 계약서에 최종 동의하고 계약금을 입금함으로써 본 계약은 정식 효력을 발생합니다.'
    },
    {
      id: 'deposit_and_payment',
      title: '제2조 (계약금 및 잔금의 지급)',
      content: '1. 고객은 계약 체결 후 48시간 이내에 계약금 300,000원을 지정된 계좌로 입금하여야 예약이 최종 확정됩니다.\n2. 잔금은 본식 7일 전까지 전액 완납하는 것을 원칙으로 합니다.\n3. 본 계약 금액은 부가세(VAT) 포함 금액입니다.'
    },
    {
      id: 'scope_and_conduct',
      title: '제3조 (촬영 범위 및 진행)',
      content: '1. 촬영은 계약된 상품 및 옵션에 명시된 범위(예: 신부대기실 ~ 연회장)에 한하여 진행됩니다.\n2. 웨딩홀 측의 특수한 규정(예: 지정 원판 필수, 외부 촬영 동선 제약)으로 인한 불가피한 제약은 사전에 안내해 주셔야 하며, 촬영자의 귀책사유로 보지 않습니다.'
    },
    {
      id: 'delivery_and_revision',
      title: '제4조 (결과물 제공 및 수정)',
      content: '1. 촬영된 전체 원본은 촬영일로부터 3주 이내에 고화질 웹 갤러리 또는 다운로드 링크로 전달됩니다.\n2. 보정본은 고객의 최종 셀렉일로부터 약 90일 이내에 작업이 완료되어 앨범 제작 및 발송이 시작됩니다.\n3. 피부 톤 보정, 몸매 라인, 잡티 제거 등 자연스럽고 세련된 정밀 보정이 포함되며, 과도한 외형 왜곡이나 합성 작업은 제한될 수 있습니다.'
    },
    {
      id: 'cancellation_and_refund',
      title: '제5조 (예약 취소 및 환불 기준)',
      content: '공정거래위원회 소비자분쟁해결기준을 준수합니다.\n1. 계약 체결일로부터 14일 이내 취소 시: 계약금 전액 환불\n2. 계약 체결 14일 경과 후 ~ 촬영일 90일 전 취소 시: 계약금 환불 불가\n3. 촬영일 90일 이내 취소 시: 위약금 규정에 따라 총 상품금액의 30%~50%의 위약금이 발생할 수 있습니다.'
    },
    {
      id: 'loss_and_compensation',
      title: '제6조 (사고 및 손해배상)',
      content: '촬영자의 고의 또는 중대한 과실, 또는 장비 결함 등으로 데이터가 멸실되어 납품이 불가능한 경우, 수령한 계약 총액을 전액 환불하며 상호 협의 하에 총액의 100% 범위 내에서 손해배상을 진행합니다.'
    },
    {
      id: 'portfolio_consent',
      title: '제7조 (저작권 및 포트폴리오 활용)',
      content: '1. 촬영된 모든 사진의 저작권은 "촬영자"에게 있으며, 저작인격권 및 초상권은 상호 존중됩니다.\n2. 고객이 포트폴리오 활용에 사전 동의하여 혜택을 적용받은 경우, 촬영물은 디어메모리 공식 웹사이트 및 SNS 포트폴리오로 품격 있게 소개될 수 있습니다.'
    }
  ]
};
