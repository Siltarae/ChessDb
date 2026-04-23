import { describe, expect, it } from 'vitest';
import type { GameState, Move, Square } from '../models/game-state.js';
import { COLOR, PIECE_TYPE, SQUARE } from '../models/game-state.js';
import { moveTargets, normalMove } from '../test-utils/move-test-helpers.js';
import { getKnightMoves } from './knight-engine.js';

// [1] Mock 데이터 및 Fixture 분리
const createEmptyState = (): GameState => ({
  board: Array(64).fill(null),
  turn: COLOR.WHITE,
  castlingRights: 0,
  enPassantSquare: null,
  halfmoveClock: 0,
  fullmoveNumber: 1,
});

describe('KnightEngine', () => {
  describe('getKnightMoves', () => {
    it('선택한 칸에 기물이 없으면 빈 배열을 반환해야 한다', () => {
      // Given
      const state = createEmptyState();
      const emptySquare = SQUARE.E4;

      // When
      const moves = getKnightMoves(emptySquare, state);

      // Then
      expect(moves).toEqual([]);
    });

    describe('보드 중앙(D4)에 나이트가 있을 때', () => {
      it('8방향의 모든 "L"자 위치를 정확히 반환해야 한다', () => {
        // Given
        const knightSquare = SQUARE.D4;
        const board = [...Array(64).fill(null)];
        board[knightSquare] = { type: PIECE_TYPE.KNIGHT, color: COLOR.WHITE };
        const state = { ...createEmptyState(), board };

        // When
        const moves = getKnightMoves(knightSquare, state);

        // Then
        const expectedMoves = [
          SQUARE.C2,
          SQUARE.E2,
          SQUARE.B3,
          SQUARE.F3,
          SQUARE.B5,
          SQUARE.F5,
          SQUARE.C6,
          SQUARE.E6,
        ];
        expect(moves).toHaveLength(8);
        expectedMoves.forEach((move) =>
          expect(moves).toContainEqual(normalMove(knightSquare, move)),
        );
      });
    });

    describe('보드 구석(A1)에 나이트가 있을 때', () => {
      it('보드 내부인 2개의 위치(B3, C2)만 반환해야 한다', () => {
        // Given
        const knightSquare = SQUARE.A1;
        const board = [...Array(64).fill(null)];
        board[knightSquare] = { type: PIECE_TYPE.KNIGHT, color: COLOR.WHITE };
        const state = { ...createEmptyState(), board };

        // When
        const moves = getKnightMoves(knightSquare, state);

        // Then
        expect(moves).toHaveLength(2);
        expect(moves).toContainEqual(normalMove(knightSquare, SQUARE.B3));
        expect(moves).toContainEqual(normalMove(knightSquare, SQUARE.C2));
      });
    });

    describe('목적지에 기물이 있는 경우를 판정할 때', () => {
      it('아군 기물이 있는 칸은 이동 가능 목록에서 제외해야 한다', () => {
        // Given
        const knightSquare = SQUARE.D4;
        const board = [...Array(64).fill(null)];
        board[knightSquare] = { type: PIECE_TYPE.KNIGHT, color: COLOR.WHITE };
        board[SQUARE.C2] = { type: PIECE_TYPE.PAWN, color: COLOR.WHITE }; // 아군
        const state = { ...createEmptyState(), board };

        // When
        const moves = getKnightMoves(knightSquare, state);

        // Then
        expect(moveTargets(moves as Move[])).not.toContain(SQUARE.C2);
        expect(moves).toHaveLength(7);
      });

      it('상대 기물이 있는 칸은 캡처를 위해 목록에 포함해야 한다', () => {
        // Given
        const knightSquare = SQUARE.D4;
        const board = [...Array(64).fill(null)];
        board[knightSquare] = { type: PIECE_TYPE.KNIGHT, color: COLOR.WHITE };
        board[SQUARE.C2] = { type: PIECE_TYPE.PAWN, color: COLOR.BLACK }; // 적군
        const state = { ...createEmptyState(), board };

        // When
        const moves = getKnightMoves(knightSquare, state);

        // Then
        expect(moves).toContainEqual(normalMove(knightSquare, SQUARE.C2));
      });
    });

    describe('보드 경계에서의 워프 현상을 검증할 때', () => {
      it('B열에 있는 나이트가 왼쪽으로 2칸 이동하여 H열로 넘어가면 안 된다', () => {
        // Given
        const knightSquare = SQUARE.B1; // 인덱스 1
        const board = [...Array(64).fill(null)];
        board[knightSquare] = { type: PIECE_TYPE.KNIGHT, color: COLOR.WHITE };
        const state = { ...createEmptyState(), board };

        // When
        const moves = getKnightMoves(knightSquare, state);

        // Then
        // B1(1)에서 오프셋 -10 적용 시 -9가 되어 H열 쪽으로 워프될 수 있음
        const targets = moveTargets(moves as Move[]);
        expect(targets.some((m) => m > 63 || m < 0)).toBe(false);
        expect(targets).not.toContain(SQUARE.H8);
      });
    });

    describe('모든 보드 칸(0-63)에 대해 전수 조사를 수행할 때', () => {
      it('모든 반환된 좌표는 나이트의 "L"자 이동 규칙을 반드시 만족해야 한다', () => {
        const state = createEmptyState();

        for (let sq = 0; sq < 64; sq++) {
          const square = sq as Square;
          const board = [...Array(64).fill(null)];
          board[square] = { type: PIECE_TYPE.KNIGHT, color: COLOR.WHITE };
          const testState = { ...state, board };

          const moves = getKnightMoves(square, testState);
          const f1 = square % 8;
          const r1 = Math.floor(square / 8);

          (moves as Move[]).forEach((move) => {
            const target = move.to;
            const f2 = target % 8;
            const r2 = Math.floor(target / 8);
            const df = Math.abs(f1 - f2);
            const dr = Math.abs(r1 - r2);

            // 나이트 행마의 핵심: 한 축으로 1칸, 다른 축으로 2칸 이동 (곱해서 2)
            expect(df * dr, `Square ${square} to ${target} is not a valid knight move`).toBe(2);
          });
        }
      });
    });
  });
});
