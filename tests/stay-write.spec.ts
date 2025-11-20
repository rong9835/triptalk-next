import { test, expect, Page } from '@playwright/test';

const waitForAddressSelection = async (page: Page, keyword: string) => {
  await page.getByTestId('address-search-button').click();

  const iframe = page.frameLocator('iframe').first();
  await expect(iframe.locator('input[type="text"]').first()).toBeVisible({
    timeout: 1500,
  });

  await iframe.locator('input[type="text"]').first().fill(keyword);
  await iframe
    .locator('button:has-text("검색"), input[type="button"][value*="검색"]')
    .first()
    .click();
  await iframe.locator('.searched_result').first().click({ timeout: 500 });
};

test.describe('숙박권 판매 페이지 - 주소 검색 기능', () => {
  test('필수 입력값이 비어 있을 때 에러 메시지가 노출된다', async ({ page }) => {
    await page.goto('/stay/new');

    await expect(
      page.getByTestId('stay-write-container')
    ).toBeVisible({ timeout: 500 });

    await page.getByTestId('submit-button').click();

    await expect(page.getByTestId('name-error')).toHaveText(
      '상품명은 최소 2자 이상 입력해주세요'
    );
    await expect(page.getByTestId('remarks-error')).toHaveText(
      '한줄 요약을 입력해주세요'
    );
    await expect(page.getByTestId('contents-error')).toHaveText(
      '상품 설명을 입력해주세요'
    );
    await expect(page.getByTestId('price-error')).toHaveText(
      '가격을 입력해주세요'
    );
    await expect(page.getByTestId('zipcode-error')).toHaveText(
      '우편번호를 입력해주세요'
    );
    await expect(page.getByTestId('address-error')).toHaveText(
      '주소를 입력해주세요'
    );
    await expect(page.getByTestId('lat-error')).toHaveText(
      '위도 정보가 필요합니다'
    );
    await expect(page.getByTestId('lng-error')).toHaveText(
      '경도 정보가 필요합니다'
    );
  });

  test('가격을 잘못 입력하면 즉시 에러 메시지가 표시된다', async ({ page }) => {
    await page.goto('/stay/new');

    await expect(
      page.getByTestId('stay-write-container')
    ).toBeVisible({ timeout: 500 });

    await page.getByTestId('price-input').fill('-1000');
    await page.getByTestId('price-input').blur();

    await expect(page.getByTestId('price-error')).toHaveText(
      '올바른 가격을 입력해주세요'
    );
  });

  test('페이지 로드 후 주소 검색 버튼 클릭 및 주소 입력 테스트', async ({
    page,
  }) => {
    // 1. 페이지 이동
    await page.goto('/stay/new');

    // 2. 페이지 로드 확인 - data-testid로 식별
    await expect(
      page.getByTestId('stay-write-container')
    ).toBeVisible({ timeout: 500 });

    // 3. 우편번호 검색 버튼 클릭
    await page.getByTestId('address-search-button').click();

    // 4. 다음 우편번호 iframe이 로드되었는지 확인
    const iframe = page.frameLocator('iframe').first();
    await expect(iframe.locator('input[type="text"]').first()).toBeVisible({
      timeout: 1500,
    });

    // 6. 주소 검색 (서울 강동구 고덕로 456)
    await iframe.locator('input[type="text"]').first().fill('고덕로 456');
    await iframe
      .locator('button:has-text("검색"), input[type="button"][value*="검색"]')
      .first()
      .click();

    // 7. 검색 결과 클릭
    await iframe.locator('.searched_result').first().click({ timeout: 500 });

    // 8. 주소가 인풋에 자동으로 입력되었는지 확인
    await expect(page.getByTestId('zipcode-input')).toHaveValue(/\d{5}/, {
      timeout: 500,
    });
    await expect(page.getByTestId('address-input')).not.toHaveValue('', {
      timeout: 500,
    });

    // 9. 위도/경도가 자동으로 추출되었는지 확인 (최대 2초 대기)
    await expect(page.getByTestId('lat-input')).not.toHaveValue('', {
      timeout: 2000,
    });
    await expect(page.getByTestId('lng-input')).not.toHaveValue('', {
      timeout: 2000,
    });

    // 10. 지도가 표시되었는지 확인
    await expect(page.getByTestId('map-container')).toBeVisible({
      timeout: 500,
    });
  });

  test('주소 검색 후 상세주소 입력 테스트', async ({ page }) => {
    // 1. 페이지 이동
    await page.goto('/stay/new');

    // 2. 페이지 로드 확인
    await expect(
      page.getByTestId('stay-write-container')
    ).toBeVisible({ timeout: 500 });

    // 3. 주소 검색
    await waitForAddressSelection(page, '강동구');

    // 5. 상세주소 입력
    await page
      .getByTestId('address-detail-input')
      .fill('101동 202호', { timeout: 500 });

    // 6. 상세주소가 입력되었는지 확인
    await expect(page.getByTestId('address-detail-input')).toHaveValue(
      '101동 202호',
      { timeout: 500 }
    );
  });

  test('필수 입력값 입력 시 등록하기 버튼 활성화', async ({ page }) => {
    await page.goto('/stay/new');

    await expect(
      page.getByTestId('stay-write-container')
    ).toBeVisible({ timeout: 500 });

    const submitButton = page.getByTestId('submit-button');
    await expect(submitButton).toBeDisabled();

    await page.getByTestId('name-input').fill('테스트 숙박권');
    await page.getByTestId('remarks-input').fill('테스트 한줄 요약');
    await page
      .getByTestId('contents-textarea')
      .fill('이 숙박권은 Playwright 테스트로 등록합니다.');
    await page.getByTestId('price-input').fill('50000');
    await page.getByTestId('tags-input').fill('테스트,숙박');

    await waitForAddressSelection(page, '고덕로 456');

    await expect(page.getByTestId('lat-input')).not.toHaveValue('', {
      timeout: 2000,
    });
    await expect(page.getByTestId('lng-input')).not.toHaveValue('', {
      timeout: 2000,
    });

    await expect(submitButton).toBeEnabled();
  });
});
