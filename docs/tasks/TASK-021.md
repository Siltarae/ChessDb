# 📋 개별 작업 지침서: 반수별 착수 평가 기호 입력 (TASK-021)

**작업 상태**: 대기 중  
**선행 작업**: `[TASK-020]` (반수별 코멘트 입력)  
**후속 작업**: `[TASK-026]` (기보 결과와 종료 사유 입력)
**연관 설계**: `[../architecture/project-rules.md]`, `[../architecture/patterns.md]`, `[../architecture/directory-structure.md]`
**UI 기준안**: `[../ui/FEATURE-003-tab-evaluation.svg]`

---

## 0. 현재 코드 상태와 이 작업의 위치

- **현재 상태 요약**: 코멘트 입력은 가능하지만 `!!`, `!?`, `?` 같은 착수 평가 기호를 반수 단위로 저장하고 보여주는 구조가 없습니다.
- **이 작업의 책임**: 반수별 평가 기호 선택 UI와 draft 상태 저장 규칙을 구현합니다.
- **이번 작업에서 하지 않는 것**: 브라우저 저장소 자동 저장이나 정식 기보 상세 화면의 조회/수정은 후속 태스크로 남깁니다.
- **경계 메모**:
  - 이 문서는 평가 기호 하나를 선택해 저장하는 책임만 다룹니다. 코멘트 입력과 별도 액션을 유지합니다.
  - 평가 기호 선택은 `FEATURE-003` 메타데이터 탭의 평가 탭 안에서 제공한다.

## 🎯 1. 작업 목표

- **최종 상태**: 사용자가 특정 반수에서 평가 기호 버튼을 누르면 해당 반수에 평가 기호가 즉시 연결됩니다.
- **이번 작업의 최소 결과물**:
  - `apps/web/src/features/move-annotation-edit/ui/move-annotation-picker.tsx`
  - `apps/web/src/features/move-annotation-edit/model/use-move-annotation-edit.ts`
  - `apps/web/src/entities/draft/model/draft-store.ts`
- **성공 기준 (AC)**:
  - 각 반수는 하나의 평가 기호만 가진다.
  - 평가 기호는 선택된 반수와 직접 연결되어 표시된다.
  - `없음` 선택 시 현재 반수의 평가 기호가 제거된다.
  - 평가 기호 값은 초안 저장 대상 데이터에 포함된다.

## 📂 2. 대상 아티팩트

- **신규 생성**:
  - `apps/web/src/features/move-annotation-edit/ui/move-annotation-picker.tsx`
  - `apps/web/src/features/move-annotation-edit/model/use-move-annotation-edit.ts`
- **수정 대상**:
  - `apps/web/src/entities/draft/model/draft-store.ts`
  - `apps/web/src/pages/notation-input-page.tsx`
- **이번 작업에서 수정하지 않음**:
  - `apps/web/src/features/draft-autosave/**`
  - `apps/web/src/features/game-annotation-edit/**`
- **아티팩트 작성 규칙**:
  - 파일 경로는 `apps/web`, `apps/api`, `packages/shared` 기준의 실제 예상 위치로 고정합니다.
  - 후속 태스크 책임 파일은 같은 폴더에 있더라도 이번 문서 범위에서 같이 닫지 않습니다.

## 🛠️ 3. 상세 기술 사양

- **핵심 구현 대상**:
  - `draft-store`에 `updateMoveAnnotation(plyIndex, annotation)` 액션을 추가합니다.
  - `move-annotation-picker.tsx`는 고정된 기호 목록(`!!`, `!`, `!?`, `?!`, `?`, `??`)을 렌더링합니다.
  - `없음` 칩은 별도 저장값이 아니라 현재 반수의 평가 기호를 제거하는 액션으로 처리합니다.
  - 같은 기호를 다시 누르면 선택 상태를 유지하고, 평가 제거는 `없음` 칩으로만 수행합니다.
- **데이터 모델 해석**:
  - `draft.moves[plyIndex].annotation`을 반수별 평가 기호 저장 위치로 해석합니다.
  - 평가 기호는 자유 텍스트가 아니라 고정된 리터럴 집합 중 하나이거나 비어 있는 상태여야 합니다.
- **외부 의존성**:
  - `react`
  - `zustand`
  - `@/shared/ui/toggle-group` 또는 shadcn `ToggleGroup`
  - `@chess-db/shared`의 move annotation 타입
- **import/export 규칙**:
  - `move-annotation-picker.tsx`는 상수 목록을 로컬에 두거나 `shared` 상수로만 읽고, 임의 문자열 입력을 허용하지 않습니다.
  - `draft-store.ts`는 평가 기호 타입을 중앙에서 고정합니다.
- **권장 네이밍**:
  - `useMoveAnnotationEdit`, `updateMoveAnnotation`, `annotationOptions`, `selectedAnnotation`
- **이름별 사용 의도와 적용 시점**:
  - `annotationOptions`는 버튼 렌더링과 검증 테스트에서 같은 목록을 재사용할 때 사용합니다.
  - `selectedAnnotation`은 현재 반수의 선택 상태를 UI에 표시할 때 사용합니다.
- **인수 이름 가이드**:
  - `plyIndex`, `nextAnnotation`
- **짧은 예시 골격**:

```tsx
const { annotationOptions, selectedAnnotation, updateAnnotation } = useMoveAnnotationEdit();

<ToggleGroup value={selectedAnnotation} onValueChange={updateAnnotation}>
  ...
</ToggleGroup>;
```

- **필수 describe/it 목록**:
  - `describe('useMoveAnnotationEdit')`
  - `it('특정 반수에 평가 기호를 저장한다')`
  - `it('허용되지 않은 문자열은 저장하지 않는다')`
  - `it('선택 반수 전환 시 selectedAnnotation이 함께 바뀐다')`
- **최소 테스트 개수**:
  - 최소 3개
- **반드시 포함할 실패 시나리오**:
  - 평가 기호가 다른 반수에 저장되는 경우
  - 고정된 기호 목록 밖의 문자열이 저장되는 경우

## ⚖️ 4. 기술 제약 및 규칙

- 평가 기호는 자유 입력이 아닌 고정 리터럴 집합만 허용합니다.
- `없음`은 저장 리터럴이 아니라 `annotation`을 비우는 UI 액션입니다.
- 코멘트 액션과 분리된 store 액션을 유지해 후속 자동 저장 태스크에서 변경 범위를 분리합니다.
- 선택 반수가 없을 때는 버튼 그룹 전체를 disabled 처리합니다.

## 🧪 5. 검증 시나리오 및 단언

1. **정상 시나리오: 평가 기호 선택**
   - 반수를 선택하고 `!?` 버튼을 누른다.
   - 해당 반수에만 `annotation: `!?``가 저장된다.

2. **경계 시나리오: 반수 전환**
   - 평가 기호가 있는 반수와 없는 반수를 번갈아 선택한다.
   - 버튼의 활성 상태가 현재 반수 데이터와 일치한다.

3. **실패 시나리오: 잘못된 값 저장**
   - 지원하지 않는 문자열을 store 액션에 전달한다.
   - 검증 또는 타입 테스트가 실패해야 한다.

4. **경계 시나리오: 평가 기호 제거**
   - 평가 기호가 있는 반수에서 `없음`을 누른다.
   - 해당 반수의 `annotation`이 비워지고 다른 반수의 평가는 유지된다.

## 🚀 6. 권장 작업 순서

1. `draft-store.ts`에 평가 기호 타입과 `updateMoveAnnotation` 액션을 추가합니다.
2. `use-move-annotation-edit.ts`에서 선택 반수와 현재 기호를 연결합니다.
3. `move-annotation-picker.tsx`를 만들고 페이지에 배치합니다.
4. 허용 목록, 반수 전환, disabled 상태 테스트를 추가합니다.

- **검증 실행**:
  - `pnpm --filter @chess-db/web test`
  - `pnpm --filter @chess-db/web build`

## ✅ 7. 완료 판정 체크리스트

- [ ] 평가 기호가 반수와 직접 연결된다.
- [ ] 허용된 기호 목록만 저장된다.
- [ ] `없음` 선택 시 평가 기호가 제거된다.
- [ ] 초안 저장 대상으로 사용할 수 있는 구조가 마련된다.

## 💬 9. 추천 커밋 메시지

- `feat: 반수별 착수 평가 기호 입력 규칙을 추가 (TASK-021)`
