# 📋 개별 작업 지침서: 현재 턴 초기화와 전환 규칙 (TASK-003)

**작업 상태**: 대기 중  
**선행 작업**: `[TASK-002]`, `[TASK-059]`  
**후속 작업**: `[TASK-015]`  
**연관 설계**: `[../architecture/tech-stack.md]` (Zustand)

---

## 0. 현재 코드 상태와 이 작업의 위치

- **현재 상태 요약**: 보드와 기물이 화면에 렌더링되지만, 누구의 차례인지 관리하는 상태(State)가 없습니다.
- **이 작업의 책임**: `Zustand`를 사용하여 게임의 현재 턴(`white` 또는 `black`)을 관리하는 스토어를 생성하고, 착수 시 턴이 자동으로 전환되는 기초 기반을 마련합니다.

## 🎯 1. 작업 목표

- **최종 상태**: 화면에 현재 누구의 턴인지 표시되며, 향후 착수 로직과 연동되어 턴이 바뀔 준비가 됩니다.
- **핵심 산출물**: `src/store/useChessStore.ts`

## 🛠️ 3. 상세 기술 사양

- **Store 구조 (Zustand)**:
  ```ts
  interface ChessState {
    gameState: GameState; // @chess-db/shared의 타입
    setGameState: (state: GameState) => void;
    // ... 향후 액션 추가
  }
  ```
- **초기화**: `shared` 패키지의 초기 상태를 `gameState`의 기본값으로 설정합니다.

## ✅ 4. 완료 판정 체크리스트

- [ ] `useChessStore`가 생성되어 전역 상태를 관리한다.
- [ ] UI 상단이나 측면에 현재 턴(White/Black)이 텍스트 또는 아이콘으로 표시된다.


## 💬 9. 추천 커밋 메시지

- `feat: 현재 턴 초기화와 전환 규칙 (TASK-003)`
