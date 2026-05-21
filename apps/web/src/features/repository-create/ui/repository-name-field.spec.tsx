import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { RepositoryNameField } from './repository-name-field';

describe('RepositoryNameField', () => {
  afterEach(() => {
    cleanup();
  });

  it('입력한 저장소 이름 변경을 전달한다', async () => {
    const user = userEvent.setup();
    const onRepositoryNameChange = vi.fn();

    const ControlledRepositoryNameField = () => {
      const [repositoryName, setRepositoryName] = useState('');

      return (
        <RepositoryNameField
          repositoryName={repositoryName}
          nameError={null}
          onRepositoryNameChange={(nextRepositoryName) => {
            setRepositoryName(nextRepositoryName);
            onRepositoryNameChange(nextRepositoryName);
          }}
        />
      );
    };

    render(<ControlledRepositoryNameField />);

    await user.type(screen.getByLabelText('저장소 이름'), '오프닝 저장소');

    expect(onRepositoryNameChange).toHaveBeenLastCalledWith('오프닝 저장소');
  });

  it('공백만 입력하면 에러를 보여준다', () => {
    render(
      <RepositoryNameField
        repositoryName="   "
        nameError="저장소 이름을 입력하세요."
        onRepositoryNameChange={vi.fn()}
      />,
    );

    expect(screen.getByLabelText('저장소 이름')).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText('저장소 이름을 입력하세요.')).toBeInTheDocument();
  });

  it('유효한 이름이면 에러를 숨긴다', () => {
    render(
      <RepositoryNameField
        repositoryName="오프닝 저장소"
        nameError={null}
        onRepositoryNameChange={vi.fn()}
      />,
    );

    expect(screen.getByLabelText('저장소 이름')).toHaveAttribute('aria-invalid', 'false');
    expect(screen.queryByText('저장소 이름을 입력하세요.')).not.toBeInTheDocument();
  });
});
