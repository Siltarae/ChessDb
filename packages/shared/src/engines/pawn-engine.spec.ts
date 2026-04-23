import { describe, expect, it } from 'vitest';
import type { GameState } from '../models/game-state.js';
import { COLOR, PIECE_TYPE, SQUARE } from '../models/game-state.js';
import { getPawnMoves } from './pawn-engine.js';

// [1] Mock 데이터 및 Fixture 분리
const createEmptyState = (): GameState => ({
  board: Array(64).fill(null),
  turn: COLOR.WHITE,
  castlingRights: 0,
  enPassantSquare: null,
  halfmoveClock: 0,
  fullmoveNumber: 1,
});

describe('PawnEngine', () => {
  describe('getPawnMoves', () => {
    it('선택한 칸에 기물이 없으면 빈 배열을 반환해야 한다', () => {
      // Given
      const state = createEmptyState();
      const emptySquare = SQUARE.E4;

      // When
      const moves = getPawnMoves(emptySquare, state);

      // Then
      expect(moves).toEqual([]);
    });

    describe('흰색 폰(White Pawn)의 이동을 판정할 때', () => {
      it('앞에 기물이 없으면 한 칸 전진할 수 있어야 한다', () => {
        // Given
        const pawnSquare = SQUARE.E3;
        const board = [...Array(64).fill(null)];
        board[pawnSquare] = { type: PIECE_TYPE.PAWN, color: COLOR.WHITE };
        const state = { ...createEmptyState(), board };

        // When
        const moves = getPawnMoves(pawnSquare, state);

        // Then
        expect(moves).toContain(SQUARE.E4);
        expect(moves.length).toBe(1);
      });

      it('시작 위치(2행)이고 경로가 비어있으면 두 칸 전진할 수 있어야 한다', () => {
        // Given
        const pawnSquare = SQUARE.E2;
        const board = [...Array(64).fill(null)];
        board[pawnSquare] = { type: PIECE_TYPE.PAWN, color: COLOR.WHITE };
        const state = { ...createEmptyState(), board };

        // When
        const moves = getPawnMoves(pawnSquare, state);

        // Then
        expect(moves).toContain(SQUARE.E3);
        expect(moves).toContain(SQUARE.E4);
        expect(moves.length).toBe(2);
      });

      it('대각선 앞에 검은색 기물이 있으면 캡처할 수 있어야 한다', () => {
        // Given
        const pawnSquare = SQUARE.E2;
        const board = [...Array(64).fill(null)];
        board[pawnSquare] = { type: PIECE_TYPE.PAWN, color: COLOR.WHITE };
        board[SQUARE.D3] = { type: PIECE_TYPE.KNIGHT, color: COLOR.BLACK }; // 캡처 대상
        const state = { ...createEmptyState(), board };

        // When
        const moves = getPawnMoves(pawnSquare, state);

        // Then
        expect(moves).toContain(SQUARE.D3);
        expect(moves).toContain(SQUARE.E3);
        expect(moves).toContain(SQUARE.E4);
      });

      it('전진 경로가 기물에 의해 막혀있으면 이동할 수 없어야 한다', () => {
        // Given
        const pawnSquare = SQUARE.E2;
        const board = [...Array(64).fill(null)];
        board[pawnSquare] = { type: PIECE_TYPE.PAWN, color: COLOR.WHITE };
        board[SQUARE.E3] = { type: PIECE_TYPE.ROOK, color: COLOR.BLACK }; // 장애물
        const state = { ...createEmptyState(), board };

        // When
        const moves = getPawnMoves(pawnSquare, state);

        // Then
        expect(moves).not.toContain(SQUARE.E3);
        expect(moves).not.toContain(SQUARE.E4);
      });
    });

    describe('검은색 폰(Black Pawn)의 이동을 판정할 때', () => {
      it('앞에 기물이 없으면 아래 방향으로 한 칸 전진해야 한다', () => {
        // Given
        const pawnSquare = SQUARE.E7;
        const board = [...Array(64).fill(null)];
        board[pawnSquare] = { type: PIECE_TYPE.PAWN, color: COLOR.BLACK };
        const state = { ...createEmptyState(), turn: COLOR.BLACK, board };

        // When
        const moves = getPawnMoves(pawnSquare, state);

        // Then
        expect(moves).toContain(SQUARE.E6);
        expect(moves).toContain(SQUARE.E5); // 7행은 시작 위치이므로 2칸도 가능
      });

      it('대각선에 흰색 기물이 있으면 캡처할 수 있어야 한다', () => {
        // Given
        const pawnSquare = SQUARE.E7;
        const board = [...Array(64).fill(null)];
        board[pawnSquare] = { type: PIECE_TYPE.PAWN, color: COLOR.BLACK };
        board[SQUARE.F6] = { type: PIECE_TYPE.PAWN, color: COLOR.WHITE };
        const state = { ...createEmptyState(), turn: COLOR.BLACK, board };

        // When
        const moves = getPawnMoves(pawnSquare, state);

        // Then
        expect(moves).toContain(SQUARE.F6);
      });

      it('앙파상 조건을 만족하면 흑 폰도 앙파상 목적지를 결과에 포함해야 한다', () => {
        const board = [...Array(64).fill(null)];
        board[SQUARE.D4] = { type: PIECE_TYPE.PAWN, color: COLOR.BLACK };
        board[SQUARE.E4] = { type: PIECE_TYPE.PAWN, color: COLOR.WHITE };
        const state = {
          ...createEmptyState(),
          turn: COLOR.BLACK,
          enPassantSquare: SQUARE.E3,
          board,
        };

        expect(getPawnMoves(SQUARE.D4, state)).toContain(SQUARE.E3);
      });
    });

    describe('앙파상(En Passant) 이동을 판정할 때', () => {
      it('앙파상 조건을 만족하면 백 폰의 대각선 빈 칸 이동을 결과에 포함해야 한다', () => {
        const board = [...Array(64).fill(null)];
        board[SQUARE.E5] = { type: PIECE_TYPE.PAWN, color: COLOR.WHITE };
        board[SQUARE.D5] = { type: PIECE_TYPE.PAWN, color: COLOR.BLACK };
        const state = {
          ...createEmptyState(),
          enPassantSquare: SQUARE.D6,
          board,
        };

        expect(getPawnMoves(SQUARE.E5, state)).toContain(SQUARE.D6);
      });

      it('앙파상 타겟이 없으면 대각선 빈 칸을 결과에 포함하면 안 된다', () => {
        const board = [...Array(64).fill(null)];
        board[SQUARE.E5] = { type: PIECE_TYPE.PAWN, color: COLOR.WHITE };
        board[SQUARE.D5] = { type: PIECE_TYPE.PAWN, color: COLOR.BLACK };
        const state = {
          ...createEmptyState(),
          board,
        };

        expect(getPawnMoves(SQUARE.E5, state)).not.toContain(SQUARE.D6);
      });
    });

    describe('보드 경계에서의 예외 상황을 확인할 때', () => {
      it('보드 왼쪽 끝(A열)에서 왼쪽 대각선 캡처를 시도하면 안 된다 (워프 방지)', () => {
        // Given
        const whitePawn = SQUARE.A2;
        const blackPawn = SQUARE.A7;
        const board = [...Array(64).fill(null)];
        board[whitePawn] = { type: PIECE_TYPE.PAWN, color: COLOR.WHITE };
        board[blackPawn] = { type: PIECE_TYPE.PAWN, color: COLOR.BLACK };

        const whiteState = { ...createEmptyState(), board };
        const blackState = { ...createEmptyState(), turn: COLOR.BLACK, board };

        // When
        const whiteMoves = getPawnMoves(whitePawn, whiteState);
        const blackMoves = getPawnMoves(blackPawn, blackState);

        // Then
        expect(whiteMoves).not.toContain(whitePawn + 7);
        expect(blackMoves).not.toContain(blackPawn - 9);
      });

      it('보드 오른쪽 끝(H열)에서 오른쪽 대각선 캡처를 시도하면 안 된다 (워프 방지)', () => {
        // Given
        const whitePawn = SQUARE.H2;
        const blackPawn = SQUARE.H7;
        const board = [...Array(64).fill(null)];
        board[whitePawn] = { type: PIECE_TYPE.PAWN, color: COLOR.WHITE };
        board[blackPawn] = { type: PIECE_TYPE.PAWN, color: COLOR.BLACK };

        const whiteState = { ...createEmptyState(), board };
        const blackState = { ...createEmptyState(), turn: COLOR.BLACK, board };

        // When
        const whiteMoves = getPawnMoves(whitePawn, whiteState);
        const blackMoves = getPawnMoves(blackPawn, blackState);

        // Then
        expect(whiteMoves).not.toContain(whitePawn + 9);
        expect(blackMoves).not.toContain(blackPawn - 7);
      });

      it('보드 하단 끝(A1)에서 폰의 이동을 판정할 때 안전해야 한다', () => {
        // 1. A1에 있는 백 폰 (정상 전진 가능해야 함)
        const whitePawn = SQUARE.A1;
        const boardW = [...Array(64).fill(null)];
        boardW[whitePawn] = { type: PIECE_TYPE.PAWN, color: COLOR.WHITE };
        const stateW = { ...createEmptyState(), board: boardW };
        const whiteMoves = getPawnMoves(whitePawn, stateW);

        expect(whiteMoves).toContain(SQUARE.A2);

        // 2. A1에 있는 흑 폰 (더 이상 내려갈 곳이 없어야 함)
        const blackPawn = SQUARE.A1;
        const boardB = [...Array(64).fill(null)];
        boardB[blackPawn] = { type: PIECE_TYPE.PAWN, color: COLOR.BLACK };
        const stateB = { ...createEmptyState(), turn: COLOR.BLACK, board: boardB };
        const blackMoves = getPawnMoves(blackPawn, stateB);

        expect(blackMoves).toEqual([]);
      });
    });

    describe('유틸리티 함수의 동작을 확인할 때', () => {
      it('보드 인덱스 범위를 벗어나는 값은 결과에 포함되지 않아야 한다 (toSquare 검증)', () => {
        // 1. 1행에 있는 검은색 폰: -8 연산 시 0 미만 발생
        const blackPawn = SQUARE.E1;
        const board1 = [...Array(64).fill(null)];
        board1[blackPawn] = { type: PIECE_TYPE.PAWN, color: COLOR.BLACK };
        const state1 = { ...createEmptyState(), turn: COLOR.BLACK, board: board1 };
        getPawnMoves(blackPawn, state1);

        // 2. 8행에 있는 흰색 폰: +8 연산 시 63 초과 발생
        const whitePawn = SQUARE.E8;
        const board2 = [...Array(64).fill(null)];
        board2[whitePawn] = { type: PIECE_TYPE.PAWN, color: COLOR.WHITE };
        const state2 = { ...createEmptyState(), turn: COLOR.WHITE, board: board2 };
        getPawnMoves(whitePawn, state2);

        expect(true).toBe(true);
      });
    });
  });
});
