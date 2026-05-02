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

  test('실제 보드 착수 뒤 우측 수순 목록에 SAN이 순서대로 표시된다', async ({ page }) => {
    await page.goto('/');

    const moveHistoryPanel = page.getByRole('region', { name: '수순 목록' });

    await expect(moveHistoryPanel).toBeVisible();
    await expect(moveHistoryPanel.getByText('아직 기록된 수가 없습니다.')).toBeVisible();

    await move(page, 'e2', 'e4');

    await expect(moveHistoryPanel.getByText('아직 기록된 수가 없습니다.')).toHaveCount(0);
    await expect(moveHistoryPanel.getByText('1.')).toBeVisible();
    await expect(moveHistoryPanel.getByRole('button', { name: 'e4', exact: true })).toBeVisible();

    await move(page, 'e7', 'e5');
    await move(page, 'g1', 'f3');
    await move(page, 'b8', 'c6');

    await expect(moveHistoryPanel.getByText('2.')).toBeVisible();
    await expect(moveHistoryPanel.getByRole('button', { name: 'e4', exact: true })).toBeVisible();
    await expect(moveHistoryPanel.getByRole('button', { name: 'e5', exact: true })).toBeVisible();
    await expect(moveHistoryPanel.getByRole('button', { name: 'Nf3', exact: true })).toBeVisible();
    await expect(moveHistoryPanel.getByRole('button', { name: 'Nc6', exact: true })).toBeVisible();
    await expect(
      moveHistoryPanel.getByRole('button', { name: 'Nc6', exact: true }),
    ).toHaveAttribute('aria-current', 'step');

    await moveHistoryPanel.getByRole('button', { name: 'e4', exact: true }).click();

    await expect(moveHistoryPanel.getByRole('button', { name: 'e4', exact: true })).toHaveAttribute(
      'data-selected',
      'true',
    );
    await expect(
      moveHistoryPanel.getByRole('button', { name: 'Nc6', exact: true }),
    ).toHaveAttribute('aria-current', 'step');
  });

  test('좌우 방향키로 수순 표시 시점을 되돌리고 다시 진행할 수 있다', async ({ page }) => {
    await page.goto('/');

    const moveHistoryPanel = page.getByRole('region', { name: '수순 목록' });

    await move(page, 'e2', 'e4');
    await move(page, 'e7', 'e5');
    await move(page, 'g1', 'f3');

    await expect(
      moveHistoryPanel.getByRole('button', { name: 'Nf3', exact: true }),
    ).toHaveAttribute('aria-current', 'step');
    await expect(page.getByRole('status', { name: '현재 턴 흑' })).toBeAttached();

    await page.keyboard.press('ArrowLeft');

    await expect(moveHistoryPanel.getByRole('button', { name: 'e5', exact: true })).toHaveAttribute(
      'data-selected',
      'true',
    );
    await expect(pieceOn(square(page, 'g1'), 'white knight')).toBeVisible();
    await expect(pieceOn(square(page, 'f3'), 'white knight')).toHaveCount(0);
    await expect(page.getByRole('status', { name: '현재 턴 백' })).toBeAttached();

    await page.keyboard.press('ArrowRight');

    await expect(
      moveHistoryPanel.getByRole('button', { name: 'Nf3', exact: true }),
    ).toHaveAttribute('data-selected', 'true');
    await expect(pieceOn(square(page, 'g1'), 'white knight')).toHaveCount(0);
    await expect(pieceOn(square(page, 'f3'), 'white knight')).toBeVisible();
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

  test('상대 기물이 있는 합법 수를 클릭하면 캡처하고 턴이 전환된다', async ({ page }) => {
    await page.goto('/');

    await move(page, 'e2', 'e4');
    await move(page, 'd7', 'd5');

    await square(page, 'e4').click();

    await expect(square(page, 'd5')).toHaveAttribute('data-legal-move', 'true');

    await square(page, 'd5').click();

    await expect(pieceOn(square(page, 'e4'), 'white pawn')).toHaveCount(0);
    await expect(pieceOn(square(page, 'd5'), 'black pawn')).toHaveCount(0);
    await expect(pieceOn(square(page, 'd5'), 'white pawn')).toBeVisible();
    await expect(square(page, 'e4')).toHaveAttribute('data-last-move', 'true');
    await expect(square(page, 'd5')).toHaveAttribute('data-last-move', 'true');
    await expect(page.getByRole('status', { name: '현재 턴 흑' })).toBeAttached();
  });

  test('프로모션 후보 칸을 클릭하면 선택 전에는 착수가 확정되지 않고 기물 선택 후 확정된다', async ({
    page,
  }) => {
    await page.goto('/');

    await openWhitePromotionSelector(page);

    await expect(page.getByRole('dialog', { name: '프로모션 기물 선택' })).toBeVisible();
    await expect(pieceOn(square(page, 'b7'), 'white pawn')).toBeVisible();
    await expect(pieceOn(square(page, 'a8'), 'black rook')).toBeVisible();
    await expect(page.getByRole('status', { name: '현재 턴 백' })).toBeAttached();

    await page.getByRole('button', { name: '나이트로 승격' }).click();

    await expect(
      page.getByRole('region', { name: '수순 목록' }).getByRole('button', { name: /a8=N/ }),
    ).toBeVisible();
    await expect(page.getByRole('dialog', { name: '프로모션 기물 선택' })).toHaveCount(0);
    await expect(pieceOn(square(page, 'b7'), 'white pawn')).toHaveCount(0);
    await expect(pieceOn(square(page, 'a8'), 'black rook')).toHaveCount(0);
    await expect(pieceOn(square(page, 'a8'), 'white knight')).toBeVisible();
    await expect(page.getByRole('status', { name: '현재 턴 흑' })).toBeAttached();
  });

  test('프로모션 선택 UI 바깥을 클릭하면 보류 중인 프로모션을 취소한다', async ({ page }) => {
    await page.goto('/');

    await openWhitePromotionSelector(page);

    await expect(page.getByRole('dialog', { name: '프로모션 기물 선택' })).toBeVisible();

    await square(page, 'e1').click();

    await expect(page.getByRole('dialog', { name: '프로모션 기물 선택' })).toHaveCount(0);
    await expect(pieceOn(square(page, 'b7'), 'white pawn')).toBeVisible();
    await expect(pieceOn(square(page, 'a8'), 'black rook')).toBeVisible();
    await expect(pieceOn(square(page, 'a8'), 'white knight')).toHaveCount(0);
    await expect(square(page, 'b7')).toHaveAttribute('data-selected', 'false');
    await expect(page.getByRole('status', { name: '현재 턴 백' })).toBeAttached();
  });
});

const square = (page: Page, label: string) => {
  return page
    .getByRole('region', { name: '기보 입력 보드 영역' })
    .getByRole('button', { name: label, exact: true });
};

const pieceOn = (squareLocator: Locator, name: string) => {
  return squareLocator.getByAltText(name);
};

const move = async (page: Page, from: string, to: string) => {
  await square(page, from).click();
  await square(page, to).click();
};

const openWhitePromotionSelector = async (page: Page) => {
  await move(page, 'a2', 'a4');
  await move(page, 'h7', 'h5');
  await move(page, 'a4', 'a5');
  await move(page, 'h5', 'h4');
  await move(page, 'a5', 'a6');
  await move(page, 'g7', 'g5');
  await move(page, 'a6', 'b7');
  await move(page, 'g5', 'g4');

  await square(page, 'b7').click();
  await square(page, 'a8').click();
};
