import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

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
