# 📋 개별 작업 지침서: 수 실행 및 상태 업데이트 (TASK-060)

**작업 상태**: 대기 중  
**선행 작업**: `[TASK-004]~[TASK-010]` (기물 이동 및 체크 판정)  
**후속 작업**: `[TASK-061]` (승패 판정)  
**연관 설계**: `[../architecture/patterns.md]`, `[../architecture/project-rules.md]`

---

## 0. 현재 코드 상태와 이 작업의 위치

- **현재 상태 요약**: 각 기물별 이동 가능 칸을 계산하는 제너레이터(`getPawnMoves` 등)와 체크 판정 로직(`isCheck`)이 준비되었습니다. 하지만 실제 수를 두었을 때 `GameState`를 새로운 상태로 전환하는 로직은 부재합니다.
- **이 작업의 책임**: 특정 착수(`Move`) 정보를 바탕으로 원본 상태를 변경하지 않고(Immutability), 규칙에 따라 업데이트된 새로운 `GameState` 객체를 생성하여 반환합니다.
- **이번 작업에서 하지 않는 것**: 해당 수가 합법적인지 검증하는 단계(`isLegalMove`)는 선행 태스크 결과물을 활용하며, 이 태스크는 '실행 및 상태 전이' 자체에 집중합니다.

## 🎯 1. 작업 목표

- **최종 상태**: `executeMove(state, move)` 함수를 통해 기물 이동, 캡처 처리, 턴 전환, 캐슬링/앙파상 권리 갱신이 반영된 새로운 게임 상태를 얻습니다.
- **이번 작업의 최소 결과물**:
  - `packages/shared/src/logic/engine/move-executor.ts` 생성.
  - `packages/shared/src/logic/engine/move-executor.spec.ts` 테스트 통과.
- **성공 기준 (AC)**:
  - 원본 `state` 객체는 절대 수정되지 않아야 한다(불변성 유지).
  - 폰 이동이나 캡처 발생 시 `halfmoveClock`이 0으로 초기화된다.
  - 킹이나 룩 이동 시 해당 방향의 캐슬링 권리(`castlingRights` 비트)가 상실된다.
  - 흑의 수가 완료될 때마다 `fullmoveNumber`가 1 증가한다.

## 📂 2. 대상 아티팩트

- **신규 생성**:
  - `packages/shared/src/logic/engine/move-executor.ts`
  - `packages/shared/src/logic/engine/move-executor.spec.ts`
- **수정 대상**:
  - `packages/shared/src/logic/engine/index.ts` (export 추가)

## 🛠️ 3. 상세 기술 사양

- **핵심 타입 및 함수 시그니처**:

  ```ts
  import { GameState, Square } from '../../models/game-state.js';

  export interface Move {
    readonly from: Square;
    readonly to: Square;
    readonly promotion?: PieceType; // Optional
  }

  export function executeMove(state: GameState, move: Move): GameState;
  ```

- **핵심 상태 전이 규칙**:
  1. **보드 업데이트**: `from` 위치를 `null`로, `to` 위치를 이동한 기물로 설정.
  2. **턴 전환**: `turn`을 반대 색상으로 변경.
  3. **캐슬링 권리 갱신**: 킹 이동 시 두 방향 모두 상실, 룩 이동/캡처 시 해당 구석 방향 상실. (비트 연산 사용)
  4. **앙파상 타겟**: 폰이 2칸 전진했을 경우만 해당 배후 칸 인덱스 설정, 나머지는 `null`.
  5. **수 카운터**: 폰 이동/캡처 시 `halfmoveClock = 0`, 그 외엔 `+1`. 흑의 수 완료 시 `fullmoveNumber + 1`.
- **권장 네이밍**:
  - `executeMove`: 메인 상태 전이 함수.
  - `updateCastlingRights`: 캐슬링 비트 업데이트 내부 헬퍼.
- **인수 이름 가이드**:
  - `state`: 현재 시점의 읽기 전용 게임 상태.
  - `move`: 실행할 착수 정보 (시작점, 도착점).
- **필수 describe/it 목록**:
  - describe: `executeMove`
    - it: `일반 기물 이동 시 턴이 전환되고 보드가 업데이트되어야 한다`
    - it: `폰 이동 시 halfmoveClock이 0으로 초기화되어야 한다`
    - it: `킹 이동 시 해당 색상의 모든 캐슬링 권리가 상실되어야 한다`
    - it: `흑의 이동이 완료되면 fullmoveNumber가 1 증가해야 한다`
- **최소 테스트 개수**: 6개
- **반드시 포함할 실패 시나리오**:
  - **불변성 위반**: `state.board` 배열을 직접 수정(push/splice)하여 원본 데이터가 변하는 상황 방지.
  - **캐슬링 비트 오류**: 룩이 잡혔을 때 상대방의 캐슬링 권리가 사라지지 않거나, 잘못된 비트가 꺼지는 상황 방지.

## ⚖️ 4. 기술 제약 및 규칙

- **불변성 강제**: 반드시 `...state` 전개 연산자나 새로운 객체 생성을 통해 상태를 반환합니다.
- **성능**: `state.board` 복사 시 `[...state.board]`를 사용하며, 불필요한 깊은 복사는 지양합니다.
- **비트 연산**: `castlingRights`는 `CASTLE` 상수를 활용한 비트 AND/NOT 연산으로 처리합니다.

## 🧪 5. 검증 시나리오 및 단언

1. **정상 시나리오: 백 폰 e4 이동**
   - Given: 초기 상태, Move(e2 -> e4)
   - Then: `turn`은 BLACK, `enPassantSquare`는 e3, `halfmoveClock`은 0.

2. **실패 시나리오: 원본 오염**
   - Given: 초기 상태 호출 후
   - Then: `state.turn`이 여전히 WHITE인지 확인 (불변성 검증).

## ✅ 7. 완료 판정 체크리스트

- [ ] `executeMove`가 모든 상태(보드, 턴, 캐슬링, 앙파상, 클럭)를 정확히 전이시킨다.
- [ ] 원본 `GameState` 객체가 수정되지 않았음을 테스트로 확인했다.
- [ ] 모든 import에 `.js` 확장자가 포함되어 있다.

## 💬 9. 추천 커밋 메시지

- `feat: 수 실행 및 게임 상태 전이 로직 구현 (TASK-060)`
