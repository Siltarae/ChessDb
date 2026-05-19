import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { SaveGameButton } from './save-game-button';

describe('SaveGameButton', () => {
  afterEach(() => {
    cleanup();
  });

  it('기보 저장 버튼을 렌더링해야 한다', () => {
    render(<SaveGameButton onSave={vi.fn()} isSaving={false} />);

    const button = screen.getByRole('button', { name: '기보 저장' });

    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('aria-busy', 'false');
  });

  it('클릭하면 저장 요청 callback을 실행해야 한다', async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    render(<SaveGameButton onSave={onSave} isSaving={false} />);

    await user.click(screen.getByRole('button', { name: '기보 저장' }));

    expect(onSave).toHaveBeenCalledOnce();
  });

  it('저장 중이면 진행 상태를 표시하고 클릭을 막아야 한다', async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    render(<SaveGameButton onSave={onSave} isSaving />);

    const button = screen.getByRole('button', { name: '저장 중' });

    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');

    await user.click(button);

    expect(onSave).not.toHaveBeenCalled();
  });

  it('disabled이면 클릭을 막아야 한다', async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    render(<SaveGameButton onSave={onSave} isSaving={false} disabled />);

    const button = screen.getByRole('button', { name: '기보 저장' });

    expect(button).toBeDisabled();

    await user.click(button);

    expect(onSave).not.toHaveBeenCalled();
  });
});
