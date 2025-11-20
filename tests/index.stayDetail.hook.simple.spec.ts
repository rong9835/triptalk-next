import { test, expect } from '@playwright/test';

test.describe('숙소 상세 페이지 - 기본 기능', () => {
  // 실제 존재하는 숙소 ID 사용 (숙소 리스트에서 확인 필요)
  const STAY_ID = '67582c84f648d0002990c0ee';

  test('숙소 상세 페이지 로드 및 기본 정보 표시', async ({ page }) => {
    // 숙소 상세 페이지 접속
    await page.goto(`/stay/detail/${STAY_ID}`);

    // 페이지 컨테이너가 로드될 때까지 대기
    const container = page.getByTestId('stay-detail-container');
    await expect(container).toBeVisible({ timeout: 15000 });

    // 헤더 정보 확인
    const header = page.getByTestId('stay-header');
    await expect(header).toBeVisible();

    // 제목 확인
    const title = page.getByTestId('stay-title');
    await expect(title).toBeVisible();

    // 가격 정보 확인
    const price = page.getByTestId('stay-price');
    await expect(price).toBeVisible();

    // 찜하기 버튼 확인
    const pickButton = page.getByTestId('pick-button');
    await expect(pickButton).toBeVisible();

    // 구매하기 버튼 확인
    const purchaseButton = page.getByTestId('purchase-button');
    await expect(purchaseButton).toBeVisible();
  });

  test('이미지 슬라이더 기본 표시', async ({ page }) => {
    await page.goto(`/stay/detail/${STAY_ID}`);

    // 페이지 로드 대기
    await expect(page.getByTestId('stay-detail-container')).toBeVisible({
      timeout: 15000,
    });

    // 이미지 슬라이더 확인
    const slider = page.getByTestId('image-slider');
    await expect(slider).toBeVisible();

    // 메인 이미지 확인
    const mainImage = page.getByTestId('main-image');
    await expect(mainImage).toBeVisible();
  });

  test('판매자 정보 표시', async ({ page }) => {
    await page.goto(`/stay/detail/${STAY_ID}`);

    await expect(page.getByTestId('stay-detail-container')).toBeVisible({
      timeout: 15000,
    });

    // 판매자 이름 확인
    const sellerName = page.getByTestId('seller-name');
    await expect(sellerName).toBeVisible();
  });

  test('상세 설명 및 지도 섹션 표시', async ({ page }) => {
    await page.goto(`/stay/detail/${STAY_ID}`);

    await expect(page.getByTestId('stay-detail-container')).toBeVisible({
      timeout: 15000,
    });

    // 상세 설명 확인
    const contents = page.getByTestId('stay-contents');
    await expect(contents).toBeVisible();

    // 지도 컨테이너 확인
    const mapContainer = page.getByTestId('map-container');
    await expect(mapContainer).toBeVisible();
  });
});
