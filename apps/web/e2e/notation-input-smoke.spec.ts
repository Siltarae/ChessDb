import { expect, type Locator, type Page, test } from '@playwright/test';

test.describe('기보 입력 핵심 흐름 E2E 스모크', () => {
  test('e2 백 폰을 e4로 착수하면 보드와 현재 턴이 갱신된다', async ({ page }) => {
    await page.goto('/');

    const e2 = square(page, 'e2');
    const e4 = square(page, 'e4');

    await expect(page.getByRole('region', { name: '기보 입력 보드 영역' })).toBeVisible();
    await expect(page.getByRole('status', { name: '현재 턴 백' })).toBeAttached();
    await expect(pieceOn(e2, 'white pawn')).toBeVisible();

    await e2.click();

    await expect(e2).toHaveAttribute('data-selected', 'true');
    await expect(e4).toHaveAttribute('data-legal-move', 'true');

    await e4.click();

    await expect(pieceOn(e2, 'white pawn')).toHaveCount(0);
    await expect(pieceOn(e4, 'white pawn')).toBeVisible();
    await expect(e2).toHaveAttribute('data-selected', 'false');
    await expect(e4).toHaveAttribute('data-legal-move', 'false');
    await expect(e2).toHaveAttribute('data-last-move', 'true');
    await expect(e4).toHaveAttribute('data-last-move', 'true');
    await expect(page.getByRole('status', { name: '현재 턴 흑' })).toBeAttached();
  });

  test('불법 칸을 클릭하면 보드 상태와 현재 턴이 유지된다', async ({ page }) => {
    await page.goto('/');

    const e2 = square(page, 'e2');
    const e4 = square(page, 'e4');
    const e5 = square(page, 'e5');

    await e2.click();
    await expect(e4).toHaveAttribute('data-legal-move', 'true');
    await expect(e5).toHaveAttribute('data-legal-move', 'false');

    await e5.click();

    await expect(pieceOn(e2, 'white pawn')).toBeVisible();
    await expect(pieceOn(e4, 'white pawn')).toHaveCount(0);
    await expect(e2).toHaveAttribute('data-selected', 'false');
    await expect(e4).toHaveAttribute('data-legal-move', 'false');
    await expect(page.getByRole('status', { name: '현재 턴 백' })).toBeAttached();
  });

  test('다른 아군 기물을 재선택하면 합법 수 후보가 새 선택 기준으로 바뀐다', async ({ page }) => {
    await page.goto('/');

    await square(page, 'e2').click();

    await expect(square(page, 'e3')).toHaveAttribute('data-legal-move', 'true');
    await expect(square(page, 'e4')).toHaveAttribute('data-legal-move', 'true');

    await square(page, 'd2').click();

    await expect(square(page, 'e2')).toHaveAttribute('data-selected', 'false');
    await expect(square(page, 'd2')).toHaveAttribute('data-selected', 'true');
    await expect(square(page, 'e3')).toHaveAttribute('data-legal-move', 'false');
    await expect(square(page, 'e4')).toHaveAttribute('data-legal-move', 'false');
    await expect(square(page, 'd3')).toHaveAttribute('data-legal-move', 'true');
    await expect(square(page, 'd4')).toHaveAttribute('data-legal-move', 'true');
  });

  test('턴 전환 뒤에는 흑 기물만 새로 선택할 수 있다', async ({ page }) => {
    await page.goto('/');

    await square(page, 'e2').click();
    await square(page, 'e4').click();

    await square(page, 'd2').click();

    await expect(square(page, 'd2')).toHaveAttribute('data-selected', 'false');
    await expect(square(page, 'd3')).toHaveAttribute('data-legal-move', 'false');
    await expect(page.getByRole('status', { name: '현재 턴 흑' })).toBeAttached();

    await square(page, 'e7').click();

    await expect(square(page, 'e7')).toHaveAttribute('data-selected', 'true');
    await expect(square(page, 'e6')).toHaveAttribute('data-legal-move', 'true');
    await expect(square(page, 'e5')).toHaveAttribute('data-legal-move', 'true');
  });
});

const square = (page: Page, label: string) => {
  return page.getByRole('button', { name: label, exact: true });
};

const pieceOn = (squareLocator: Locator, name: string) => {
  return squareLocator.getByAltText(name);
};
