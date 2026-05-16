# 📋 개별 작업 지침서: 초안 자동 저장 (TASK-022)

**작업 상태**: 완료
**선행 작업**: `[TASK-020]`, `[TASK-021]`, `[TASK-026]`, `[TASK-027]`
**후속 작업**: `[TASK-023]` (새로고침 후 초안 복원)  
**연관 설계**: `[../architecture/project-rules.md]`, `[../architecture/patterns.md]`, `[../architecture/directory-structure.md]`
**UI 기준안**: `[../ui/FEATURE-003-metadata-draft-save.svg]`

---

## 0. 현재 코드 상태와 이 작업의 위치

- **현재 상태 요약**: 초안 편집 상태는 메모리 안에만 있어 브라우저를 벗어나면 즉시 사라집니다.
- **이 작업의 책임**: 기보 초안 상태를 로컬 저장소에 자동으로 직렬화하는 규칙과 훅을 구현합니다.
- **이번 작업에서 하지 않는 것**: 새로고침 시 저장된 초안을 다시 주입하는 복원 책임은 `[TASK-023]`로 남깁니다.
- **경계 메모**:
  - 이 문서는 저장 시점과 직렬화 포맷만 고정합니다. 복원 시점과 사용자 확인 UX는 후속 태스크에서 다룹니다.
  - 상단 바의 초안 저장 상태 표시는 자동 저장 결과를 사용자에게 보여주는 최소 UI 계약입니다.

## 🎯 1. 작업 목표

- **최종 상태**: 사용자가 반수, 코멘트, 평가 기호, 메타데이터를 수정하면 초안이 자동으로 브라우저 저장소에 반영됩니다.
- **이번 작업의 최소 결과물**:
  - `apps/web/src/features/draft-autosave/model/use-draft-autosave.ts`
  - `apps/web/src/shared/lib/storage/draft-storage.ts`
  - `apps/web/src/pages/notation-input-page.tsx`
- **성공 기준 (AC)**:
  - 편집 상태 변경 후 저장소에 최신 초안이 직렬화된다.
  - 초안 직렬화 대상에는 보드 상태, 수순 목록, 코멘트, 평가, 기보 정보 메타데이터가 포함된다.
  - 동일한 상태 재저장으로 불필요한 저장이 반복되지 않도록 최소한의 변경 감지가 적용된다.

## 📂 2. 대상 아티팩트

- **신규 생성**:
  - `apps/web/src/features/draft-autosave/model/use-draft-autosave.ts`
  - `apps/web/src/shared/lib/storage/draft-storage.ts`
- **수정 대상**:
  - `apps/web/src/entities/draft/model/draft-store.ts`
  - `apps/web/src/pages/notation-input-page.tsx`
- **이번 작업에서 수정하지 않음**:
  - `apps/web/src/app/providers/draft-restore-provider.tsx`
- **아티팩트 작성 규칙**:
  - 파일 경로는 `apps/web`, `apps/api`, `packages/shared` 기준의 실제 예상 위치로 고정합니다.
  - 후속 태스크 책임 파일은 같은 폴더에 있더라도 이번 문서 범위에서 같이 닫지 않습니다.

## 🛠️ 3. 상세 기술 사양

- **핵심 구현 대상**:
  - `draft-storage.ts`에 `saveDraft`와 직렬화 키(`CHESS_DB_DRAFT_KEY`)를 고정합니다.
  - `use-draft-autosave`는 draft-store의 필요한 부분만 구독하고 debounce 또는 마지막 JSON 비교를 통해 저장 횟수를 줄입니다.
  - `notation-input-page.tsx`에서 autosave 훅을 마운트해 페이지 진입 시 자동 저장이 활성화되도록 합니다.
  - 자동 저장 성공 후에는 화면 우상단에 `초안 저장됨` 토스트를 잠시 표시합니다.
- **데이터 모델 해석**:
  - 저장 대상 초안은 `GameRecord`에 가까운 직렬화 가능한 객체로 해석합니다.
  - 함수, UI 상태, 임시 focus 값은 저장 대상에 포함하지 않습니다.
- **외부 의존성**:
  - `react`
  - `zustand`
  - 브라우저 `localStorage`
  - `@chess-db/shared`의 draft 직렬화 타입
- **import/export 규칙**:
  - `draft-storage.ts`는 브라우저 API 접근만 담당하고 store를 직접 import하지 않습니다.
  - `use-draft-autosave.ts`는 직렬화 규칙을 호출만 하고 저장 키를 다시 정의하지 않습니다.
- **권장 네이밍**:
  - `useDraftAutosave`, `saveDraft`, `serializeDraft`, `lastSavedSnapshot`
- **이름별 사용 의도와 적용 시점**:
  - `serializeDraft`는 저장 대상 필드만 뽑아 JSON 문자열을 만들 때 사용합니다.
  - `lastSavedSnapshot`은 동일 상태 재저장을 막는 내부 ref 이름으로 사용합니다.
- **인수 이름 가이드**:
  - `draftRecord`, `storageKey`, `serializedDraft`
- **짧은 예시 골격**:

```tsx
useDraftAutosave();

// 내부에서 draft 상태가 바뀔 때마다 saveDraft(serializedDraft)를 호출한다.
```

- **필수 describe/it 목록**:
  - `describe('useDraftAutosave')`
  - `it('초안 상태가 바뀌면 localStorage에 저장한다')`
  - `it('저장 대상에 코멘트와 평가 기호가 포함된다')`
  - `it('같은 상태를 연속 저장하지 않는다')`
- **최소 테스트 개수**:
  - 최소 3개
- **반드시 포함할 실패 시나리오**:
  - UI 전용 상태까지 직렬화해서 저장 구조가 불안정해지는 경우
  - 상태가 바뀌지 않았는데 저장이 반복 호출되는 경우

## ⚖️ 4. 기술 제약 및 규칙

- 저장 키는 상수 하나로 고정합니다.
- 자동 저장은 입력 경험을 해치지 않도록 최소 debounce 또는 중복 저장 방지를 포함해야 합니다.
- 복원 로직은 이 문서에서 구현하지 않습니다.

## 🧪 5. 검증 시나리오 및 단언

1. **정상 시나리오: 상태 자동 저장**
   - 코멘트 또는 수순을 수정한다.
   - 로컬 저장소에 최신 초안 JSON이 기록된다.

2. **경계 시나리오: 동일 상태 재저장 방지**
   - 초안 상태가 바뀌지 않은 채 rerender가 발생한다.
   - 저장 함수가 중복 호출되지 않는다.

3. **실패 시나리오: 직렬화 대상 누락**
   - 평가 기호가 저장 대상에서 빠진다.
   - 복원용 테스트 fixture 비교가 실패해야 한다.

## 🚀 6. 권장 작업 순서

1. `draft-storage.ts`에 저장 키와 `saveDraft` 유틸을 만듭니다.
2. `use-draft-autosave.ts`에서 draft-store 구독과 저장 조건을 구현합니다.
3. `notation-input-page.tsx`에서 autosave 훅을 마운트합니다.
4. 직렬화 필드와 중복 저장 방지 테스트를 추가합니다.

- **검증 실행**:
  - `pnpm --filter @chess-db/web test`
  - `pnpm --filter @chess-db/web build`

## ✅ 7. 완료 판정 체크리스트

- [ ] 초안이 자동 저장된다.
- [ ] 저장 대상 필드 범위가 문서와 테스트에 고정된다.
- [ ] 중복 저장 방지 규칙이 포함된다.

## 💬 9. 추천 커밋 메시지

- `feat: 기보 초안 자동 저장 규칙을 추가 (TASK-022)`
