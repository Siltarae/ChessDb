import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { ResetDraftDialog } from './reset-draft-dialog';

describe('ResetDraftDialog', () => {
  afterEach(() => {
    cleanup();
  });

  it('열려 있으면 초기화 확인 문구와 액션을 표시해야 한다', () => {
    render(<ResetDraftDialog open onOpenChange={vi.fn()} onConfirm={vi.fn()} />);

    expect(screen.getByRole('alertdialog', { name: '초안 초기화' })).toBeInTheDocument();
    expect(
      screen.getByText('현재 입력 중인 초안을 초기화합니다. 계속하시겠습니까?'),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '취소' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '초기화' })).toBeInTheDocument();
  });

  it('닫혀 있으면 초기화 확인 문구를 표시하지 않아야 한다', () => {
    render(<ResetDraftDialog open={false} onOpenChange={vi.fn()} onConfirm={vi.fn()} />);

    expect(screen.queryByRole('alertdialog', { name: '초안 초기화' })).not.toBeInTheDocument();
  });

  it('취소를 누르면 다이얼로그 닫기 요청을 전달해야 한다', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    render(<ResetDraftDialog open onOpenChange={onOpenChange} onConfirm={vi.fn()} />);

    await user.click(screen.getByRole('button', { name: '취소' }));

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('초기화를 누르면 확인 callback을 실행해야 한다', async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();

    render(<ResetDraftDialog open onOpenChange={vi.fn()} onConfirm={onConfirm} />);

    await user.click(screen.getByRole('button', { name: '초기화' }));

    expect(onConfirm).toHaveBeenCalledTimes(1);
  });
});
