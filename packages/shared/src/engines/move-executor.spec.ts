import { describe, expect, it } from 'vitest';
import type { GameState } from '../models/game-state.js';
import { CASTLE, COLOR, PIECE_TYPE, SQUARE } from '../models/game-state.js';
import {
  castleKingsideMove,
  castleQueensideMove,
  doublePawnPushMove,
  enPassantMove,
  normalMove,
} from '../test-utils/move-test-helpers.js';
import { executeMove } from './move-executor.js';

const createEmptyState = (): GameState => ({
  board: Array(64).fill(null),
  turn: COLOR.WHITE,
  castlingRights: 0,
  enPassantSquare: null,
  halfmoveClock: 0,
  fullmoveNumber: 1,
});

describe('MoveExecutor', () => {
  describe('executeMove', () => {
    it('시작 칸에 기물이 없으면 예외를 던져야 한다', () => {
      const state = createEmptyState();

      expect(() => executeMove(state, normalMove(SQUARE.E2, SQUARE.E4))).toThrow();
    });

    it('일반 이동 후 턴과 보드 상태를 갱신해야 한다', () => {
      const board = [...Array(64).fill(null)];
      board[SQUARE.G1] = { type: PIECE_TYPE.KNIGHT, color: COLOR.WHITE };
      const state = { ...createEmptyState(), board };
      const move = normalMove(SQUARE.G1, SQUARE.F3);

      const nextState = executeMove(state, move);

      expect(nextState).not.toBe(state);
      expect(nextState.turn).toBe(COLOR.BLACK);
      expect(nextState.board[SQUARE.G1]).toBeNull();
      expect(nextState.board[SQUARE.F3]).toEqual({
        type: PIECE_TYPE.KNIGHT,
        color: COLOR.WHITE,
      });
    });

    it('폰 이동 시 halfmoveClock을 0으로 초기화해야 한다', () => {
      const board = [...Array(64).fill(null)];
      board[SQUARE.E2] = { type: PIECE_TYPE.PAWN, color: COLOR.WHITE };
      const state = {
        ...createEmptyState(),
        halfmoveClock: 7,
        board,
      };
      const move = normalMove(SQUARE.E2, SQUARE.E3);

      const nextState = executeMove(state, move);

      expect(nextState.halfmoveClock).toBe(0);
    });

    it('비폰 비캡처 이동 시 halfmoveClock을 1 증가시켜야 한다', () => {
      const board = [...Array(64).fill(null)];
      board[SQUARE.G1] = { type: PIECE_TYPE.KNIGHT, color: COLOR.WHITE };
      const state = {
        ...createEmptyState(),
        halfmoveClock: 4,
        board,
      };
      const move = normalMove(SQUARE.G1, SQUARE.F3);

      const nextState = executeMove(state, move);

      expect(nextState.halfmoveClock).toBe(5);
    });

    it('폰이 2칸 전진하면 enPassantSquare를 중간 칸으로 설정해야 한다', () => {
      const board = [...Array(64).fill(null)];
      board[SQUARE.E2] = { type: PIECE_TYPE.PAWN, color: COLOR.WHITE };
      const state = { ...createEmptyState(), board };
      const move = doublePawnPushMove(SQUARE.E2, SQUARE.E4);

      const nextState = executeMove(state, move);

      expect(nextState.enPassantSquare).toBe(SQUARE.E3);
    });

    it('흑 폰이 2칸 전진하면 enPassantSquare를 중간 칸으로 설정해야 한다', () => {
      const board = [...Array(64).fill(null)];
      board[SQUARE.E7] = { type: PIECE_TYPE.PAWN, color: COLOR.BLACK };
      const state = { ...createEmptyState(), turn: COLOR.BLACK, board };
      const move = doublePawnPushMove(SQUARE.E7, SQUARE.E5);

      const nextState = executeMove(state, move);

      expect(nextState.enPassantSquare).toBe(SQUARE.E6);
    });

    it('잘못된 더블 폰 푸시 랭크면 enPassantSquare를 null로 처리해야 한다', () => {
      const board = [...Array(64).fill(null)];
      board[SQUARE.E2] = { type: PIECE_TYPE.PAWN, color: COLOR.WHITE };
      const state = { ...createEmptyState(), enPassantSquare: SQUARE.D6, board };
      const move = doublePawnPushMove(SQUARE.E2, SQUARE.E3);

      const nextState = executeMove(state, move);

      expect(nextState.enPassantSquare).toBeNull();
    });

    it('킹 이동 시 해당 색의 캐슬링 권리를 제거해야 한다', () => {
      const board = [...Array(64).fill(null)];
      board[SQUARE.E1] = { type: PIECE_TYPE.KING, color: COLOR.WHITE };
      const state = {
        ...createEmptyState(),
        castlingRights:
          CASTLE.WHITE_KING_SIDE |
          CASTLE.WHITE_QUEEN_SIDE |
          CASTLE.BLACK_KING_SIDE |
          CASTLE.BLACK_QUEEN_SIDE,
        board,
      };
      const move = normalMove(SQUARE.E1, SQUARE.F1);

      const nextState = executeMove(state, move);

      expect(nextState.castlingRights).toBe(CASTLE.BLACK_KING_SIDE | CASTLE.BLACK_QUEEN_SIDE);
    });

    it('흑 킹 이동 시 흑 캐슬링 권리를 제거해야 한다', () => {
      const board = [...Array(64).fill(null)];
      board[SQUARE.E8] = { type: PIECE_TYPE.KING, color: COLOR.BLACK };
      const state = {
        ...createEmptyState(),
        turn: COLOR.BLACK,
        castlingRights:
          CASTLE.WHITE_KING_SIDE |
          CASTLE.WHITE_QUEEN_SIDE |
          CASTLE.BLACK_KING_SIDE |
          CASTLE.BLACK_QUEEN_SIDE,
        board,
      };
      const move = normalMove(SQUARE.E8, SQUARE.F8);

      const nextState = executeMove(state, move);

      expect(nextState.castlingRights).toBe(CASTLE.WHITE_KING_SIDE | CASTLE.WHITE_QUEEN_SIDE);
    });

    it('원본 상태를 직접 수정하지 않아야 한다', () => {
      const board = [...Array(64).fill(null)];
      board[SQUARE.G1] = { type: PIECE_TYPE.KNIGHT, color: COLOR.WHITE };
      const state = { ...createEmptyState(), board };
      const originalBoard = [...state.board];
      const move = normalMove(SQUARE.G1, SQUARE.F3);

      const nextState = executeMove(state, move);

      expect(nextState.board).not.toBe(state.board);
      expect(state.board).toEqual(originalBoard);
      expect(state.board[SQUARE.G1]).toEqual({
        type: PIECE_TYPE.KNIGHT,
        color: COLOR.WHITE,
      });
      expect(state.board[SQUARE.F3]).toBeNull();
    });

    it('비폰이 상대 기물을 캡처하면 halfmoveClock을 0으로 초기화해야 한다', () => {
      const board = [...Array(64).fill(null)];
      board[SQUARE.G1] = { type: PIECE_TYPE.KNIGHT, color: COLOR.WHITE };
      board[SQUARE.F3] = { type: PIECE_TYPE.BISHOP, color: COLOR.BLACK };
      const state = { ...createEmptyState(), halfmoveClock: 9, board };

      const nextState = executeMove(state, normalMove(SQUARE.G1, SQUARE.F3));

      expect(nextState.halfmoveClock).toBe(0);
    });

    it('일반 이동이면 enPassantSquare를 null로 초기화해야 한다', () => {
      const board = [...Array(64).fill(null)];
      board[SQUARE.G1] = { type: PIECE_TYPE.KNIGHT, color: COLOR.WHITE };
      const state = { ...createEmptyState(), enPassantSquare: SQUARE.E3, board };

      const nextState = executeMove(state, normalMove(SQUARE.G1, SQUARE.F3));

      expect(nextState.enPassantSquare).toBeNull();
    });

    it('폰이 1칸 전진하면 enPassantSquare를 null로 유지해야 한다', () => {
      const board = [...Array(64).fill(null)];
      board[SQUARE.E2] = { type: PIECE_TYPE.PAWN, color: COLOR.WHITE };
      const state = { ...createEmptyState(), enPassantSquare: SQUARE.D6, board };

      const nextState = executeMove(state, normalMove(SQUARE.E2, SQUARE.E3));

      expect(nextState.enPassantSquare).toBeNull();
    });

    it('백이 이동하면 fullmoveNumber는 유지되어야 한다', () => {
      const board = [...Array(64).fill(null)];
      board[SQUARE.G1] = { type: PIECE_TYPE.KNIGHT, color: COLOR.WHITE };
      const state = { ...createEmptyState(), fullmoveNumber: 12, board };

      const nextState = executeMove(state, normalMove(SQUARE.G1, SQUARE.F3));

      expect(nextState.fullmoveNumber).toBe(12);
    });

    it('흑이 이동하면 fullmoveNumber를 1 증가시켜야 한다', () => {
      const board = [...Array(64).fill(null)];
      board[SQUARE.G8] = { type: PIECE_TYPE.KNIGHT, color: COLOR.BLACK };
      const state = {
        ...createEmptyState(),
        turn: COLOR.BLACK,
        fullmoveNumber: 12,
        board,
      };

      const nextState = executeMove(state, normalMove(SQUARE.G8, SQUARE.F6));

      expect(nextState.fullmoveNumber).toBe(13);
    });

    it('백 h1 룩 이동 시 백 킹사이드 캐슬링 권리만 제거해야 한다', () => {
      const board = [...Array(64).fill(null)];
      board[SQUARE.H1] = { type: PIECE_TYPE.ROOK, color: COLOR.WHITE };
      const state = {
        ...createEmptyState(),
        castlingRights:
          CASTLE.WHITE_KING_SIDE |
          CASTLE.WHITE_QUEEN_SIDE |
          CASTLE.BLACK_KING_SIDE |
          CASTLE.BLACK_QUEEN_SIDE,
        board,
      };

      const nextState = executeMove(state, normalMove(SQUARE.H1, SQUARE.H3));

      expect(nextState.castlingRights).toBe(
        CASTLE.WHITE_QUEEN_SIDE | CASTLE.BLACK_KING_SIDE | CASTLE.BLACK_QUEEN_SIDE,
      );
    });

    it('백 a1 룩 이동 시 백 퀸사이드 캐슬링 권리만 제거해야 한다', () => {
      const board = [...Array(64).fill(null)];
      board[SQUARE.A1] = { type: PIECE_TYPE.ROOK, color: COLOR.WHITE };
      const state = {
        ...createEmptyState(),
        castlingRights:
          CASTLE.WHITE_KING_SIDE |
          CASTLE.WHITE_QUEEN_SIDE |
          CASTLE.BLACK_KING_SIDE |
          CASTLE.BLACK_QUEEN_SIDE,
        board,
      };

      const nextState = executeMove(state, normalMove(SQUARE.A1, SQUARE.A3));

      expect(nextState.castlingRights).toBe(
        CASTLE.WHITE_KING_SIDE | CASTLE.BLACK_KING_SIDE | CASTLE.BLACK_QUEEN_SIDE,
      );
    });

    it('흑 h8 룩 이동 시 흑 킹사이드 캐슬링 권리만 제거해야 한다', () => {
      const board = [...Array(64).fill(null)];
      board[SQUARE.H8] = { type: PIECE_TYPE.ROOK, color: COLOR.BLACK };
      const state = {
        ...createEmptyState(),
        turn: COLOR.BLACK,
        castlingRights:
          CASTLE.WHITE_KING_SIDE |
          CASTLE.WHITE_QUEEN_SIDE |
          CASTLE.BLACK_KING_SIDE |
          CASTLE.BLACK_QUEEN_SIDE,
        board,
      };

      const nextState = executeMove(state, normalMove(SQUARE.H8, SQUARE.H6));

      expect(nextState.castlingRights).toBe(
        CASTLE.WHITE_KING_SIDE | CASTLE.WHITE_QUEEN_SIDE | CASTLE.BLACK_QUEEN_SIDE,
      );
    });

    it('흑 a8 룩 이동 시 흑 퀸사이드 캐슬링 권리만 제거해야 한다', () => {
      const board = [...Array(64).fill(null)];
      board[SQUARE.A8] = { type: PIECE_TYPE.ROOK, color: COLOR.BLACK };
      const state = {
        ...createEmptyState(),
        turn: COLOR.BLACK,
        castlingRights:
          CASTLE.WHITE_KING_SIDE |
          CASTLE.WHITE_QUEEN_SIDE |
          CASTLE.BLACK_KING_SIDE |
          CASTLE.BLACK_QUEEN_SIDE,
        board,
      };

      const nextState = executeMove(state, normalMove(SQUARE.A8, SQUARE.A6));

      expect(nextState.castlingRights).toBe(
        CASTLE.WHITE_KING_SIDE | CASTLE.WHITE_QUEEN_SIDE | CASTLE.BLACK_KING_SIDE,
      );
    });

    it('백이 a8 룩을 캡처하면 흑 퀸사이드 캐슬링 권리를 제거해야 한다', () => {
      const board = [...Array(64).fill(null)];
      board[SQUARE.A1] = { type: PIECE_TYPE.QUEEN, color: COLOR.WHITE };
      board[SQUARE.A8] = { type: PIECE_TYPE.ROOK, color: COLOR.BLACK };
      const state = {
        ...createEmptyState(),
        castlingRights:
          CASTLE.WHITE_KING_SIDE |
          CASTLE.WHITE_QUEEN_SIDE |
          CASTLE.BLACK_KING_SIDE |
          CASTLE.BLACK_QUEEN_SIDE,
        board,
      };

      const nextState = executeMove(state, normalMove(SQUARE.A1, SQUARE.A8));

      expect(nextState.castlingRights).toBe(
        CASTLE.WHITE_KING_SIDE | CASTLE.WHITE_QUEEN_SIDE | CASTLE.BLACK_KING_SIDE,
      );
    });

    it('백 룩이 A1에서 출발해 A8 룩을 잡으면 백과 흑의 퀸사이드 캐슬링 권리를 모두 제거해야 한다', () => {
      const board = [...Array(64).fill(null)];
      board[SQUARE.A1] = { type: PIECE_TYPE.ROOK, color: COLOR.WHITE };
      board[SQUARE.A8] = { type: PIECE_TYPE.ROOK, color: COLOR.BLACK };
      const state = {
        ...createEmptyState(),
        castlingRights:
          CASTLE.WHITE_KING_SIDE |
          CASTLE.WHITE_QUEEN_SIDE |
          CASTLE.BLACK_KING_SIDE |
          CASTLE.BLACK_QUEEN_SIDE,
        board,
      };

      const nextState = executeMove(state, normalMove(SQUARE.A1, SQUARE.A8));

      expect(nextState.castlingRights).toBe(CASTLE.WHITE_KING_SIDE | CASTLE.BLACK_KING_SIDE);
    });

    it('백이 h8 룩을 캡처하면 흑 킹사이드 캐슬링 권리를 제거해야 한다', () => {
      const board = [...Array(64).fill(null)];
      board[SQUARE.H1] = { type: PIECE_TYPE.QUEEN, color: COLOR.WHITE };
      board[SQUARE.H8] = { type: PIECE_TYPE.ROOK, color: COLOR.BLACK };
      const state = {
        ...createEmptyState(),
        castlingRights:
          CASTLE.WHITE_KING_SIDE |
          CASTLE.WHITE_QUEEN_SIDE |
          CASTLE.BLACK_KING_SIDE |
          CASTLE.BLACK_QUEEN_SIDE,
        board,
      };

      const nextState = executeMove(state, normalMove(SQUARE.H1, SQUARE.H8));

      expect(nextState.castlingRights).toBe(
        CASTLE.WHITE_KING_SIDE | CASTLE.WHITE_QUEEN_SIDE | CASTLE.BLACK_QUEEN_SIDE,
      );
    });

    it('흑이 a1 룩을 캡처하면 백 퀸사이드 캐슬링 권리를 제거해야 한다', () => {
      const board = [...Array(64).fill(null)];
      board[SQUARE.A8] = { type: PIECE_TYPE.QUEEN, color: COLOR.BLACK };
      board[SQUARE.A1] = { type: PIECE_TYPE.ROOK, color: COLOR.WHITE };
      const state = {
        ...createEmptyState(),
        turn: COLOR.BLACK,
        castlingRights:
          CASTLE.WHITE_KING_SIDE |
          CASTLE.WHITE_QUEEN_SIDE |
          CASTLE.BLACK_KING_SIDE |
          CASTLE.BLACK_QUEEN_SIDE,
        board,
      };

      const nextState = executeMove(state, normalMove(SQUARE.A8, SQUARE.A1));

      expect(nextState.castlingRights).toBe(
        CASTLE.WHITE_KING_SIDE | CASTLE.BLACK_KING_SIDE | CASTLE.BLACK_QUEEN_SIDE,
      );
    });

    it('흑이 h1 룩을 캡처하면 백 킹사이드 캐슬링 권리를 제거해야 한다', () => {
      const board = [...Array(64).fill(null)];
      board[SQUARE.H8] = { type: PIECE_TYPE.QUEEN, color: COLOR.BLACK };
      board[SQUARE.H1] = { type: PIECE_TYPE.ROOK, color: COLOR.WHITE };
      const state = {
        ...createEmptyState(),
        turn: COLOR.BLACK,
        castlingRights:
          CASTLE.WHITE_KING_SIDE |
          CASTLE.WHITE_QUEEN_SIDE |
          CASTLE.BLACK_KING_SIDE |
          CASTLE.BLACK_QUEEN_SIDE,
        board,
      };

      const nextState = executeMove(state, normalMove(SQUARE.H8, SQUARE.H1));

      expect(nextState.castlingRights).toBe(
        CASTLE.WHITE_QUEEN_SIDE | CASTLE.BLACK_KING_SIDE | CASTLE.BLACK_QUEEN_SIDE,
      );
    });

    it('백 킹사이드 캐슬링 시 킹과 룩 위치를 함께 갱신해야 한다', () => {
      const board = [...Array(64).fill(null)];
      board[SQUARE.E1] = { type: PIECE_TYPE.KING, color: COLOR.WHITE };
      board[SQUARE.H1] = { type: PIECE_TYPE.ROOK, color: COLOR.WHITE };
      const state = {
        ...createEmptyState(),
        castlingRights: CASTLE.WHITE_KING_SIDE,
        board,
      };

      const nextState = executeMove(state, castleKingsideMove(SQUARE.E1, SQUARE.G1));

      expect(nextState.board[SQUARE.E1]).toBeNull();
      expect(nextState.board[SQUARE.H1]).toBeNull();
      expect(nextState.board[SQUARE.G1]).toEqual({ type: PIECE_TYPE.KING, color: COLOR.WHITE });
      expect(nextState.board[SQUARE.F1]).toEqual({ type: PIECE_TYPE.ROOK, color: COLOR.WHITE });
    });

    it('백 퀸사이드 캐슬링 시 킹과 룩 위치를 함께 갱신해야 한다', () => {
      const board = [...Array(64).fill(null)];
      board[SQUARE.E1] = { type: PIECE_TYPE.KING, color: COLOR.WHITE };
      board[SQUARE.A1] = { type: PIECE_TYPE.ROOK, color: COLOR.WHITE };
      const state = {
        ...createEmptyState(),
        castlingRights: CASTLE.WHITE_QUEEN_SIDE,
        board,
      };

      const nextState = executeMove(state, castleQueensideMove(SQUARE.E1, SQUARE.C1));

      expect(nextState.board[SQUARE.E1]).toBeNull();
      expect(nextState.board[SQUARE.A1]).toBeNull();
      expect(nextState.board[SQUARE.C1]).toEqual({ type: PIECE_TYPE.KING, color: COLOR.WHITE });
      expect(nextState.board[SQUARE.D1]).toEqual({ type: PIECE_TYPE.ROOK, color: COLOR.WHITE });
    });

    it('흑 킹사이드 캐슬링 시 킹과 룩 위치를 함께 갱신해야 한다', () => {
      const board = [...Array(64).fill(null)];
      board[SQUARE.E8] = { type: PIECE_TYPE.KING, color: COLOR.BLACK };
      board[SQUARE.H8] = { type: PIECE_TYPE.ROOK, color: COLOR.BLACK };
      const state = {
        ...createEmptyState(),
        turn: COLOR.BLACK,
        castlingRights: CASTLE.BLACK_KING_SIDE,
        board,
      };

      const nextState = executeMove(state, castleKingsideMove(SQUARE.E8, SQUARE.G8));

      expect(nextState.board[SQUARE.E8]).toBeNull();
      expect(nextState.board[SQUARE.H8]).toBeNull();
      expect(nextState.board[SQUARE.G8]).toEqual({ type: PIECE_TYPE.KING, color: COLOR.BLACK });
      expect(nextState.board[SQUARE.F8]).toEqual({ type: PIECE_TYPE.ROOK, color: COLOR.BLACK });
    });

    it('흑 퀸사이드 캐슬링 시 킹과 룩 위치를 함께 갱신해야 한다', () => {
      const board = [...Array(64).fill(null)];
      board[SQUARE.E8] = { type: PIECE_TYPE.KING, color: COLOR.BLACK };
      board[SQUARE.A8] = { type: PIECE_TYPE.ROOK, color: COLOR.BLACK };
      const state = {
        ...createEmptyState(),
        turn: COLOR.BLACK,
        castlingRights: CASTLE.BLACK_QUEEN_SIDE,
        board,
      };

      const nextState = executeMove(state, castleQueensideMove(SQUARE.E8, SQUARE.C8));

      expect(nextState.board[SQUARE.E8]).toBeNull();
      expect(nextState.board[SQUARE.A8]).toBeNull();
      expect(nextState.board[SQUARE.C8]).toEqual({ type: PIECE_TYPE.KING, color: COLOR.BLACK });
      expect(nextState.board[SQUARE.D8]).toEqual({ type: PIECE_TYPE.ROOK, color: COLOR.BLACK });
    });

    it('백이 앙파상하면 도착 칸으로 이동하고 지나친 흑 폰을 제거해야 한다', () => {
      const board = [...Array(64).fill(null)];
      board[SQUARE.E5] = { type: PIECE_TYPE.PAWN, color: COLOR.WHITE };
      board[SQUARE.D5] = { type: PIECE_TYPE.PAWN, color: COLOR.BLACK };
      const state = {
        ...createEmptyState(),
        enPassantSquare: SQUARE.D6,
        board,
      };

      const nextState = executeMove(state, enPassantMove(SQUARE.E5, SQUARE.D6, SQUARE.D5));

      expect(nextState.board[SQUARE.E5]).toBeNull();
      expect(nextState.board[SQUARE.D5]).toBeNull();
      expect(nextState.board[SQUARE.D6]).toEqual({ type: PIECE_TYPE.PAWN, color: COLOR.WHITE });
    });

    it('흑이 앙파상하면 도착 칸으로 이동하고 지나친 백 폰을 제거해야 한다', () => {
      const board = [...Array(64).fill(null)];
      board[SQUARE.D4] = { type: PIECE_TYPE.PAWN, color: COLOR.BLACK };
      board[SQUARE.E4] = { type: PIECE_TYPE.PAWN, color: COLOR.WHITE };
      const state = {
        ...createEmptyState(),
        turn: COLOR.BLACK,
        enPassantSquare: SQUARE.E3,
        board,
      };

      const nextState = executeMove(state, enPassantMove(SQUARE.D4, SQUARE.E3, SQUARE.E4));

      expect(nextState.board[SQUARE.D4]).toBeNull();
      expect(nextState.board[SQUARE.E4]).toBeNull();
      expect(nextState.board[SQUARE.E3]).toEqual({ type: PIECE_TYPE.PAWN, color: COLOR.BLACK });
    });

    it('앙파상 실행 시 halfmoveClock을 0으로 초기화해야 한다', () => {
      const board = [...Array(64).fill(null)];
      board[SQUARE.E5] = { type: PIECE_TYPE.PAWN, color: COLOR.WHITE };
      board[SQUARE.D5] = { type: PIECE_TYPE.PAWN, color: COLOR.BLACK };
      const state = {
        ...createEmptyState(),
        enPassantSquare: SQUARE.D6,
        halfmoveClock: 12,
        board,
      };

      const nextState = executeMove(state, enPassantMove(SQUARE.E5, SQUARE.D6, SQUARE.D5));

      expect(nextState.halfmoveClock).toBe(0);
    });

    it('백 폰이 마지막 랭크에 도달하고 promotion이 주어지면 해당 기물로 승격해야 한다', () => {
      const board = [...Array(64).fill(null)];
      board[SQUARE.E7] = { type: PIECE_TYPE.PAWN, color: COLOR.WHITE };
      const state = { ...createEmptyState(), board };

      const nextState = executeMove(state, normalMove(SQUARE.E7, SQUARE.E8, PIECE_TYPE.ROOK));

      expect(nextState.board[SQUARE.E7]).toBeNull();
      expect(nextState.board[SQUARE.E8]).toEqual({ type: PIECE_TYPE.ROOK, color: COLOR.WHITE });
    });

    it('흑 폰이 마지막 랭크에 도달하고 promotion이 주어지면 해당 기물로 승격해야 한다', () => {
      const board = [...Array(64).fill(null)];
      board[SQUARE.D2] = { type: PIECE_TYPE.PAWN, color: COLOR.BLACK };
      const state = { ...createEmptyState(), turn: COLOR.BLACK, board };

      const nextState = executeMove(state, normalMove(SQUARE.D2, SQUARE.D1, PIECE_TYPE.BISHOP));

      expect(nextState.board[SQUARE.D2]).toBeNull();
      expect(nextState.board[SQUARE.D1]).toEqual({ type: PIECE_TYPE.BISHOP, color: COLOR.BLACK });
    });

    it('프로모션 캡처 시 도착 칸 기물을 교체하고 halfmoveClock을 0으로 초기화해야 한다', () => {
      const board = [...Array(64).fill(null)];
      board[SQUARE.E7] = { type: PIECE_TYPE.PAWN, color: COLOR.WHITE };
      board[SQUARE.F8] = { type: PIECE_TYPE.ROOK, color: COLOR.BLACK };
      const state = { ...createEmptyState(), halfmoveClock: 8, board };

      const nextState = executeMove(state, normalMove(SQUARE.E7, SQUARE.F8, PIECE_TYPE.QUEEN));

      expect(nextState.board[SQUARE.E7]).toBeNull();
      expect(nextState.board[SQUARE.F8]).toEqual({ type: PIECE_TYPE.QUEEN, color: COLOR.WHITE });
      expect(nextState.halfmoveClock).toBe(0);
    });

    it('킹과 룩이 아닌 기물 이동은 캐슬링 권리를 유지해야 한다', () => {
      const board = [...Array(64).fill(null)];
      board[SQUARE.G1] = { type: PIECE_TYPE.KNIGHT, color: COLOR.WHITE };
      const state = {
        ...createEmptyState(),
        castlingRights:
          CASTLE.WHITE_KING_SIDE |
          CASTLE.WHITE_QUEEN_SIDE |
          CASTLE.BLACK_KING_SIDE |
          CASTLE.BLACK_QUEEN_SIDE,
        board,
      };

      const nextState = executeMove(state, normalMove(SQUARE.G1, SQUARE.F3));

      expect(nextState.castlingRights).toBe(
        CASTLE.WHITE_KING_SIDE |
          CASTLE.WHITE_QUEEN_SIDE |
          CASTLE.BLACK_KING_SIDE |
          CASTLE.BLACK_QUEEN_SIDE,
      );
    });

    it('모서리 룩이 아닌 기물을 캡처해도 캐슬링 권리는 유지해야 한다', () => {
      const board = [...Array(64).fill(null)];
      board[SQUARE.D1] = { type: PIECE_TYPE.QUEEN, color: COLOR.WHITE };
      board[SQUARE.D8] = { type: PIECE_TYPE.ROOK, color: COLOR.BLACK };
      const state = {
        ...createEmptyState(),
        castlingRights:
          CASTLE.WHITE_KING_SIDE |
          CASTLE.WHITE_QUEEN_SIDE |
          CASTLE.BLACK_KING_SIDE |
          CASTLE.BLACK_QUEEN_SIDE,
        board,
      };

      const nextState = executeMove(state, normalMove(SQUARE.D1, SQUARE.D8));

      expect(nextState.castlingRights).toBe(
        CASTLE.WHITE_KING_SIDE |
          CASTLE.WHITE_QUEEN_SIDE |
          CASTLE.BLACK_KING_SIDE |
          CASTLE.BLACK_QUEEN_SIDE,
      );
    });

    it('흑이 모서리 룩이 아닌 백 기물을 캡처해도 캐슬링 권리는 유지해야 한다', () => {
      const board = [...Array(64).fill(null)];
      board[SQUARE.D8] = { type: PIECE_TYPE.QUEEN, color: COLOR.BLACK };
      board[SQUARE.D4] = { type: PIECE_TYPE.BISHOP, color: COLOR.WHITE };
      const state = {
        ...createEmptyState(),
        turn: COLOR.BLACK,
        castlingRights:
          CASTLE.WHITE_KING_SIDE |
          CASTLE.WHITE_QUEEN_SIDE |
          CASTLE.BLACK_KING_SIDE |
          CASTLE.BLACK_QUEEN_SIDE,
        board,
      };

      const nextState = executeMove(state, normalMove(SQUARE.D8, SQUARE.D4));

      expect(nextState.castlingRights).toBe(
        CASTLE.WHITE_KING_SIDE |
          CASTLE.WHITE_QUEEN_SIDE |
          CASTLE.BLACK_KING_SIDE |
          CASTLE.BLACK_QUEEN_SIDE,
      );
    });

    it('실행 후에도 원본 state의 보조 상태 값은 변경되지 않아야 한다', () => {
      const board = [...Array(64).fill(null)];
      board[SQUARE.G1] = { type: PIECE_TYPE.KNIGHT, color: COLOR.WHITE };
      const state = {
        ...createEmptyState(),
        castlingRights:
          CASTLE.WHITE_KING_SIDE |
          CASTLE.WHITE_QUEEN_SIDE |
          CASTLE.BLACK_KING_SIDE |
          CASTLE.BLACK_QUEEN_SIDE,
        enPassantSquare: SQUARE.E3,
        halfmoveClock: 5,
        fullmoveNumber: 9,
        board,
      };
      const originalTurn = state.turn;
      const originalCastlingRights = state.castlingRights;
      const originalEnPassantSquare = state.enPassantSquare;
      const originalHalfmoveClock = state.halfmoveClock;
      const originalFullmoveNumber = state.fullmoveNumber;

      executeMove(state, normalMove(SQUARE.G1, SQUARE.F3));

      expect(state.turn).toBe(originalTurn);
      expect(state.castlingRights).toBe(originalCastlingRights);
      expect(state.enPassantSquare).toBe(originalEnPassantSquare);
      expect(state.halfmoveClock).toBe(originalHalfmoveClock);
      expect(state.fullmoveNumber).toBe(originalFullmoveNumber);
    });
  });
});
