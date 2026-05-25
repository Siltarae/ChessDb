import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { DeleteRepositoryDialog } from './delete-repository-dialog';

describe('DeleteRepositoryDialog', () => {
  afterEach(() => {
    cleanup();
  });

  it('열려 있으면 저장소 삭제 확인 문구와 액션을 표시해야 한다', () => {
    render(<DeleteRepositoryDialog open onOpenChange={vi.fn()} onConfirmDelete={vi.fn()} />);

    expect(screen.getByRole('alertdialog', { name: '저장소 삭제' })).toBeInTheDocument();
    expect(
      screen.getByText(
        '정말로 삭제하시겠습니까? 목록에서 제거되며 포함된 기보도 더 이상 표시되지 않습니다.',
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '취소' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '삭제' })).toBeInTheDocument();
  });

  it('닫혀 있으면 저장소 삭제 확인 문구를 표시하지 않아야 한다', () => {
    render(
      <DeleteRepositoryDialog open={false} onOpenChange={vi.fn()} onConfirmDelete={vi.fn()} />,
    );

    expect(screen.queryByRole('alertdialog', { name: '저장소 삭제' })).not.toBeInTheDocument();
  });

  it('취소를 누르면 다이얼로그 닫기 요청을 전달해야 한다', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    render(<DeleteRepositoryDialog open onOpenChange={onOpenChange} onConfirmDelete={vi.fn()} />);

    await user.click(screen.getByRole('button', { name: '취소' }));

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('삭제를 누르면 확인 callback을 실행해야 한다', async () => {
    const user = userEvent.setup();
    const onConfirmDelete = vi.fn();

    render(
      <DeleteRepositoryDialog open onOpenChange={vi.fn()} onConfirmDelete={onConfirmDelete} />,
    );

    await user.click(screen.getByRole('button', { name: '삭제' }));

    expect(onConfirmDelete).toHaveBeenCalledTimes(1);
  });

  it('삭제 중이면 확인 버튼을 비활성화하고 진행 중 문구를 표시해야 한다', () => {
    render(
      <DeleteRepositoryDialog open onOpenChange={vi.fn()} onConfirmDelete={vi.fn()} isDeleting />,
    );

    expect(screen.getByRole('button', { name: '삭제 중' })).toBeDisabled();
  });
});
