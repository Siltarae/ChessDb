import { GAME_RECORD_RESULT, GAME_TERMINATION_REASON } from '@chess-db/shared';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { selectGameMetadata, useDraftStore } from '@/entities/draft';
import { GameMetadataEditor } from './game-metadata-editor';

describe('GameMetadataEditor', () => {
  beforeEach(() => {
    useDraftStore.getState().clearDraftComments();
    useDraftStore.getState().clearDraftAnnotations();
    useDraftStore.getState().clearGameMetadata();
  });

  afterEach(() => {
    cleanup();
  });

  it('기보 결과와 종료 사유 선택 UI를 렌더링해야 한다', () => {
    render(<GameMetadataEditor />);

    expect(screen.getByRole('group', { name: '기보 결과 선택' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '1-0' })).toBeInTheDocument();
    expect(screen.getByRole('group', { name: '종료 사유 선택' })).toBeInTheDocument();
    expect(screen.getByText('결과를 먼저 선택하세요.')).toBeInTheDocument();
  });

  it('결과 선택을 draft metadata 갱신으로 연결해야 한다', () => {
    render(<GameMetadataEditor />);

    fireEvent.click(screen.getByRole('button', { name: '0-1' }));

    expect(selectGameMetadata(useDraftStore.getState())).toEqual({
      result: GAME_RECORD_RESULT.BLACK_WIN,
      terminationReason: null,
    });
    expect(screen.getByRole('button', { name: '0-1' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('종료 사유 선택을 draft metadata 갱신으로 연결해야 한다', () => {
    useDraftStore.getState().updateGameMetadata({ result: GAME_RECORD_RESULT.DRAW });
    render(<GameMetadataEditor />);

    fireEvent.click(screen.getByRole('button', { name: '무승부 합의' }));

    expect(selectGameMetadata(useDraftStore.getState())).toEqual({
      result: GAME_RECORD_RESULT.DRAW,
      terminationReason: GAME_TERMINATION_REASON.AGREEMENT,
    });
    expect(screen.getByRole('button', { name: '무승부 합의' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  it('결과를 먼저 선택하기 전에는 종료 사유 선택 안내를 보여줘야 한다', () => {
    render(<GameMetadataEditor />);

    expect(screen.getByText('결과를 먼저 선택하세요.')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '체크메이트' })).not.toBeInTheDocument();
  });

  it('승부 결과를 선택하면 시간패를 포함한 승부 종료 사유를 보여줘야 한다', () => {
    render(<GameMetadataEditor />);

    fireEvent.click(screen.getByRole('button', { name: '1-0' }));

    expect(screen.getByRole('button', { name: '체크메이트' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '기권' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '시간패' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '50수 규칙' })).not.toBeInTheDocument();
  });

  it('무승부 결과를 선택하면 무승부 종료 사유를 자세히 보여줘야 한다', () => {
    render(<GameMetadataEditor />);

    fireEvent.click(screen.getByRole('button', { name: '1/2-1/2' }));

    expect(screen.getByRole('button', { name: '스테일메이트' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '50수 규칙' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '3회 반복' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '기물 부족' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '무승부 합의' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '시간패' })).not.toBeInTheDocument();
  });
});
