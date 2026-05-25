import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import type { RepositorySummary } from '@/entities/repository';
import { RepositoryList } from './repository-list';

const repositories: RepositorySummary[] = [
  {
    id: 'repository-1',
    name: '오프닝 저장소',
    createdAt: '2026-05-20T00:00:00.000Z',
  },
  {
    id: 'repository-2',
    name: '엔드게임 저장소',
    createdAt: '2026-05-21T00:00:00.000Z',
  },
];

describe('RepositoryList', () => {
  afterEach(() => {
    cleanup();
  });

  it('저장소 이름 목록을 렌더링한다', () => {
    render(<RepositoryList repositories={repositories} isLoading={false} />);

    expect(screen.getByRole('region', { name: '저장소 목록' })).toBeInTheDocument();
    expect(screen.getByText('오프닝 저장소')).toBeInTheDocument();
    expect(screen.getByText('엔드게임 저장소')).toBeInTheDocument();
  });

  it('전달받은 저장소 순서를 다시 변경하지 않는다', () => {
    render(<RepositoryList repositories={repositories} isLoading={false} />);

    expect(
      screen.getAllByRole('button', { name: /열기$/ }).map((button) => button.textContent),
    ).toEqual(['오프닝 저장소', '엔드게임 저장소']);
  });

  it('삭제 버튼 클릭이 저장소 객체로 delete request callback을 호출한다', async () => {
    const user = userEvent.setup();
    const onRepositoryOpen = vi.fn();
    const onRepositoryDeleteRequest = vi.fn();
    render(
      <RepositoryList
        repositories={repositories}
        isLoading={false}
        onRepositoryOpen={onRepositoryOpen}
        onRepositoryDeleteRequest={onRepositoryDeleteRequest}
      />,
    );

    await user.click(screen.getByRole('button', { name: '오프닝 저장소 삭제' }));

    expect(onRepositoryDeleteRequest).toHaveBeenCalledWith(repositories[0]);
    expect(onRepositoryOpen).not.toHaveBeenCalled();
  });

  it('목록 항목 클릭이 저장소 id로 open callback을 호출한다', async () => {
    const user = userEvent.setup();
    const onRepositoryOpen = vi.fn();
    render(
      <RepositoryList
        repositories={repositories}
        isLoading={false}
        onRepositoryOpen={onRepositoryOpen}
      />,
    );

    await user.click(screen.getByRole('button', { name: '오프닝 저장소 열기' }));

    expect(onRepositoryOpen).toHaveBeenCalledWith('repository-1');
  });

  it('빈 목록일 때 빈 상태 메시지를 보여준다', () => {
    render(<RepositoryList repositories={[]} isLoading={false} />);

    expect(screen.getByText('아직 생성된 저장소가 없습니다.')).toBeInTheDocument();
    expect(
      screen.getByText('저장소를 만들면 기보와 분석 기록을 한곳에서 관리할 수 있습니다.'),
    ).toBeInTheDocument();
  });

  it('로딩 상태일 때 스켈레톤을 보여준다', () => {
    render(<RepositoryList repositories={[]} isLoading />);

    expect(screen.getByLabelText('저장소 목록 로딩 중')).toBeInTheDocument();
    expect(screen.queryByText('아직 생성된 저장소가 없습니다.')).not.toBeInTheDocument();
  });
});
