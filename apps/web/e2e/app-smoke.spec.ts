import { expect, test } from '@playwright/test';

const NOTATION_INPUT_PATH = '/repositories/11111111-1111-4111-8111-111111111111/new';

test.describe('앱 로딩 스모크', () => {
  test('기보 입력 화면의 주요 shell을 렌더링한다', async ({ page }) => {
    await page.goto(NOTATION_INPUT_PATH);

    await expect(page.getByRole('main')).toBeVisible();
    await expect(page.getByRole('region', { name: '보드 작업 영역' })).toBeVisible();
    await expect(page.getByRole('complementary', { name: '기보 입력 사이드 패널' })).toBeVisible();
    await expect(page.getByLabel('e2')).toBeVisible();
  });
});
