# 📋 개별 작업 지침서: 현재 턴 초기화와 전환 규칙 (TASK-003)

**작업 상태**: 대기 중
**선행 작업**: `[TASK-002]` (표준 시작 포지션 보드 표시), `[TASK-059]` (GameState)
**후속 작업**: `[TASK-015]` (선택 기물 합법 수 하이라이트), `[TASK-016]` (착수와 보드 갱신)
**연관 설계**: `[../architecture/project-rules.md]`, `[../architecture/directory-structure.md]`
**UI 기준안**: `[../ui/FEATURE-002-board-interaction.svg]`

---

## 0. 현재 코드 상태와 이 작업의 위치

- **현재 상태 요약**: 보드 렌더링은 가능할 수 있지만, 현재 턴을 어떤 상태로 초기화하고 후속 착수 로직이 어떻게 갱신할지 store 기준이 명확하지 않습니다.
- **이 작업의 책임**: 현재 턴 상태의 초기값, selector, 착수 결과를 반영할 store 계약을 고정합니다.
- **이번 작업에서 하지 않는 것**: 실제 클릭 착수, 합법 수 실행, 승패 판정, 종료 상태 고정은 후속 태스크에서 처리합니다.
- **경계 메모**:
  - 턴 상태 계약만 다룹니다.
  - 실제 착수 후 턴 전환은 `TASK-016`에서 `TASK-003`의 store 계약을 사용해 검증합니다.

## 🎯 1. 작업 목표

- **최종 상태**: 새 기보의 현재 턴이 백으로 초기화되고, 후속 착수 로직이 같은 store 계약으로 턴을 갱신할 수 있습니다.
- **이번 작업의 최소 결과물**:
  - `apps/web/src/entities/game/model/game-store.ts`
- **성공 기준 (AC)**:
  - 초기 턴은 백으로 시작한다.
  - 착수 결과의 `turn` 값을 store에 반영할 액션 또는 갱신 지점이 준비되어 있다.

## 📂 2. 대상 아티팩트

- **수정 대상**:
  - `apps/web/src/entities/game/model/game-store.ts`
- **이번 작업에서 수정하지 않음**:
  - `apps/web/src/widgets/notation-input-layout/**`
  - `apps/web/src/features/move-history/**`
- **아티팩트 작성 규칙**:
  - 파일 경로는 `apps/web`, `apps/api`, `packages/shared` 기준의 실제 예상 위치로 고정합니다.
  - 후속 태스크 책임 파일은 같은 폴더에 있더라도 이번 문서 범위에서 같이 닫지 않습니다.

## 🛠️ 3. 상세 기술 사양

- **핵심 구현 대상**:
  - `game-store`에 `currentTurn` selector를 노출합니다.
  - 후속 착수 액션이 shared engine 결과의 `turn`을 store에 반영할 수 있도록 `applyGameState` 또는 동등한 갱신 지점을 준비합니다.
- **데이터 모델 해석**:
  - 턴 상태는 `white | black` 두 값만 가집니다.
- **외부 의존성**:
  - `zustand`
  - `@chess-db/shared` `Color` 타입
- **import/export 규칙**:
  - 턴 계산을 UI 컴포넌트에 두지 않고 store와 shared engine 결과를 기준으로만 갱신합니다.
- **권장 네이밍**:
  - `currentTurn`, `applyGameState`
- **이름별 사용 의도와 적용 시점**:
  - `currentTurn`은 화면 표시와 조건 분기의 공통 기준입니다.
- **인수 이름 가이드**:
  - `nextTurn`, `currentTurn`
- **짧은 예시 골격**:

```tsx
const currentTurn = useGameStore((state) => state.currentTurn);
```

- **필수 describe/it 목록**:
  - `describe('current turn state')`
  - `it('초기 턴이 white다')`
  - `it('외부에서 받은 다음 게임 상태의 turn을 store에 반영한다')`
- **최소 테스트 개수**:
  - 최소 2개
- **반드시 포함할 실패 시나리오**:
  - 초기 턴이 백이 아니거나 외부 상태 반영 후 턴 값이 갱신되지 않는 경우

## ⚖️ 4. 기술 제약 및 규칙

- 턴 계산을 UI에서 중복 구현하지 않습니다.
- 종료 상태나 체크 표시를 함께 붙이지 않습니다.

## 🧪 5. 검증 시나리오 및 단언

1. **정상 시나리오: 초기 턴 상태**
   - store 초기화
   - 현재 턴이 백이다.

2. **정상 시나리오: 후속 착수 결과 반영 계약**
   - 다음 게임 상태의 `turn`이 흑인 상태를 store에 반영한다.
   - store의 현재 턴이 흑으로 변경된다.

3. **실패 시나리오: store 갱신 누락**
   - 다음 게임 상태를 반영했는데 `currentTurn`이 이전 값을 유지한다.
   - store 테스트가 실패한다.

## 🚀 6. 권장 작업 순서

1. store에 currentTurn selector를 정리합니다.
2. 후속 착수 로직이 호출할 상태 반영 액션을 정리합니다.
3. 초기/외부 상태 반영 테스트를 추가합니다.

- **검증 실행**:
  - `pnpm --filter @chess-db/web test`
  - `pnpm --filter @chess-db/web build`

## ✅ 7. 완료 판정 체크리스트

- [ ] 초기 턴이 백이다.
- [ ] 후속 착수 로직이 사용할 턴 갱신 계약이 준비되어 있다.

## 💬 9. 추천 커밋 메시지

- `feat: 현재 턴 초기화와 전환 규칙을 추가 (TASK-003)`
