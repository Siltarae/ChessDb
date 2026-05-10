# 📋 개별 작업 지침서: 기보 입력 보드 시점 토글 (TASK-101)

**작업 상태**: 대기 중  
**선행 작업**: `[TASK-002]` (표준 시작 포지션 보드 표시), `[TASK-016]` (합법 수 착수와 보드 갱신)  
**후속 작업**: 없음  
**연관 설계**: `[../architecture/project-rules.md]`, `[../architecture/patterns.md]`  
**UI 기준안**: `[../ui/TASK-101-board-orientation-toggle.svg]`

---

## 0. 현재 코드 상태와 이 작업의 위치

- **현재 상태 요약**: `ChessBoard`는 `DISPLAY_SQUARES`를 사용해 백 기준으로만 칸을 렌더링합니다. `BoardShell`은 실제 보드 입력과 상태 표시를 조립하고, 현재 코드의 `MoveHistoryPanel`은 수순 목록 헤더 오른쪽에 되돌리기/다시하기 보조 액션을 이미 갖고 있습니다.
- **이 작업의 책임**: 기보 입력 화면에서 사용자가 아이콘 버튼으로 보드 표시 시점을 백 기준과 흑 기준 사이에서 전환할 수 있게 합니다.
- **이번 작업에서 하지 않는 것**: 분석 보드, 기보 상세 보드, 자동 시점 전환, 사용자 설정 저장, 좌표 라벨 표시, 새 체스 규칙 구현은 다루지 않습니다.
- **경계 메모**:
  - 보드 시점은 화면 표시 옵션입니다. `GameState`, 수순 목록, 현재 턴, 착수 규칙은 변경하지 않습니다.
  - CSS `rotate(180deg)`로 전체 보드를 돌리지 말고, 렌더링할 `Square` 순서만 바꿉니다.
  - 뒤집힌 상태에서도 클릭/드래그/drop target/하이라이트/체크/마지막 착수는 같은 실제 `Square` 값을 사용해야 합니다.

## 🎯 1. 작업 목표

- **최종 상태**: 사용자가 수순 목록 근처의 아이콘 버튼을 눌러 기보 입력 보드를 백 기준 또는 흑 기준으로 즉시 전환해 볼 수 있습니다.
- **이번 작업의 최소 결과물**:
  - `apps/web/src/widgets/chess-board/model/board-coordinate.ts`
  - `apps/web/src/widgets/chess-board/ui/chess-board.tsx`
  - `apps/web/src/widgets/move-history/ui/move-history-panel.tsx`
  - `apps/web/src/widgets/notation-input-layout/ui/board-shell.tsx`
- **성공 기준 (AC)**:
  - 기본 렌더링은 기존처럼 백 기준이다.
  - 흑 기준으로 전환하면 화면 순서가 백 기준의 정반대가 된다.
  - 토글 버튼은 수순 목록 헤더의 보조 액션 영역에서 아이콘 버튼으로 제공된다.
  - 토글 버튼에는 접근성 이름 `보드 시점 전환`이 있다.
  - 시점 변경은 `boardState`, `selectedSquare`, `highlightSquares`, `lastMove`, `checkedKingSquare`의 의미를 바꾸지 않는다.
  - 기존 클릭 착수와 드래그앤드랍 착수 흐름이 유지된다.

## 📂 2. 대상 아티팩트

- **신규 생성**:
  - 필요하면 `apps/web/src/widgets/chess-board/model/board-orientation.ts`
- **수정 대상**:
  - `apps/web/src/widgets/chess-board/model/board-coordinate.ts`
  - `apps/web/src/widgets/chess-board/ui/chess-board.tsx`
  - `apps/web/src/widgets/chess-board/ui/chess-board.spec.tsx`
  - `apps/web/src/widgets/move-history/ui/move-history-panel.tsx`
  - `apps/web/src/widgets/move-history/ui/move-history-panel.spec.tsx`
  - `apps/web/src/widgets/notation-input-layout/ui/sidebar-shell.tsx`
  - `apps/web/src/widgets/notation-input-layout/ui/board-shell.tsx`
  - `apps/web/src/widgets/notation-input-layout/ui/board-shell.spec.tsx`
- **이번 작업에서 수정하지 않음**:
  - `packages/shared/**`: 도메인 좌표와 체스 규칙은 그대로 사용합니다.
  - `apps/web/src/features/make-move/**`: 착수 실행 로직은 기존 `Square` 계약을 유지합니다.
  - `apps/web/src/features/legal-move-highlight/**`: 합법 수 계산과 선택 상태는 표시 시점과 독립적입니다.
  - 분석 보드와 기보 상세 보드 관련 위젯: 이번 Task는 기보 입력 화면 전용입니다.
- **아티팩트 작성 규칙**:
  - 좌표 순서 계산은 보드 위젯의 model 계층에 둡니다.
  - `MoveHistoryPanel`은 버튼을 렌더링하되, 보드 시점 상태의 원천을 소유하지 않습니다.
  - 상태 소유 위치는 `NotationInputLayout` 또는 그 하위 shell 조립 계층 중 한 곳으로 고정합니다.

## 🛠️ 3. 상세 기술 사양

- **공개 함수/타입 시그니처**:

```ts
export type BoardOrientation = 'white' | 'black';

export const WHITE_ORIENTATION_DISPLAY_SQUARES: readonly Square[];
export const BLACK_ORIENTATION_DISPLAY_SQUARES: readonly Square[];

export const getDisplaySquares = (orientation: BoardOrientation): readonly Square[] => {
  // TODO: Phase 5에서 사람이 구현한다.
};
```

```tsx
type ChessBoardProps = {
  readonly boardState: Board;
  readonly orientation?: BoardOrientation;
  readonly highlightSquares: Square[];
  readonly selectedSquare: Square | null;
  readonly onSquareClick: (square: Square) => void;
  readonly lastMove: LastMove | null;
  readonly checkedKingSquare: Square | null;
};
```

- **핵심 조립/흐름 규칙**:
  - `ChessBoard`는 `orientation`을 받아 `getDisplaySquares(orientation)` 결과를 순회합니다.
  - 기본값은 `white`입니다.
  - `black` 기준 표시는 백 기준 표시 배열을 반대로 읽은 순서입니다.
  - 칸의 `label`, `tone`, `piece`, click handler, drag/drop data는 모두 해당 `displaySquare` 자체를 기준으로 계산합니다.
  - `MoveHistoryPanel`은 `onToggleBoardOrientation`과 현재 orientation 표시 상태를 props로 받습니다.
  - `SidebarShell` 또는 상위 layout은 토글 이벤트를 보드 shell까지 전달할 수 있게 상태를 조립합니다.
- **데이터 모델 해석**:
  - `Square`는 도메인 좌표이며 표시 시점과 독립적입니다.
  - `BoardOrientation`은 UI 표시 옵션이며 저장 대상 게임 데이터가 아닙니다.
- **외부 의존성**:
  - `@chess-db/shared`의 `Board`, `Square`
  - 아이콘은 기존 UI/아이콘 의존성이 있으면 우선 사용합니다.
- **import/export 규칙**:
  - 보드 시점 타입과 helper는 `widgets/chess-board` 내부 model에서 export하고, 필요한 상위 shell에서만 import합니다.
  - `packages/shared`에 UI 표시 방향 타입을 추가하지 않습니다.
- **권장 네이밍**:
  - 타입: `BoardOrientation`
  - 값: `boardOrientation`, `nextBoardOrientation`
  - helper: `getDisplaySquares`, `toggleBoardOrientation`
  - props: `orientation`, `onToggleBoardOrientation`
  - 피해야 할 이름: `side`, `turn`, `color`
- **이름별 사용 의도와 적용 시점**:
  - `BoardOrientation`은 보드가 어느 플레이어 쪽에서 보이는지만 표현합니다.
  - `boardOrientation`은 현재 UI 표시 시점 상태입니다.
  - `turn`은 실제 수를 둘 차례이므로 표시 시점 이름으로 쓰지 않습니다.
  - `side`는 프로모션 후보 방향 등 다른 의미와 충돌할 수 있으므로 피합니다.
- **인수 이름 가이드**:
  - `orientation`: `white` 또는 `black` 표시 기준
  - `displaySquare`: 현재 렌더링 중인 실제 도메인 칸
  - `nextBoardOrientation`: 토글 후 적용할 표시 기준
- **짧은 예시 골격**:

```tsx
<ChessBoard
  boardState={displayBoardState}
  orientation={boardOrientation}
  highlightSquares={displayHighlightSquares}
  selectedSquare={displaySelectedSquare}
  onSquareClick={handleSquareClick}
  lastMove={displayLastMove}
  checkedKingSquare={displayCheckedKingSquare}
/>
```

- **필수 describe/it 목록**:
  - `describe('ChessBoard')`
  - `it('기본값은 백 기준으로 칸을 배치해야 한다')`
  - `it('흑 기준에서는 h1부터 a8까지 칸을 배치해야 한다')`
  - `it('흑 기준에서도 클릭 시 실제 Square 값을 전달해야 한다')`
  - `describe('MoveHistoryPanel')`
  - `it('보드 시점 전환 아이콘 버튼을 렌더링해야 한다')`
  - `it('아이콘 버튼을 클릭하면 onToggleBoardOrientation을 호출해야 한다')`
- **최소 테스트 개수**:
  - 최소 5개
- **반드시 포함할 실패 시나리오**:
  - CSS 회전만 적용해 DOM 순서와 클릭 좌표가 바뀌지 않는 경우, 흑 기준 칸 순서 테스트가 실패해야 합니다.
  - 표시 시점 전환 후 클릭이 화면 순서 인덱스를 넘기면, 실제 `Square` 전달 테스트가 실패해야 합니다.
  - 버튼이 접근성 이름 없이 아이콘만 렌더링되면, 버튼 조회 테스트가 실패해야 합니다.

## ⚖️ 4. 기술 제약 및 규칙

- **구조 규칙**:
  - 도메인 좌표 변환은 `packages/shared`가 아니라 `widgets/chess-board` 표시 모델에서 처리합니다.
  - 보드 시점 상태는 수순 기록 상태와 섞지 않습니다.
- **불변성/상태 규칙**:
  - `WHITE_ORIENTATION_DISPLAY_SQUARES`와 `BLACK_ORIENTATION_DISPLAY_SQUARES`는 렌더링 중 변경하지 않습니다.
  - 토글은 `boardOrientation` 상태 하나만 바꿉니다.
- **범위 규칙**:
  - 자동 시점 전환, 설정 저장, URL 쿼리 반영은 구현하지 않습니다.
  - 분석 보드와 상세 보드는 이번 Task에서 수정하지 않습니다.
- **UI 규칙**:
  - 버튼은 텍스트 버튼이 아니라 아이콘 버튼입니다.
  - 접근성 이름은 `보드 시점 전환`으로 고정합니다.
  - 수순 목록의 되돌리기/다시하기 버튼과 같은 보조 액션 그룹 안에 배치합니다.

## 🧪 5. 검증 시나리오 및 단언

1. **정상 시나리오: 기본 백 기준 표시**
   - `ChessBoard`를 orientation 없이 렌더링한다.
   - 첫 칸은 `a8`, 마지막 칸은 `h1`이다.

2. **정상 시나리오: 흑 기준 표시**
   - `ChessBoard`를 `orientation="black"`으로 렌더링한다.
   - 첫 칸은 `h1`, 마지막 칸은 `a8`이다.

3. **실패 시나리오: 클릭 좌표 오염**
   - 흑 기준에서 화면 첫 칸을 클릭한다.
   - 콜백은 화면 인덱스가 아니라 실제 `SQUARE.H1`을 받는다.

4. **경계 시나리오: 기존 표시 상태 유지**
   - 흑 기준에서도 선택 칸, 합법 수 칸, 마지막 착수 칸, 체크받은 왕 칸이 실제 좌표 기준으로 class를 유지한다.

5. **UI 시나리오: 수순 목록 근처 토글**
   - `MoveHistoryPanel` 헤더의 보조 액션 영역에 접근성 이름 `보드 시점 전환` 버튼이 있다.
   - 클릭하면 `onToggleBoardOrientation`이 호출된다.

## 🚀 6. 권장 작업 순서

1. `BoardOrientation` 타입과 `getDisplaySquares` helper를 보드 model 계층에 추가하거나 기존 `board-coordinate.ts`에 넣습니다.
2. `ChessBoard`가 `orientation` props를 받아 표시 배열을 선택하도록 바꿉니다.
3. `ChessBoard` 테스트에 흑 기준 칸 순서와 클릭 좌표 단언을 추가합니다.
4. 상위 shell에 `boardOrientation` 상태와 `toggleBoardOrientation` action을 둡니다.
5. `MoveHistoryPanel` 헤더의 보조 액션 영역에 아이콘 버튼을 추가하고 props로 토글 action을 연결합니다.
6. `BoardShell`까지 `orientation`을 전달합니다.
7. 기존 클릭, 드래그, 하이라이트, 체크 표시 회귀 테스트를 실행합니다.

- **검증 실행**:
  - `pnpm --filter @chess-db/web test`
  - `pnpm --filter @chess-db/web test:e2e`
  - `pnpm --filter @chess-db/web lint`
  - `pnpm --filter @chess-db/web format:check`
  - `pnpm --filter @chess-db/web build`

## ✅ 7. 완료 판정 체크리스트

- [ ] 보드 시점 타입과 표시 순서 helper가 추가되었다.
- [ ] 기본 보드 표시는 기존 백 기준을 유지한다.
- [ ] 흑 기준 표시에서 칸 순서가 정확히 반전된다.
- [ ] 흑 기준에서도 클릭과 드래그가 실제 `Square` 기준으로 동작한다.
- [ ] 수순 목록 헤더 보조 액션 영역에 접근 가능한 아이콘 버튼이 있다.
- [ ] 시점 토글이 게임 상태, 수순, 턴, 착수 규칙을 바꾸지 않는다.
- [ ] 지정한 검증 명령이 통과한다.

## 💡 8. 구현 힌트 및 참고

- **직접 근거 문서**:
  - `[../requirements/tasks/TASK-101.md]`
  - `[../requirements/features/FEATURE-002.md]`
  - `[../ui/TASK-101-board-orientation-toggle.svg]`
- **유사 구현**:
  - `apps/web/src/widgets/chess-board/model/board-coordinate.ts`
  - `apps/web/src/widgets/chess-board/ui/chess-board.tsx`
  - `apps/web/src/widgets/move-history/ui/move-history-panel.tsx`
- **특히 주의할 점**:
  - `turn`과 `orientation`을 섞지 않습니다.
  - 버튼을 수순 조작 버튼처럼 보이게 만들 수는 있지만, 실제 수순 선택 상태를 변경하면 안 됩니다.
  - `toSquareLabel`과 `getSquareTone`은 실제 칸 기준 helper로 유지합니다.

## 💬 9. 추천 커밋 메시지

- `feat: 기보 입력 보드 시점 토글을 추가 (TASK-101)`
