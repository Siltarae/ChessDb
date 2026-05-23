import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router';

import { RepositoryHomePage } from './repository-home-page';

describe('RepositoryHomePage', () => {
  afterEach(() => {
    cleanup();
  });

  it('저장소 기본 보드뷰를 렌더링한다', () => {
    render(
      <MemoryRouter initialEntries={['/repositories/repository-1']}>
        <Routes>
          <Route path="/repositories/:repositoryId" element={<RepositoryHomePage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { name: '저장소 보드' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: '기보 입력 보드 영역' })).toBeInTheDocument();
    expect(
      screen.getByRole('complementary', { name: '기보 입력 사이드 패널' }),
    ).toBeInTheDocument();
    expect(screen.getByText('repository-1')).toBeInTheDocument();
  });

  it('기존 기보 업데이트 저장 버튼 위치를 비활성 상태로 고정한다', () => {
    render(
      <MemoryRouter initialEntries={['/repositories/repository-1']}>
        <Routes>
          <Route path="/repositories/:repositoryId" element={<RepositoryHomePage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByRole('button', { name: '기보 저장' })).toBeDisabled();
  });

  it('새 기보 작성 버튼 클릭 시 저장소 새 기보 입력 뷰로 이동한다', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={['/repositories/repository-1']}>
        <Routes>
          <Route path="/repositories/:repositoryId" element={<RepositoryHomePage />} />
          <Route path="/repositories/:repositoryId/new" element={<div>새 기보 입력</div>} />
        </Routes>
      </MemoryRouter>,
    );

    await user.click(screen.getByRole('button', { name: '새 기보 작성' }));

    expect(screen.getByText('새 기보 입력')).toBeInTheDocument();
  });

  it('FEATURE-006 통계 분석 화면으로 렌더링하지 않는다', () => {
    render(
      <MemoryRouter initialEntries={['/repositories/repository-1']}>
        <Routes>
          <Route path="/repositories/:repositoryId" element={<RepositoryHomePage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.queryByText('다음 수 후보')).not.toBeInTheDocument();
    expect(screen.queryByText('승률')).not.toBeInTheDocument();
  });
});
