import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { CreateRepositoryDialog } from './create-repository-dialog';

describe('CreateRepositoryDialog shell', () => {
  afterEach(() => {
    cleanup();
  });

  it('열려 있으면 저장소 생성 shell을 표시해야 한다', () => {
    render(<CreateRepositoryDialog isOpen onOpenChange={vi.fn()} onCreated={vi.fn()} />);

    expect(screen.getByRole('dialog', { name: '새 저장소' })).toBeInTheDocument();
    expect(screen.getByLabelText('저장소 이름')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '생성' })).toBeDisabled();
    expect(screen.getByRole('button', { name: '취소' })).toBeInTheDocument();
  });

  it('닫혀 있으면 저장소 생성 shell을 표시하지 않아야 한다', () => {
    render(<CreateRepositoryDialog isOpen={false} onOpenChange={vi.fn()} onCreated={vi.fn()} />);

    expect(screen.queryByRole('dialog', { name: '새 저장소' })).not.toBeInTheDocument();
  });

  it('취소 시 다이얼로그가 닫힌다', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    render(<CreateRepositoryDialog isOpen onOpenChange={onOpenChange} onCreated={vi.fn()} />);

    await user.click(screen.getByRole('button', { name: '취소' }));

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('공백만 입력하면 에러를 보여주고 생성 버튼을 비활성화한다', async () => {
    const user = userEvent.setup();

    render(<CreateRepositoryDialog isOpen onOpenChange={vi.fn()} onCreated={vi.fn()} />);

    await user.type(screen.getByLabelText('저장소 이름'), '   ');

    expect(screen.getByText('저장소 이름을 입력하세요.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '생성' })).toBeDisabled();
  });

  it('유효한 이름을 입력하면 에러를 숨기고 생성 버튼을 활성화한다', async () => {
    const user = userEvent.setup();

    render(<CreateRepositoryDialog isOpen onOpenChange={vi.fn()} onCreated={vi.fn()} />);

    await user.type(screen.getByLabelText('저장소 이름'), '오프닝 저장소');

    expect(screen.queryByText('저장소 이름을 입력하세요.')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: '생성' })).toBeEnabled();
  });
});
