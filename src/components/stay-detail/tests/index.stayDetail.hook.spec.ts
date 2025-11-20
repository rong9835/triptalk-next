import { test, expect } from '@playwright/test';

test.describe('숙소 상세 페이지 - stay-detail', () => {
  // 실제 데이터를 사용하기 위한 숙소 ID
  const STAY_ID = '675bdd0d62c4b00029d36afe'; // 실제 존재하는 숙소 ID로 교체 필요

  test.beforeEach(async ({ page }) => {
    // 페이지 로드 전 로그인 처리 (필요한 경우)
    // localStorage에 토큰 설정
    await page.goto('http://localhost:3000');
  });

  test('숙소 상세 페이지 로드 확인', async ({ page }) => {
    // 1. 숙소 상세 페이지 접속
    await page.goto(`http://localhost:3000/stay/detail/${STAY_ID}`);

    // 2. 페이지 로드 확인 - data-testid로 식별
    await expect(page.getByTestId('stay-detail-container')).toBeVisible();

    // 3. 헤더 섹션 확인
    await expect(page.getByTestId('stay-header')).toBeVisible();
    await expect(page.getByTestId('stay-title')).toBeVisible();
  });

  test('숙소 상세 정보 표시 확인', async ({ page }) => {
    await page.goto(`http://localhost:3000/stay/detail/${STAY_ID}`);
    await expect(page.getByTestId('stay-detail-container')).toBeVisible();

    // 숙소 이름 표시
    const title = page.getByTestId('stay-title');
    await expect(title).toBeVisible();
    const titleText = await title.textContent();
    expect(titleText).not.toBe('');
    expect(titleText).not.toBe('숙박권 명');

    // 가격 표시
    const price = page.getByTestId('stay-price');
    await expect(price).toBeVisible();
    const priceText = await price.textContent();
    expect(priceText).not.toBe('0');

    // 설명 표시
    const remarks = page.getByTestId('stay-remarks');
    await expect(remarks).toBeVisible();

    // 태그 표시
    const tags = page.getByTestId('stay-tags');
    await expect(tags).toBeVisible();

    // 상세 설명 표시
    const contents = page.getByTestId('stay-contents');
    await expect(contents).toBeVisible();

    // 판매자 정보 표시
    const sellerName = page.getByTestId('seller-name');
    await expect(sellerName).toBeVisible();
  });

  test('이미지 슬라이더 동작 테스트', async ({ page }) => {
    await page.goto(`http://localhost:3000/stay/detail/${STAY_ID}`);
    await expect(page.getByTestId('stay-detail-container')).toBeVisible();

    // 이미지 슬라이더 섹션 확인
    const slider = page.getByTestId('image-slider');
    await expect(slider).toBeVisible();

    // 메인 이미지 확인
    const mainImage = page.getByTestId('main-image');
    await expect(mainImage).toBeVisible();

    // 이미지 카운터 확인 (이미지가 여러 개인 경우)
    const imageCounter = page.getByTestId('image-counter');
    if (await imageCounter.isVisible()) {
      const counterText = await imageCounter.textContent();
      expect(counterText).toMatch(/\d+\/\d+/);

      // 다음 버튼 클릭
      const nextButton = page.getByTestId('next-image-button');
      await nextButton.click();

      // 카운터 변경 확인
      const newCounterText = await imageCounter.textContent();
      expect(newCounterText).not.toBe(counterText);

      // 이전 버튼 클릭
      const prevButton = page.getByTestId('prev-image-button');
      await prevButton.click();

      // 카운터가 다시 변경되었는지 확인
      const finalCounterText = await imageCounter.textContent();
      expect(finalCounterText).toBe(counterText);
    }
  });

  test('썸네일 클릭으로 이미지 변경 테스트', async ({ page }) => {
    await page.goto(`http://localhost:3000/stay/detail/${STAY_ID}`);
    await expect(page.getByTestId('stay-detail-container')).toBeVisible();

    // 썸네일 확인
    const thumbnail = page.getByTestId('thumbnail-1');
    if (await thumbnail.isVisible()) {
      // 초기 카운터 확인
      const imageCounter = page.getByTestId('image-counter');
      const initialCounter = await imageCounter.textContent();

      // 썸네일 클릭
      await thumbnail.click();

      // 카운터 변경 확인
      const newCounter = await imageCounter.textContent();
      expect(newCounter).toBe('2/' + initialCounter?.split('/')[1]);
    }
  });

  test('찜하기 버튼 클릭 테스트 - 로그인 필요', async ({ page }) => {
    await page.goto(`http://localhost:3000/stay/detail/${STAY_ID}`);
    await expect(page.getByTestId('stay-detail-container')).toBeVisible();

    // 찜하기 버튼 확인
    const pickButton = page.getByTestId('pick-button');
    await expect(pickButton).toBeVisible();

    // 찜 개수 확인
    const pickCount = page.getByTestId('pick-count');
    await expect(pickCount).toBeVisible();

    // 로그인 상태가 아닌 경우 alert 확인
    page.on('dialog', async (dialog) => {
      expect(dialog.message()).toContain('로그인');
      await dialog.accept();
    });

    // 찜하기 버튼 클릭
    await pickButton.click();

    // 로그인 페이지로 리다이렉트 확인 (로그인하지 않은 경우)
    // 또는 찜 개수 변경 확인 (로그인한 경우)
  });

  test('구매하기 버튼 표시 확인', async ({ page }) => {
    await page.goto(`http://localhost:3000/stay/detail/${STAY_ID}`);
    await expect(page.getByTestId('stay-detail-container')).toBeVisible();

    // 구매하기 버튼 확인
    const purchaseButton = page.getByTestId('purchase-button');
    await expect(purchaseButton).toBeVisible();

    // 버튼 텍스트 확인 (판매완료 또는 구매하기)
    const buttonText = await purchaseButton.textContent();
    expect(buttonText === '구매하기' || buttonText === '판매완료').toBe(true);

    // 판매완료된 상품인 경우 버튼 비활성화 확인
    if (buttonText === '판매완료') {
      await expect(purchaseButton).toBeDisabled();
    }
  });

  test('주소 정보 표시 확인', async ({ page }) => {
    await page.goto(`http://localhost:3000/stay/detail/${STAY_ID}`);
    await expect(page.getByTestId('stay-detail-container')).toBeVisible();

    // 지도 컨테이너 확인
    const mapContainer = page.getByTestId('map-container');
    await expect(mapContainer).toBeVisible();

    // 주소 정보 확인
    const addressInfo = page.getByTestId('address-info');
    if (await addressInfo.isVisible()) {
      const addressText = await addressInfo.textContent();
      expect(addressText).toContain('우편번호');
      expect(addressText).toContain('주소');
    }
  });

  test('로그인 후 찜하기 기능 테스트', async ({ page }) => {
    // 로그인 처리
    await page.goto('http://localhost:3000/boards/login');

    // 실제 로그인 진행
    const emailInput = page.locator('input[type="text"]');
    const passwordInput = page.locator('input[type="password"]');
    const loginButton = page.locator('button:has-text("로그인")');

    // 실제 계정 정보 사용 (환경변수로 관리 권장)
    await emailInput.fill('test@test.com'); // 테스트 계정으로 교체
    await passwordInput.fill('test1234'); // 테스트 비밀번호로 교체
    await loginButton.click();

    // 로그인 성공 후 숙소 상세 페이지로 이동
    await page.goto(`http://localhost:3000/stay/detail/${STAY_ID}`);
    await expect(page.getByTestId('stay-detail-container')).toBeVisible();

    // 찜하기 버튼 클릭
    const pickButton = page.getByTestId('pick-button');
    const pickCount = page.getByTestId('pick-count');
    const initialCount = await pickCount.textContent();

    await pickButton.click();

    // 잠시 대기 (API 응답 대기)
    await page.waitForTimeout(500);

    // 찜 개수 변경 확인
    const newCount = await pickCount.textContent();
    expect(newCount).not.toBe(initialCount);
  });
});
