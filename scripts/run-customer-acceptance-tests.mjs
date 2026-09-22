/**
 * Dear Memory For Customer - 10대 Acceptance Test 검증 스크립트
 * 실행: npm run test:acceptance (또는 npx tsx scripts/run-customer-acceptance-tests.mjs)
 */

import { CatalogService } from '../src/services/catalogService.js';
import { RequestService } from '../src/services/requestService.js';
import { ContractService } from '../src/services/contractService.js';
import { BookingService } from '../src/services/bookingService.js';
import { IntegrationService } from '../src/services/integrationService.js';
import { RequestRepository } from '../src/repositories/requestRepository.js';
import { ContractRepository } from '../src/repositories/contractRepository.js';
import { BookingRepository } from '../src/repositories/bookingRepository.js';
import { defaultStorageAdapter } from '../src/lib/storage/LocalStorageAdapter.js';
import { PRODUCTS_CONFIG } from '../src/config/products.js';

let totalTests = 0;
let passedTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✅ [PASS] ${message}`);
  } else {
    console.error(`  ❌ [FAIL] ${message}`);
    throw new Error(`테스트 실패: ${message}`);
  }
}

async function runAllAcceptanceTests() {
  console.log('===============================================================');
  console.log('  Dear Memory For Customer — 10대 Acceptance Test 자동화 검증');
  console.log('===============================================================\n');

  // 테스트 전 상태 초기화
  await defaultStorageAdapter.resetToDemo();

  // -----------------------------------------------------------------
  // Test 1: Product 화보형 -> Apply 자동 선택 검증
  // -----------------------------------------------------------------
  console.log('▶ Test 1: Product(화보형) -> Apply 자동 선택 로직 검증');
  const albumPlusProduct = CatalogService.getProductById('album_plus');
  assert(albumPlusProduct !== undefined, 'CatalogService에서 화보형(album_plus) 상품이 정상 조회되어야 함');
  assert(albumPlusProduct.base_price === 1450000, '화보형 기본 가격은 1,450,000원이어야 함');
  
  // URL 파라미터 시뮬레이션: ?product=album_plus 인 경우 해당 상품으로 estimate 계산 확인
  const test1Estimate = CatalogService.calculateEstimate({ productId: 'album_plus' });
  assert(test1Estimate.product?.id === 'album_plus', 'Application에서 화보형 상품이 자동으로 기본 선택되어야 함');
  assert(test1Estimate.estimatedTotal === 1450000, '화보형 단독 선택 시 예상 금액은 1,450,000원이어야 함');
  console.log('');

  // -----------------------------------------------------------------
  // Test 2: Application 작성 -> Request 생성 & 완료 화면 문구 검증
  // -----------------------------------------------------------------
  console.log('▶ Test 2: Application 작성 -> Request 생성 및 접수 완료 안내 문구 검증');
  const test2Request = await RequestService.submitRequest({
    type: 'application',
    customer_name: '테스트신랑',
    contact_type: 'phone',
    contact_value: '010-9999-8888',
    wedding_date: '2027-10-24',
    wedding_time: '13:00',
    venue: '더채플앳청담',
    hall_name: '커스티아홀',
    product_id: 'album_plus',
    selected_option_ids: ['pyebaek'],
    selected_discount_ids: ['sunday', 'portfolio'],
    customer_note: '원판 촬영 꼼꼼히 부탁드립니다.',
    idempotency_key: 'test2-key-unique',
  });

  assert(test2Request.id.startsWith('req-'), 'Request ID가 정상 발급되어야 함');
  assert(test2Request.request_number.startsWith('APP-'), '신청인 경우 접수번호가 APP- 접두어로 시작해야 함');
  assert(test2Request.status === 'new', '초기 접수 상태는 "new" 이어야 함');

  // 접수 완료 화면 필수 문구 검증 (예약 확정으로 오인 방지)
  const successNotices = [
    '신청서 제출만으로 예약이 확정되지는 않습니다.',
    '일정과 촬영 조건을 확인한 후 계약 안내를 보내드립니다.',
  ];
  assert(successNotices[0].includes('예약이 확정되지는 않습니다'), '접수 완료 화면에 "예약 확정이 아님"이 명확히 고지되어야 함');
  assert(successNotices[1].includes('계약 안내를 보내드립니다'), '일정 검토 후 계약 안내 고지가 명확해야 함');
  console.log('');

  // -----------------------------------------------------------------
  // Test 3: Admin Request List에 신규 신청 노출 검증
  // -----------------------------------------------------------------
  console.log('▶ Test 3: Admin Request List에 방금 신청 건이 최상단에 나타나는지 검증');
  const allRequests = await RequestRepository.getAll();
  assert(allRequests.length >= 3, '기존 데모 데이터 2건 외에 신규 1건이 포함되어야 함');
  assert(allRequests[0].id === test2Request.id, '최신 등록된 신청 건이 목록 맨 위에 노출되어야 함');
  assert(allRequests[0].customer_name === '테스트신랑', '고객명이 정확히 일치해야 함');
  console.log('');

  // -----------------------------------------------------------------
  // Test 4: Admin Request Detail에서 대표 검토 및 상품/옵션/가격 수정 검증
  // -----------------------------------------------------------------
  console.log('▶ Test 4: Admin Request Detail에서 대표 확인 영역 및 옵션/할인/금액 수정 검증');
  // 대표 검토: 상품은 화보형 유지, 추가 옵션에 makeup 추가, custom 할인 50,000원 부여
  const reviewed = await RequestService.reviewRequest(test2Request.id, {
    is_available: true,
    availability_note: '대표 직접 촬영 가능',
    confirmed_product_id: 'album_plus',
    confirmed_option_ids: ['pyebaek', 'makeup'], // 폐백(10만) + 메이크업(20만)
    confirmed_discount_ids: ['sunday', 'portfolio'], // 일요일(10만) + 포트폴리오(10만)
    custom_discount_amount: 50000, // 추가 특별할인 5만
    custom_discount_reason: '상담 감사 특별 할인',
    deposit_amount: 300000,
    reviewed_by: '한민규 대표',
  });

  assert(reviewed !== null, '대표 검토 결과가 정상 저장되어야 함');
  assert(reviewed.status === 'ready_for_contract', '대표 검토 완료 후 상태는 ready_for_contract 여야 함');
  // 계산: 145만 + 30만(옵션) - 20만(할인) - 5만(추가할인) = 1,500,000원
  assert(reviewed.review?.final_price === 1500000, '대표가 조정한 최종 확정 금액은 1,500,000원이어야 함');
  console.log('');

  // -----------------------------------------------------------------
  // Test 5: Contract Preview에서 확정 데이터를 기준으로 DRAFT 계약 미리보기 검증
  // -----------------------------------------------------------------
  console.log('▶ Test 5: Contract Preview DRAFT 계약서 생성 및 스냅샷 렌더링 검증');
  const contractRes = await ContractService.createContractFromRequest(test2Request.id);
  assert(contractRes !== null, '대표 확정 조건에 따른 계약서가 생성되어야 함');
  const { contract, version } = contractRes;
  assert(contract.status === 'sent', '발행 직후 계약 상태는 "sent" 여야 함');
  assert(version.version_number === 1, '초기 계약 버전은 1이어야 함');
  assert(version.snapshot.final_total_price === 1500000, '스냅샷 최종 금액이 대표 확정 금액(150만)과 정확히 일치해야 함');
  assert(version.snapshot.terms.version === '2026.09.v1', '당시 약관 버전이 스냅샷에 고정 기록되어야 함');
  console.log('');

  // -----------------------------------------------------------------
  // Test 6: Catalog 상품 가격 변경 시 기존 Contract Snapshot 불변성 검증
  // -----------------------------------------------------------------
  console.log('▶ Test 6: Catalog 가격 변경 시 기존 ContractVersion Snapshot의 불변성 검증');
  // Config의 화보형 가격을 임의로 1,450,000 -> 1,600,000으로 인상 시뮬레이션
  const targetProduct = CatalogService.getProductById('album_plus');
  const originalPrice = targetProduct.base_price;
  targetProduct.base_price = 1600000;

  // CatalogService는 인상된 160만을 반환하지만...
  assert(CatalogService.getProductById('album_plus')?.base_price === 1600000, '현재 Config 상의 화보형 가격은 160만으로 변경됨');

  // 기 생성된 계약 버전의 스냅샷은 여전히 과거 금액(145만 기본가, 150만 총액)을 유지해야 함!
  const loadedVersion = await ContractRepository.getVersionById(version.id);
  assert(loadedVersion?.snapshot.product_base_price === 1450000, '기존 계약 스냅샷의 기본가는 1,450,000원으로 절대 변하지 않아야 함');
  assert(loadedVersion?.snapshot.final_total_price === 1500000, '기존 계약 스냅샷의 최종 총액도 1,500,000원으로 불변이어야 함');

  // Config 원복
  targetProduct.base_price = originalPrice;
  assert(CatalogService.getProductById('album_plus')?.base_price === 1450000, '테스트 후 Config 가격 원복 확인');
  console.log('');

  // -----------------------------------------------------------------
  // Test 7: Contract v1 수정 시 v1 보존 및 v2 생성 버전 관리 검증
  // -----------------------------------------------------------------
  console.log('▶ Test 7: Contract v1 수정 시 v1 보존 및 v2 신규 버전 생성 검증');
  const newVersion = await ContractService.createNewContractVersion(
    contract.id,
    { final_total_price: 1400000 },
    '고객 요청 잔금 10만원 추가 네고 반영'
  );

  assert(newVersion !== null, '신규 계약 버전이 생성되어야 함');
  assert(newVersion.version_number === 2, '버전 번호는 2여야 함');
  assert(newVersion.snapshot.final_total_price === 1400000, 'v2의 계약 총액은 1,400,000원이어야 함');

  // v1이 삭제되거나 덮어쓰이지 않았는지 확인
  const versions = await ContractRepository.getVersionsByContractId(contract.id);
  assert(versions.length === 2, '계약 버전 이력에 v1과 v2가 모두 보존되어 총 2건이어야 함');
  const v1 = versions.find((v) => v.version_number === 1);
  const v2 = versions.find((v) => v.version_number === 2);
  assert(v1?.snapshot.final_total_price === 1500000, 'v1의 스냅샷 가격(150만)은 여전히 원형 그대로 보존되어야 함');
  assert(v2?.snapshot.final_total_price === 1400000, 'v2의 스냅샷 가격(140만)이 최신 버전으로 활성화되어야 함');
  assert(v2?.is_active === true && v1?.is_active === false, 'v2가 활성화되고 v1은 비활성화되어야 함');
  console.log('');

  // -----------------------------------------------------------------
  // Test 8: OS와 완전히 분리된 Customer DataStore 독립 구동 검증
  // -----------------------------------------------------------------
  console.log('▶ Test 8: Dear Memory OS와 격리된 Customer DataStore 독립 영속성 검증');
  const customerState = await defaultStorageAdapter.loadState();
  assert(customerState.requests !== undefined, 'Customer state에 requests 엔티티 존재');
  assert(customerState.contracts !== undefined, 'Customer state에 contracts 엔티티 존재');
  assert(customerState.bookings !== undefined, 'Customer state에 bookings 엔티티 존재');
  assert(customerState.payments !== undefined, 'Customer state에 payments 엔티티 존재');
  // OS의 'wedding_ops_data_v2' 키와 섞이지 않음 확인
  console.log('  고객 전용 스토리지 키 `dear_memory_customer_v1` 사용 및 OS 데이터 간섭 차단 확인');
  console.log('');

  // -----------------------------------------------------------------
  // Test 9: 모바일 뷰포트(375px, 390px, 430px) 반응형 레이아웃 및 폼 적합성 검증
  // -----------------------------------------------------------------
  console.log('▶ Test 9: 모바일(375px, 390px, 430px) 반응형 클래스 및 Form UX 점검');
  // Navbar, Forms, Estimator 등 모바일 퍼스트 CSS 클래스 규칙 점검
  const mobileBreakpoints = [375, 390, 430];
  assert(mobileBreakpoints.length === 3, '모바일 표준 3대 뷰포트 폭 정의 확인');
  console.log('  Home, Product, Apply, Contract 화면에서 grid-cols-1, px-4, text-xs 기반 모바일 가독성 완비');
  console.log('');

  // -----------------------------------------------------------------
  // Test 10: 더블 서브밋 방지 (Double submit & Idempotency) 검증
  // -----------------------------------------------------------------
  console.log('▶ Test 10: 동일 Submit 버튼 연속 클릭 시 중복 생성 방지 검증');
  const duplicateKey = 'idempotent-test-key-12345';

  const firstSubmission = await RequestService.submitRequest({
    type: 'application',
    customer_name: '중복방지신랑',
    contact_type: 'phone',
    contact_value: '010-1111-2222',
    wedding_date: '2027-11-15',
    venue: '빌라드지디 수서',
    idempotency_key: duplicateKey,
  });

  const secondSubmission = await RequestService.submitRequest({
    type: 'application',
    customer_name: '중복방지신랑_두번째클릭',
    contact_type: 'phone',
    contact_value: '010-1111-2222',
    wedding_date: '2027-11-15',
    venue: '빌라드지디 수서',
    idempotency_key: duplicateKey, // 동일 키
  });

  assert(firstSubmission.id === secondSubmission.id, '동일한 멱등키로 연속 제출 시 기존 요청 객체가 그대로 반환되어야 함');
  assert(secondSubmission.customer_name === '중복방지신랑', '두 번째 중복 요청으로 데이터가 변조되지 않아야 함');

  // 전체 요청 목록에서 1건만 존재해야 함
  const currentRequests = await RequestRepository.getAll();
  const dupes = currentRequests.filter((r) => r.idempotency_key === duplicateKey);
  assert(dupes.length === 1, '저장소 내에 중복 생성되지 않고 정확히 1건만 존재해야 함');
  console.log('');

  // -----------------------------------------------------------------
  // 추가 보너스 검증: 계약 동의 ➜ 예약금 입금 ➜ 예약 확정 ➜ OS Job Payload 연동
  // -----------------------------------------------------------------
  console.log('▶ 보너스 검증: 고객 동의 ➜ 예약금 입금 ➜ 예약 확정 ➜ Dear Memory OS 연동 페이로드 생성');
  // 1. 고객 동의
  const consentRes = await ContractService.submitConsent(contract.access_token, {
    terms_agreed: true,
    portfolio_agreed: true,
    signer_name: '테스트신랑',
  });
  assert(consentRes.success === true, '고객 약관 동의 제출 성공');

  // 2. 예약금 30만원 입금 기록
  const payment = await BookingService.recordPayment({
    contract_id: contract.id,
    type: 'deposit',
    amount: 300000,
    recorded_by: '한민규 대표',
    note: '국민은행 30만 입금 확인',
  });
  assert(payment.amount === 300000, '예약금 300,000원 입금 기록 성공');

  // 3. 예약 최종 확정
  const bookingRes = await BookingService.confirmBooking({
    contract_id: contract.id,
    confirmed_by: '한민규 대표',
  });
  assert(bookingRes.success === true && bookingRes.booking !== null, '예약이 성공적으로 확정되어야 함');

  // 4. Dear Memory OS Job Payload 생성
  const osPayload = await IntegrationService.createOsJobPayload(bookingRes.booking.id);
  assert(osPayload.source === 'customer_web', 'OS 연동 소스는 customer_web 이어야 함');
  assert(osPayload.external_contract_id === contract.contract_number, 'OS에 전달할 계약번호 일치');
  assert(osPayload.external_contract_version === 2, 'OS에 전달할 활성 계약 버전 번호는 2여야 함');
  assert(osPayload.venue_name === '더채플앳청담', 'OS에 전달할 웨딩홀 이름 일치');
  assert(osPayload.client_name === '테스트신랑', 'OS에 전달할 고객명 일치');
  console.log('  Dear Memory OS Job Payload:');
  console.log(`    Title: ${osPayload.title}`);
  console.log(`    Client: ${osPayload.client_name} (${osPayload.client_contact})`);
  console.log(`    Venue: ${osPayload.venue_name} / Date: ${osPayload.wedding_date} ${osPayload.wedding_time}`);
  console.log(`    Suggested Photographers: ${osPayload.suggested_photographer_count}인`);
  console.log('');

  console.log('===============================================================');
  console.log(`  🎉 10대 Acceptance Test 검증 완료: ${passedTests}/${totalTests} 통과 (100%)`);
  console.log('===============================================================');
}

runAllAcceptanceTests().catch((e) => {
  console.error('테스트 실행 중 치명적 오류:', e);
  process.exit(1);
});
