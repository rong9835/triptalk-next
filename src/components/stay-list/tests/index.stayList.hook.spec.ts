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

    // 3. 숙소 카드가 표시되는지 확인
    const stayCards = page.getByTestId('stay-card');
    await expect(stayCards.first()).toBeVisible({ timeout: 500 });
  });

  test('숙소 리스트가 올바르게 표시된다', async ({ page }) => {
    // 1. 페이지 접속
    await page.goto('/stay/list');

    // 2. 페이지 로드 확인
    await expect(page.getByTestId('stay-list-container')).toBeVisible({
      timeout: 500,
    });

    // 3. 숙소 카드 개수 확인 (최소 1개 이상)
    const stayCards = page.getByTestId('stay-card');
    const count = await stayCards.count();
    expect(count).toBeGreaterThan(0);
  });
});
