import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router';

import { RepositoryHomePage } from './repository-home-page';

describe('RepositoryHomePage', () => {
  afterEach(() => {
    cleanup();
  });

  it('route parameter의 repositoryId를 저장소 컨텍스트로 표시한다', () => {
    render(
      <MemoryRouter initialEntries={['/repositories/repository-1']}>
        <Routes>
          <Route path="/repositories/:repositoryId" element={<RepositoryHomePage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { name: '저장소 내부' })).toBeInTheDocument();
    expect(screen.getByText('repository-1')).toBeInTheDocument();
  });
});
