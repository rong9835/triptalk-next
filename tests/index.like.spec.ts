import { test, expect } from '@playwright/test';

test.describe('좋아요/싫어요 기능 테스트', () => {
  const TEST_BOARD_ID = '6793a95cee29f800296c2e76';

  test('좋아요 버튼 클릭 시 좋아요 추가/취소 토글', async ({ page }) => {
    // 1. 게시글 상세 페이지 접속
    await page.goto(`/boards/detail/${TEST_BOARD_ID}`);

    // 2. 페이지 로드 확인
    await expect(page.locator('h1')).toBeVisible({ timeout: 5000 });

    // 3. 좋아요 버튼 확인
    const likeButton = page.getByTestId('like-button');
    await expect(likeButton).toBeVisible({ timeout: 500 });

    // 4. 초기 좋아요 개수 확인
    const initialCount = await page.getByTestId('like-count').textContent();
    const initialCountNum = parseInt(initialCount || '0');

    // 5. 좋아요 버튼 클릭 - 좋아요 추가
    await likeButton.click();

    // 6. 좋아요 개수 증가 확인
    await expect(page.getByTestId('like-count')).toHaveText(
      String(initialCountNum + 1),
      { timeout: 1000 }
    );

    // 7. 좋아요 버튼 재클릭 - 좋아요 취소
    await likeButton.click();

    // 8. 좋아요 개수 감소 확인
    await expect(page.getByTestId('like-count')).toHaveText(
      String(initialCountNum),
      { timeout: 1000 }
    );
  });

  test('싫어요 버튼 클릭 시 싫어요 추가/취소 토글', async ({ page }) => {
    await page.goto(`/boards/detail/${TEST_BOARD_ID}`);

    await expect(page.locator('h1')).toBeVisible({ timeout: 5000 });

    const dislikeButton = page.getByTestId('dislike-button');
    const dislikeCount = page.getByTestId('dislike-count');

    const initialCount = await dislikeCount.textContent();
    const initialCountNum = parseInt(initialCount || '0');

    // 싫어요 추가
    await dislikeButton.click();
    await expect(dislikeCount).toHaveText(String(initialCountNum + 1), {
      timeout: 1000,
    });

    // 싫어요 취소
    await dislikeButton.click();
    await expect(dislikeCount).toHaveText(String(initialCountNum), {
      timeout: 1000,
    });
  });

  test('좋아요 클릭 시 싫어요 자동 해제 (상호 배타적)', async ({ page }) => {
    await page.goto(`/boards/detail/${TEST_BOARD_ID}`);

    await expect(page.locator('h1')).toBeVisible({ timeout: 5000 });

    const likeButton = page.getByTestId('like-button');
    const dislikeButton = page.getByTestId('dislike-button');
    const likeCount = page.getByTestId('like-count');
    const dislikeCount = page.getByTestId('dislike-count');

    const initialLikeCount = parseInt((await likeCount.textContent()) || '0');
    const initialDislikeCount = parseInt(
      (await dislikeCount.textContent()) || '0'
    );

    // 싫어요 먼저 클릭
    await dislikeButton.click();
    await expect(dislikeCount).toHaveText(String(initialDislikeCount + 1), {
      timeout: 1000,
    });

    // 좋아요 클릭 - 싫어요 자동 해제되어야 함
    await likeButton.click();
    await expect(likeCount).toHaveText(String(initialLikeCount + 1), {
      timeout: 1000,
    });
    await expect(dislikeCount).toHaveText(String(initialDislikeCount), {
      timeout: 1000,
    });
  });

  test('싫어요 클릭 시 좋아요 자동 해제 (상호 배타적)', async ({ page }) => {
    await page.goto(`/boards/detail/${TEST_BOARD_ID}`);

    await expect(page.locator('h1')).toBeVisible({ timeout: 5000 });

    const likeButton = page.getByTestId('like-button');
    const dislikeButton = page.getByTestId('dislike-button');
    const likeCount = page.getByTestId('like-count');
    const dislikeCount = page.getByTestId('dislike-count');

    const initialLikeCount = parseInt((await likeCount.textContent()) || '0');
    const initialDislikeCount = parseInt(
      (await dislikeCount.textContent()) || '0'
    );

    // 좋아요 먼저 클릭
    await likeButton.click();
    await expect(likeCount).toHaveText(String(initialLikeCount + 1), {
      timeout: 1000,
    });

    // 싫어요 클릭 - 좋아요 자동 해제되어야 함
    await dislikeButton.click();
    await expect(dislikeCount).toHaveText(String(initialDislikeCount + 1), {
      timeout: 1000,
    });
    await expect(likeCount).toHaveText(String(initialLikeCount), {
      timeout: 1000,
    });
  });
});
