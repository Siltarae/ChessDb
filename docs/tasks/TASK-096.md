# 📋 개별 작업 지침서: 프로모션 기물 선택 UI (TASK-096)

**작업 상태**: 대기 중  
**선행 작업**: `[TASK-016]` (합법 수 착수와 보드 갱신), `[TASK-014]` (프로모션 처리)  
**후속 작업**: `[TASK-098]` (체크 상태 표시), `[TASK-062]` (SAN 기보 변환)  
**연관 설계**: `[../architecture/project-rules.md]`  
**UI 기준안**: `[../ui/TASK-096-promotion-piece-selection.svg]`

---

## 0. 현재 코드 상태와 이 작업의 위치

- **현재 상태 요약**: shared 엔진은 프로모션 결과 기물을 처리할 수 있지만, 웹 UI에는 사용자가 승격 기물을 선택하는 흐름이 없습니다.
- **이 작업의 책임**: 프로모션 착수 시 승격 기물 선택 UI를 표시하고, 선택한 기물을 `Move.promotion`에 반영해 착수를 확정합니다.
- **이번 작업에서 하지 않는 것**: SAN 문자열 생성과 수순 목록 기록은 `[TASK-062]`, `[TASK-017]`에서 다룹니다.
- **UI 선행 규칙**: 구현 전에 `docs/ui/TASK-096-promotion-piece-selection.svg`를 먼저 작성하고, 보드 위 팝오버/다이얼로그 위치와 선택 상태를 합의합니다.

## 🎯 1. 작업 목표

- **최종 상태**: 폰이 마지막 랭크에 도달하는 수를 둘 때 사용자가 퀸, 룩, 비숍, 나이트 중 하나를 선택한 뒤 착수가 확정됩니다.
- **이번 작업의 최소 결과물**:
  - `apps/web/src/features/promotion-selection/model/use-promotion-selection.ts`
  - `apps/web/src/features/promotion-selection/ui/promotion-piece-selector.tsx`
  - `apps/web/src/features/make-move/model/use-make-move.ts`
  - `apps/web/src/entities/game/model/game-store.ts`
- **성공 기준 (AC)**:
  - 프로모션 가능한 착수에서 승격 기물 선택 UI가 열린다.
  - 퀸, 룩, 비숍, 나이트 중 하나만 선택할 수 있다.
  - 선택 전에는 착수가 확정되지 않고, 선택 후 선택한 기물로 착수가 실행된다.
  - 선택한 `promotion` 값이 후속 SAN 변환과 수순 기록에 전달될 수 있다.

## 📂 2. 대상 아티팩트

- **신규 생성**:
  - `apps/web/src/features/promotion-selection/model/use-promotion-selection.ts`
  - `apps/web/src/features/promotion-selection/ui/promotion-piece-selector.tsx`
  - `docs/ui/TASK-096-promotion-piece-selection.svg`
- **수정 대상**:
  - `apps/web/src/features/make-move/model/use-make-move.ts`
  - `apps/web/src/entities/game/model/game-store.ts`
  - `apps/web/src/widgets/chess-board/ui/chess-board.tsx`
  - `apps/web/src/pages/notation-input-page.tsx`
- **이번 작업에서 수정하지 않음**:
  - `packages/shared/src/notation/san-converter.ts`
  - `apps/web/src/features/move-history/**`

## 🛠️ 3. 상세 기술 사양

- `getLegalMoves` 결과 중 같은 `from`/`to`를 가지며 `promotion`만 다른 후보를 프로모션 선택 후보로 해석합니다.
- 프로모션 후보가 있으면 즉시 `executeMove`를 호출하지 않고 `pendingPromotionMove` 상태를 둡니다.
- 사용자가 승격 기물을 선택하면 해당 `Move` 전체를 `executeMove`에 넘깁니다.
- 선택 UI가 열린 동안 다른 보드 입력은 충돌하지 않도록 막습니다.
- 취소 정책은 SVG 합의에서 정하되, 최소 구현은 보드 외부 클릭 또는 원래 기물 재선택으로 선택을 해제할 수 있어야 합니다.

## 🧪 4. 검증 시나리오 및 단언

1. **정상 시나리오: 퀸 프로모션**
   - 프로모션 가능한 칸을 클릭한다.
   - 선택 UI에서 퀸을 선택한다.
   - 보드에는 퀸이 생성되고 폰은 사라진다.

2. **정상 시나리오: 언더프로모션**
   - 같은 프로모션 상황에서 나이트를 선택한다.
   - 실행된 `Move.promotion`은 나이트다.

3. **실패 시나리오: 선택 전 착수 확정**
   - 프로모션 칸을 클릭한 직후 아직 기물을 고르지 않았다.
   - 보드 상태와 턴은 바뀌지 않는다.

## 🚀 5. 권장 작업 순서

1. `docs/ui/TASK-096-promotion-piece-selection.svg`로 선택 UI 위치와 상태를 먼저 합의합니다.
2. 프로모션 후보를 감지하는 helper를 `use-make-move` 주변에 둡니다.
3. `pendingPromotionMove`와 선택 완료 액션을 store 또는 feature 훅에 추가합니다.
4. 선택 UI를 페이지에 조합하고 보드 입력 잠금 규칙을 연결합니다.
5. 프로모션 선택 전/후 테스트를 작성합니다.

- **검증 실행**:
  - `pnpm --filter @chess-db/web test`
  - `pnpm --filter @chess-db/web build`

## ✅ 6. 완료 판정 체크리스트

- [ ] 구현 전에 `docs/ui/TASK-096-promotion-piece-selection.svg`가 작성되어 있다.
- [ ] 프로모션 후보에서 선택 UI가 열린다.
- [ ] 선택 전에는 착수가 확정되지 않는다.
- [ ] 선택한 승격 기물이 `Move.promotion`으로 실행된다.
- [ ] 프로모션 UI가 열린 동안 보드 입력 충돌이 없다.

## 💬 9. 추천 커밋 메시지

- `feat: 프로모션 기물 선택 UI 추가`
