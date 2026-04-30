# 📋 개별 작업 지침서: 착수 후 게임 종료 상태 감지 및 표시 (TASK-097)

**작업 상태**: 대기 중  
**선행 작업**: `[TASK-016]` (합법 수 착수와 보드 갱신), `[TASK-061]` (승패 및 무승부 판정), `[TASK-098]` (체크 상태 표시)  
**후속 작업**: `[TASK-062]` (SAN 기보 변환), `[TASK-017]` (수순 기록)  
**연관 설계**: `[../architecture/project-rules.md]`  
**UI 기준안**: `[../ui/TASK-097-game-end-status.svg]`

---

## 0. 현재 코드 상태와 이 작업의 위치

- **현재 상태 요약**: shared 엔진은 게임 결과를 판정할 수 있지만, 웹 UI는 착수 후 종료 상태를 표시하거나 입력을 막지 않습니다.
- **이 작업의 책임**: 착수 후 현재 상태의 게임 결과를 계산하고, 종료 상태를 화면에 표시하며, 새 착수 입력 가능 여부를 제어합니다.
- **이번 작업에서 하지 않는 것**: 정식 저장 메타데이터 입력은 `[TASK-026]`에서 다룹니다.
- **UI 선행 규칙**: 구현 전에 `docs/ui/TASK-097-game-end-status.svg`를 먼저 작성하고, 종료 배너/패널 위치와 보드 비활성 상태를 합의합니다.

## 🎯 1. 작업 목표

- **최종 상태**: 체크메이트, 스테일메이트, 50수 규칙, 3회 반복, 기물 부족 무승부가 발생하면 사용자가 즉시 종료 상태를 볼 수 있습니다.
- **이번 작업의 최소 결과물**:
  - `apps/web/src/features/game-result/model/use-game-result-status.ts`
  - `apps/web/src/widgets/game-status/ui/game-result-banner.tsx`
  - `apps/web/src/entities/game/model/game-store.ts`
  - `docs/ui/TASK-097-game-end-status.svg`
- **성공 기준 (AC)**:
  - 착수 완료 후 `getGameResult` 결과가 store 또는 selector에 반영된다.
  - 종료 상태이면 결과와 종료 사유가 화면에 표시된다.
  - 종료 상태에서는 새 착수 입력이 막히거나 비활성 상태로 표현된다.
  - 되돌리기/다시하기 이후 현재 반수에 맞게 종료 상태가 다시 계산된다.

## 📂 2. 대상 아티팩트

- **신규 생성**:
  - `apps/web/src/features/game-result/model/use-game-result-status.ts`
  - `apps/web/src/widgets/game-status/ui/game-result-banner.tsx`
  - `docs/ui/TASK-097-game-end-status.svg`
- **수정 대상**:
  - `apps/web/src/entities/game/model/game-store.ts`
  - `apps/web/src/features/make-move/model/use-make-move.ts`
  - `apps/web/src/pages/notation-input-page.tsx`
  - `apps/web/src/widgets/chess-board/ui/chess-board.tsx`
- **이번 작업에서 수정하지 않음**:
  - `apps/web/src/features/game-metadata/**`
  - `apps/web/src/features/save-game/**`

## 🛠️ 3. 상세 기술 사양

- `getGameResult(gameState, repetitionHistory)`를 웹 상태에서 호출할 진입점을 둡니다.
- 반복 판정용 `repetitionHistory`는 `positionFingerprint` 기준 누적 count와 호환되도록 관리합니다.
- 종료 결과는 표시용 label과 내부 result type을 분리합니다.
- 종료 상태에서는 보드 클릭 착수를 막고, 수순 탐색은 허용합니다.
- 되돌리기/다시하기로 현재 반수가 바뀌면 해당 시점의 결과를 다시 계산합니다.

## 🧪 4. 검증 시나리오 및 단언

1. **정상 시나리오: 체크메이트 표시**
   - 체크메이트가 되는 착수 후 결과 배너가 표시된다.
   - 보드의 새 착수 입력은 비활성화된다.

2. **정상 시나리오: 무승부 표시**
   - 스테일메이트 또는 기물 부족 상태를 만든다.
   - 무승부 종료 사유가 표시된다.

3. **경계 시나리오: 되돌리기 후 종료 해제**
   - 종료 상태에서 한 수 되돌린다.
   - 종료 배너는 현재 시점에 맞게 사라진다.

## 🚀 5. 권장 작업 순서

1. `docs/ui/TASK-097-game-end-status.svg`로 종료 표시 위치와 입력 비활성 상태를 먼저 합의합니다.
2. 웹 store에서 반복 이력과 현재 결과 selector를 정리합니다.
3. 착수 성공 후 결과 계산을 연결합니다.
4. 종료 배너와 보드 입력 차단을 연결합니다.
5. 되돌리기/다시하기와 종료 상태 재계산 테스트를 작성합니다.

- **검증 실행**:
  - `pnpm --filter @chess-db/web test`
  - `pnpm --filter @chess-db/web build`

## ✅ 6. 완료 판정 체크리스트

- [ ] 구현 전에 `docs/ui/TASK-097-game-end-status.svg`가 작성되어 있다.
- [ ] 착수 후 게임 종료 상태가 계산된다.
- [ ] 종료 결과와 사유가 UI에 표시된다.
- [ ] 종료 상태에서 새 착수 입력이 막힌다.
- [ ] 되돌리기/다시하기 후 종료 표시가 현재 시점과 일치한다.

## 💬 9. 추천 커밋 메시지

- `feat: 착수 후 게임 종료 상태 표시 추가`
