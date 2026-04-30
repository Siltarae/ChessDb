# 📋 개별 작업 지침서: 체크 상태 표시 (TASK-098)

**작업 상태**: 대기 중  
**선행 작업**: `[TASK-016]` (합법 수 착수와 보드 갱신), `[TASK-010]` (체크 상태 계산)  
**후속 작업**: `[TASK-097]` (착수 후 게임 종료 상태 감지 및 표시)  
**연관 설계**: `[../architecture/project-rules.md]`  
**UI 기준안**: `[../ui/TASK-098-check-status.svg]`

---

## 0. 현재 코드 상태와 이 작업의 위치

- **현재 상태 요약**: shared 엔진은 체크 상태를 계산할 수 있지만, 웹 보드는 체크받은 왕이나 상태 메시지를 표시하지 않습니다.
- **이 작업의 책임**: 착수 후 현재 상태가 체크인지 계산하고, 체크받은 왕의 칸과 상태 메시지를 표시합니다.
- **이번 작업에서 하지 않는 것**: 체크메이트 종료 배너와 새 착수 차단은 `[TASK-097]`에서 다룹니다.
- **UI 선행 규칙**: 구현 전에 `docs/ui/TASK-098-check-status.svg`를 먼저 작성하고, 왕 칸 강조와 마지막 착수 하이라이트의 우선순위를 합의합니다.

## 🎯 1. 작업 목표

- **최종 상태**: 현재 턴의 왕이 체크 상태이면 보드와 상태 영역에서 즉시 확인할 수 있습니다.
- **이번 작업의 최소 결과물**:
  - `apps/web/src/features/check-status/model/use-check-status.ts`
  - `apps/web/src/widgets/game-status/ui/check-status-badge.tsx`
  - `apps/web/src/widgets/chess-board/ui/chess-board.tsx`
  - `docs/ui/TASK-098-check-status.svg`
- **성공 기준 (AC)**:
  - 체크 상태이면 체크받은 왕의 칸이 표시된다.
  - 체크 상태 배지 또는 문구가 현재 턴 정보와 함께 표시된다.
  - 체크가 해소되면 체크 표시가 제거된다.
  - 마지막 착수 표시, 선택 표시, 합법 수 하이라이트와 체크 표시의 우선순위가 유지된다.

## 📂 2. 대상 아티팩트

- **신규 생성**:
  - `apps/web/src/features/check-status/model/use-check-status.ts`
  - `apps/web/src/widgets/game-status/ui/check-status-badge.tsx`
  - `docs/ui/TASK-098-check-status.svg`
- **수정 대상**:
  - `apps/web/src/widgets/chess-board/ui/chess-board.tsx`
  - `apps/web/src/entities/game/model/game-store.ts`
  - `apps/web/src/pages/notation-input-page.tsx`
- **이번 작업에서 수정하지 않음**:
  - `apps/web/src/widgets/game-status/ui/game-result-banner.tsx`

## 🛠️ 3. 상세 기술 사양

- 현재 `GameState`와 `turn` 기준으로 shared 체크 판정 API를 호출합니다.
- 체크받은 왕의 square를 찾는 helper를 둡니다.
- 체크 표시는 마지막 착수 표시보다 높은 우선순위를 갖되, 선택/합법 수 표시를 완전히 가리지 않도록 SVG에서 규칙을 정합니다.
- 체크 상태 문구는 현재 공격받는 쪽을 기준으로 작성합니다.
- 체크가 아닌 상태에서는 DOM에 체크 배지가 남지 않도록 합니다.

## 🧪 4. 검증 시나리오 및 단언

1. **정상 시나리오: 체크 표시**
   - 착수 후 상대 킹이 체크 상태가 된다.
   - 왕의 칸과 체크 상태 배지가 표시된다.

2. **정상 시나리오: 체크 해소**
   - 체크 상태에서 합법 수로 체크를 해소한다.
   - 체크 표시가 사라진다.

3. **경계 시나리오: 하이라이트 우선순위**
   - 마지막 착수 표시와 체크 왕 칸 표시가 동시에 존재한다.
   - 체크 상태를 식별할 수 있어야 한다.

## 🚀 5. 권장 작업 순서

1. `docs/ui/TASK-098-check-status.svg`로 체크 표시의 시각 우선순위를 먼저 합의합니다.
2. 현재 상태의 체크 여부와 체크받은 왕 square를 계산하는 selector를 작성합니다.
3. 보드 square 렌더링에 체크 상태 스타일을 연결합니다.
4. 상태 배지를 페이지에 배치합니다.
5. 체크 표시 생성/해제와 하이라이트 공존 테스트를 작성합니다.

- **검증 실행**:
  - `pnpm --filter @chess-db/web test`
  - `pnpm --filter @chess-db/web build`

## ✅ 6. 완료 판정 체크리스트

- [ ] 구현 전에 `docs/ui/TASK-098-check-status.svg`가 작성되어 있다.
- [ ] 체크받은 왕의 칸이 표시된다.
- [ ] 체크 상태 배지 또는 문구가 표시된다.
- [ ] 체크 해소 후 표시가 제거된다.
- [ ] 마지막 착수/선택/합법 수 하이라이트와 시각적으로 충돌하지 않는다.

## 💬 9. 추천 커밋 메시지

- `feat: 체크 상태 표시 추가`
