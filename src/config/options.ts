/**
 * 추가 옵션 중앙 설정
 * Dear Memory Config - Single Source of Truth
 */

import { OptionItem } from '@/types/catalog';

export const OPTIONS_CONFIG: OptionItem[] = [
  {
    id: 'makeup',
    name: '메이크업 촬영',
    price: 200000,
    description: '식전 메이크업 샵 마무리 및 아웃(OUT) 순간부터 동행하여 더욱 감각적인 시작을 담습니다.',
    active: true,
    display_order: 1,
    needs_confirmation: false,
  },
  {
    id: 'second_shooter',
    name: '2인 촬영 (서브 작가 추가)',
    price: 250000,
    description: '메인 작가와 함께 다른 앵글(신랑측 로비, 신부대기실 동시 커버, 하객 표정)을 풍성하게 기록합니다.',
    active: true,
    display_order: 2,
    needs_confirmation: true,
  },
  {
    id: 'pyebaek',
    name: '폐백 촬영',
    price: 100000,
    description: '연회장 인사 이후 진행되는 전통 폐백 예절 및 가족 기념사진을 정성껏 담아드립니다.',
    active: true,
    display_order: 3,
    needs_confirmation: false,
  },
];
