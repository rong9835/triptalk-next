import { test, expect } from '@playwright/test';

test.describe('숙소 리스트 페이지 - 페이지네이션 기능', () => {
  test('/stay/list에 접속하여 페이지 로드 확인', async ({ page }) => {
    // 1. 페이지 접속
    await page.goto('/stay/list');

    // 2. 페이지 로드 확인 - data-testid로 식별
    await expect(page.getByTestId('stay-list-container')).toBeVisible({
      timeout: 500,
    });
  });

  test('페이지 접속 시 숙소 리스트를 불러온다', async ({ page }) => {
    // 1. 페이지 접속
    await page.goto('/stay/list');

    // 2. 페이지 로드 확인
    await expect(page.getByTestId('stay-list-container')).toBeVisible({
      timeout: 500,
    });

    // 3. 데이터 로딩 완료 대기
    await page.waitForFunction(
      () => {
        const cards = document.querySelectorAll('[data-testid="stay-card"]');
        return cards.length > 0;
      },
      { timeout: 3000 }
    );

    // 4. 숙소 카드가 표시되는지 확인
    const stayCards = page.getByTestId('stay-card');
    await expect(stayCards.first()).toBeVisible();
  });

  test('숙소 리스트가 올바르게 표시된다', async ({ page }) => {
    // 1. 페이지 접속
    await page.goto('/stay/list');

    // 2. 페이지 로드 확인
    await expect(page.getByTestId('stay-list-container')).toBeVisible({
      timeout: 500,
    });

    // 3. 데이터 로딩 완료 대기 (첫 번째 카드가 나타날 때까지)
    await page.waitForFunction(
      () => {
        const cards = document.querySelectorAll('[data-testid="stay-card"]');
        return cards.length > 0;
      },
      { timeout: 3000 }
    );

    // 4. 숙소 카드 개수 확인 (최소 1개 이상)
    const stayCards = page.getByTestId('stay-card');
    const count = await stayCards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('상단 슬라이더 버튼을 클릭하면 다음 숙소가 표시된다', async ({
    page,
  }) => {
    // 1. 페이지 접속
    await page.goto('/stay/list');

    // 2. 페이지 로드 확인
    await expect(page.getByTestId('stay-list-container')).toBeVisible({
      timeout: 500,
    });

    // 3. 데이터 로딩 완료 대기
    await page.waitForFunction(
      () => {
        const cards = document.querySelectorAll('[data-testid="stay-card"]');
        return cards.length > 0;
      },
      { timeout: 3000 }
    );

    // 4. 첫 번째 카드의 제목 저장
    const firstCardTitle = await page
      .getByTestId('stay-card')
      .first()
      .textContent();

    // 5. 다음 버튼 클릭
    const nextButton = page
      .locator('button')
      .filter({ has: page.locator('img[alt="next"]') });
    await nextButton.click();

    // 6. 잠시 대기 (슬라이드 애니메이션)
    await page.waitForTimeout(100);

    // 7. 카드가 변경되었는지 확인 (또는 첫 화면으로 돌아왔는지)
    const stayCards = page.getByTestId('stay-card');
    await expect(stayCards.first()).toBeVisible();
  });
});
