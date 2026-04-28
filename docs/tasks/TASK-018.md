# 📋 개별 작업 지침서: 되돌리기 (TASK-018)

**작업 상태**: 대기 중
**선행 작업**: `[TASK-017]` (수순 기록)
**후속 작업**: `[TASK-019]` (다시하기)
**연관 설계**: `[../architecture/project-rules.md]`, `[../architecture/directory-structure.md]`
**UI 기준안**: `[../ui/FEATURE-002-board-interaction.svg]`

---

## 0. 현재 코드 상태와 이 작업의 위치

- **현재 상태 요약**: 수순 이력은 쌓이지만 현재 보고 있는 시점을 과거 반수로 옮기는 포인터와 UI가 없습니다.
- **이 작업의 책임**: 현재 기보 포인터를 이전 반수로 한 단계 이동시키고, 보드 상태·현재 턴·선택된 수순 인덱스를 같은 시점으로 되돌립니다.
- **이번 작업에서 하지 않는 것**: 앞으로 이동하는 다시하기와 되돌린 뒤 새 수를 두었을 때 미래 수열을 정리하는 책임은 `[TASK-019]`로 남깁니다.
- **경계 메모**:
  - 이 문서는 포인터를 뒤로 움직이는 규칙과 UI disabled 조건까지만 다룹니다. 다시하기 버튼 활성화 규칙은 다음 태스크에서 닫습니다.
  - 되돌리기 액션은 우측 수순 목록 보조 액션 영역에 배치한다.

## 🎯 1. 작업 목표

- **최종 상태**: 사용자가 되돌리기 버튼이나 키보드 단축키를 누르면 직전 반수 시점의 보드가 즉시 복구됩니다.
- **이번 작업의 최소 결과물**:
  - `apps/web/src/features/history-navigation/model/use-history-navigation.ts`
  - `apps/web/src/widgets/notation-controls/ui/history-controls.tsx`
  - `apps/web/src/entities/game/model/game-store.ts`
- **성공 기준 (AC)**:
  - 첫 반수에서 되돌리기 버튼은 비활성화되고 추가 상태 변경이 일어나지 않는다.
  - 되돌리기 실행 시 보드 상태, 현재 턴, 선택된 수순 인덱스가 같은 반수를 가리킨다.
  - 되돌리기 직후에도 수순 목록 선택 상태가 깨지지 않는다.

## 📂 2. 대상 아티팩트

- **신규 생성**:
  - `apps/web/src/features/history-navigation/model/use-history-navigation.ts`
  - `apps/web/src/widgets/notation-controls/ui/history-controls.tsx`
- **수정 대상**:
  - `apps/web/src/entities/game/model/game-store.ts`
  - `apps/web/src/pages/notation-input-page.tsx`
- **이번 작업에서 수정하지 않음**:
  - `apps/web/src/features/history-navigation/model/use-history-navigation.ts`의 다시하기 분기 처리
  - `apps/web/src/features/make-move/model/use-make-move.ts`의 미래 수열 삭제 로직
- **아티팩트 작성 규칙**:
  - 파일 경로는 `apps/web`, `apps/api`, `packages/shared` 기준의 실제 예상 위치로 고정합니다.
  - 후속 태스크 책임 파일은 같은 폴더에 있더라도 이번 문서 범위에서 같이 닫지 않습니다.

## 🛠️ 3. 상세 기술 사양

- **핵심 구현 대상**:
  - `game-store`에 `currentPlyIndex`와 `goToPreviousPly` 액션을 추가합니다.
  - `useHistoryNavigation`은 스토어 액션과 버튼 disabled 계산만 담당하고, 실제 보드 상태 계산은 store selector에 맡깁니다.
  - `history-controls.tsx`는 버튼 클릭과 키보드 단축키를 `goToPreviousPly`에 연결합니다.
- **데이터 모델 해석**:
  - `history`는 반수 단위 상태 스냅샷 배열로 해석하고, `currentPlyIndex`는 현재 화면에 보여줄 배열 인덱스입니다.
  - `selectedMoveIndex`가 별도로 존재한다면 되돌리기 이후 `currentPlyIndex`와 같은 값을 가리키도록 동기화합니다.
- **외부 의존성**:
  - `react`
  - `zustand`
  - `@chess-db/shared`의 `GameState` 또는 반수 스냅샷 타입
  - `@testing-library/react` 또는 store 단위 테스트 도구
- **import/export 규칙**:
  - `widgets`는 `features/history-navigation`이 노출한 훅만 소비하고 store 내부 구현을 직접 참조하지 않습니다.
  - `pages/notation-input-page.tsx`는 컨트롤 UI를 조합만 하고 포인터 계산 로직을 새로 만들지 않습니다.
- **권장 네이밍**:
  - `useHistoryNavigation`: 되돌리기/다시하기 액션과 버튼 상태를 묶는 훅 이름으로 사용합니다.
  - `goToPreviousPly`: 현재 시점을 한 반수 뒤로 이동시키는 store 액션 이름으로 고정합니다.
  - `currentPlyIndex`, `canUndo`: 화면에서 바로 읽히는 핵심 상태 이름으로 사용합니다.
- **이름별 사용 의도와 적용 시점**:
  - `useHistoryNavigation`은 보드 하단 컨트롤과 수순 목록 양쪽에서 재사용할 때 사용합니다.
  - `goToPreviousPly`는 되돌리기 버튼과 키보드 단축키가 호출하는 store 액션 이름으로 사용합니다.
- **인수 이름 가이드**:
  - `nextPlyIndex`: 계산된 다음 포인터 값이 필요할 때만 내부 helper 인수로 사용합니다.
  - `history`: 현재 반수 스냅샷 배열을 가리킬 때만 사용하고 `moves` 같은 모호한 이름으로 바꾸지 않습니다.
- **짧은 예시 골격**:

```tsx
const { canUndo, goToPreviousPly } = useHistoryNavigation();

return (
  <Button disabled={!canUndo} onClick={goToPreviousPly}>
    Undo
  </Button>
);
```

- **필수 describe/it 목록**:
  - `describe('useHistoryNavigation')`
  - `it('첫 반수에서는 canUndo가 false다')`
  - `it('goToPreviousPly 호출 시 현재 보드가 직전 반수 스냅샷으로 바뀐다')`
  - `it('되돌리기 후 선택된 수순 인덱스가 현재 포인터와 같은 값을 유지한다')`
- **최소 테스트 개수**:
  - 최소 3개
- **반드시 포함할 실패 시나리오**:
  - 포인터만 감소하고 보드 상태 selector가 이전 스냅샷을 읽지 못하는 경우
  - 첫 반수에서 되돌리기가 실행되어 음수 인덱스로 내려가는 경우

## ⚖️ 4. 기술 제약 및 규칙

- `history` 배열 자체를 mutate하지 않고 포인터만 이동해야 합니다.
- 되돌리기 태스크에서는 미래 수열 삭제를 추가하지 않습니다.
- 키보드 단축키는 입력 필드 포커스 중에는 실행되지 않도록 막습니다.

## 🧪 5. 검증 시나리오 및 단언

1. **정상 시나리오: 한 단계 되돌리기**
   - 세 번째 반수 시점에서 `goToPreviousPly`를 호출한다.
   - 두 번째 반수의 보드 상태와 현재 턴 상태가 store 기준으로 복구된다.

2. **경계 시나리오: 첫 반수 보호**
   - 초기 포지션에서 되돌리기 버튼을 클릭한다.
   - 포인터 값은 0 아래로 내려가지 않고 버튼은 disabled 상태를 유지한다.

3. **실패 시나리오: 포인터-보드 불일치**
   - 포인터만 바뀌고 보드 selector가 최신 값을 그대로 반환한다.
   - store 단위 테스트가 실패하도록 스냅샷 비교를 포함한다.

## 🚀 6. 권장 작업 순서

1. `game-store.ts`에 `currentPlyIndex`, `goToPreviousPly`, `canUndo` 계산을 추가합니다.
2. `use-history-navigation.ts`에서 store를 감싼 훅을 만들고 버튼 상태를 노출합니다.
3. `history-controls.tsx`에 Undo 버튼과 키보드 단축키를 연결합니다.
4. `notation-input-page.tsx`에서 컨트롤 위젯을 배치하고 수순 목록과 같은 포인터를 읽는지 확인합니다.

- **검증 실행**:
  - `pnpm --filter @chess-db/web test`
  - `pnpm --filter @chess-db/web build`

## ✅ 7. 완료 판정 체크리스트

- [ ] 되돌리기 실행 시 현재 시점이 정확히 한 반수 이전으로 이동한다.
- [ ] 첫 반수에서 버튼과 키보드 단축키가 안전하게 막힌다.
- [ ] 보드 상태와 선택된 수순 인덱스가 같은 시점을 가리킨다.

## 💬 9. 추천 커밋 메시지

- `feat: 기보 입력 되돌리기 규칙과 컨트롤을 추가 (TASK-018)`
