import { test, expect } from '@playwright/test';

test.describe('오늘 핫한 트립토크 - 인기 게시글 표시 기능', () => {
  test('컴포넌트가 정상적으로 로드된다', async ({ page }) => {
    // 1. 게시판 페이지 접속
    await page.goto('/boards');

    // 2. 컴포넌트 로드 확인 - data-testid로 식별
    await expect(page.getByTestId('hot-trip-talk-container')).toBeVisible({
      timeout: 500,
    });
  });

  test('제목이 올바르게 표시된다', async ({ page }) => {
    // 1. 게시판 페이지 접속
    await page.goto('/boards');

    // 2. 컴포넌트 로드 확인
    await expect(page.getByTestId('hot-trip-talk-container')).toBeVisible({
      timeout: 500,
    });

    // 3. 제목 확인
    await expect(page.getByText('오늘 핫한 트립토크')).toBeVisible({
      timeout: 500,
    });
  });

  test('인기 게시글 카드가 표시된다', async ({ page }) => {
    // 1. 게시판 페이지 접속
    await page.goto('/boards');

    // 2. 컴포넌트 로드 확인
    await expect(page.getByTestId('hot-trip-talk-container')).toBeVisible({
      timeout: 500,
    });

    // 3. 카드 컨테이너 확인
    await expect(page.getByTestId('card-container')).toBeVisible({
      timeout: 500,
    });

    // 4. 게시글 카드가 최소 1개 이상 있는지 확인
    const cards = page.locator('[data-testid^="post-card-"]');
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('게시글 카드에 필수 정보가 표시된다', async ({ page }) => {
    // 1. 게시판 페이지 접속
    await page.goto('/boards');

    // 2. 컴포넌트 로드 확인
    await expect(page.getByTestId('hot-trip-talk-container')).toBeVisible({
      timeout: 500,
    });

    // 3. 첫 번째 카드 찾기
    const firstCard = page.locator('[data-testid^="post-card-"]').first();
    await expect(firstCard).toBeVisible({ timeout: 500 });

    // 4. 첫 번째 카드의 ID 추출
    const cardTestId = await firstCard.getAttribute('data-testid');
    const boardId = cardTestId?.replace('post-card-', '');

    // 5. 카드 내부 요소 확인
    await expect(
      page.getByTestId(`card-title-${boardId}`)
    ).toBeVisible({ timeout: 500 });
    await expect(
      page.getByTestId(`card-writer-${boardId}`)
    ).toBeVisible({ timeout: 500 });
    await expect(
      page.getByTestId(`like-count-${boardId}`)
    ).toBeVisible({ timeout: 500 });
    await expect(
      page.getByTestId(`card-date-${boardId}`)
    ).toBeVisible({ timeout: 500 });
  });

  test('게시글 카드 클릭 시 상세 페이지로 이동한다', async ({ page }) => {
    // 1. 게시판 페이지 접속
    await page.goto('/boards');

    // 2. 컴포넌트 로드 확인
    await expect(page.getByTestId('hot-trip-talk-container')).toBeVisible({
      timeout: 500,
    });

    // 3. 첫 번째 카드 찾기
    const firstCard = page.locator('[data-testid^="post-card-"]').first();
    await expect(firstCard).toBeVisible({ timeout: 500 });

    // 4. 카드의 ID 추출
    const cardTestId = await firstCard.getAttribute('data-testid');
    const boardId = cardTestId?.replace('post-card-', '');

    // 5. 카드 클릭
    await firstCard.click();

    // 6. URL이 상세 페이지로 변경되었는지 확인
    await page.waitForURL(`**/boards/detail/${boardId}`);
    expect(page.url()).toContain(`/boards/detail/${boardId}`);
  });

  test('최대 6개의 게시글 카드가 표시된다', async ({ page }) => {
    // 1. 게시판 페이지 접속
    await page.goto('/boards');

    // 2. 컴포넌트 로드 확인
    await expect(page.getByTestId('hot-trip-talk-container')).toBeVisible({
      timeout: 500,
    });

    // 3. 카드 개수 확인 (최대 6개)
    const cards = page.locator('[data-testid^="post-card-"]');
    const count = await cards.count();
    expect(count).toBeLessThanOrEqual(6);
  });

  test('게시글 카드에 좋아요 수가 표시된다', async ({ page }) => {
    // 1. 게시판 페이지 접속
    await page.goto('/boards');

    // 2. 컴포넌트 로드 확인
    await expect(page.getByTestId('hot-trip-talk-container')).toBeVisible({
      timeout: 500,
    });

    // 3. 첫 번째 카드 찾기
    const firstCard = page.locator('[data-testid^="post-card-"]').first();
    const cardTestId = await firstCard.getAttribute('data-testid');
    const boardId = cardTestId?.replace('post-card-', '');

    // 4. 좋아요 아이콘과 개수 확인
    await expect(
      page.getByTestId(`like-icon-${boardId}`)
    ).toBeVisible({ timeout: 500 });

    const likeCount = await page.getByTestId(`like-count-${boardId}`).textContent();
    expect(likeCount).toBeDefined();
    expect(Number(likeCount)).toBeGreaterThanOrEqual(0);
  });

  test('게시글 카드에 작성일이 표시된다', async ({ page }) => {
    // 1. 게시판 페이지 접속
    await page.goto('/boards');

    // 2. 컴포넌트 로드 확인
    await expect(page.getByTestId('hot-trip-talk-container')).toBeVisible({
      timeout: 500,
    });

    // 3. 첫 번째 카드 찾기
    const firstCard = page.locator('[data-testid^="post-card-"]').first();
    const cardTestId = await firstCard.getAttribute('data-testid');
    const boardId = cardTestId?.replace('post-card-', '');

    // 4. 날짜 확인 (YYYY.MM.DD 형식)
    const dateText = await page.getByTestId(`card-date-${boardId}`).textContent();
    expect(dateText).toBeDefined();
    expect(dateText).toMatch(/\d{4}\.\d{2}\.\d{2}/);
  });
});
