# 📋 개별 작업 지침서: 반수별 코멘트 입력 (TASK-020)

**작업 상태**: 대기 중  
**선행 작업**: `[TASK-017]` (수순 기록), `[TASK-063]` (GameRecord 스키마)  
**후속 작업**: `[TASK-021]` (착수 평가 기호 입력)  
**연관 설계**: `[../architecture/project-rules.md]`, `[../architecture/patterns.md]`, `[../architecture/directory-structure.md]`
**UI 기준안**: `[../ui/FEATURE-003-tab-comment.svg]`

---

## 0. 현재 코드 상태와 이 작업의 위치

- **현재 상태 요약**: 수순 목록은 존재하지만 특정 반수에 대한 텍스트 코멘트를 입력하고 저장할 UI와 store 액션이 없습니다.
- **이 작업의 책임**: 선택된 반수에 연결되는 텍스트 코멘트 입력창과 draft 상태 업데이트 로직을 구현합니다.
- **이번 작업에서 하지 않는 것**: 착수 평가 기호 선택 UI와 별도 평가 기호 저장은 `[TASK-021]`로 남깁니다.
- **경계 메모**:
  - 코멘트는 반수 단위 문자열 데이터만 다룹니다. 결과 메타데이터나 정식 저장 API는 건드리지 않습니다.
  - 코멘트 입력은 `FEATURE-003` 메타데이터 탭의 코멘트 탭 안에서 제공한다.

## 🎯 1. 작업 목표

- **최종 상태**: 사용자가 특정 반수를 선택하고 코멘트를 입력하면 해당 반수의 코멘트가 draft 상태에 즉시 반영됩니다.
- **이번 작업의 최소 결과물**:
  - `apps/web/src/features/move-comment-edit/ui/move-comment-editor.tsx`
  - `apps/web/src/features/move-comment-edit/model/use-move-comment-edit.ts`
  - `apps/web/src/entities/draft/model/draft-store.ts`
- **성공 기준 (AC)**:
  - 각 반수는 독립적인 코멘트 문자열을 가진다.
  - 선택된 반수가 바뀌면 에디터 값도 그 반수의 코멘트로 즉시 전환된다.
  - 공백만 입력한 경우는 정규화 규칙에 따라 빈 코멘트로 저장된다.

## 📂 2. 대상 아티팩트

- **신규 생성**:
  - `apps/web/src/features/move-comment-edit/ui/move-comment-editor.tsx`
  - `apps/web/src/features/move-comment-edit/model/use-move-comment-edit.ts`
- **수정 대상**:
  - `apps/web/src/entities/draft/model/draft-store.ts`
  - `apps/web/src/pages/notation-input-page.tsx`
- **이번 작업에서 수정하지 않음**:
  - `apps/web/src/features/move-annotation-edit/**` 전체
  - `apps/web/src/features/save-game/**` 전체
- **아티팩트 작성 규칙**:
  - 파일 경로는 `apps/web`, `apps/api`, `packages/shared` 기준의 실제 예상 위치로 고정합니다.
  - 후속 태스크 책임 파일은 같은 폴더에 있더라도 이번 문서 범위에서 같이 닫지 않습니다.

## 🛠️ 3. 상세 기술 사양

- **핵심 구현 대상**:
  - `draft-store`에 `updateMoveComment(plyIndex, comment)` 액션을 추가합니다.
  - `use-move-comment-edit`는 `selectedPlyIndex`, 현재 코멘트, 저장 액션을 묶어 반환합니다.
  - `move-comment-editor.tsx`는 `Textarea` 기반 입력기와 disabled/placeholder 상태를 담당합니다.
- **데이터 모델 해석**:
  - `draft.moves[plyIndex].comment`를 반수별 코멘트 저장 위치로 해석합니다.
  - `selectedPlyIndex`가 없으면 코멘트 입력 UI는 비활성화 상태여야 합니다.
- **외부 의존성**:
  - `react`
  - `zustand`
  - `@/shared/ui/textarea` 또는 shadcn `Textarea`
  - `@chess-db/shared`의 `GameRecord` 관련 타입
- **import/export 규칙**:
  - `move-comment-editor.tsx`는 draft-store를 직접 읽지 않고 `useMoveCommentEdit` 훅을 통해 접근합니다.
  - `draft-store.ts`는 저장 포맷 정규화만 담당하고 UI import를 받지 않습니다.
- **권장 네이밍**:
  - `useMoveCommentEdit`, `updateMoveComment`, `selectedPlyIndex`, `currentComment`
  - `normalizeCommentInput`: 공백 정리 helper가 필요할 때만 사용합니다.
- **이름별 사용 의도와 적용 시점**:
  - `updateMoveComment`는 자동 저장 훅이 붙더라도 같은 액션을 재사용하도록 유지합니다.
  - `currentComment`는 선택된 반수에 연결된 현재 입력값을 뜻할 때만 사용합니다.
- **인수 이름 가이드**:
  - `plyIndex`: 반수 인덱스를 의미하는 인수 이름으로 고정합니다.
  - `nextComment`: 정규화 전 사용자 입력 문자열을 받을 때 사용합니다.
- **짧은 예시 골격**:

```tsx
const { currentComment, updateComment } = useMoveCommentEdit();

<Textarea value={currentComment} onChange={(event) => updateComment(event.target.value)} />;
```

- **필수 describe/it 목록**:
  - `describe('useMoveCommentEdit')`
  - `it('선택된 반수가 바뀌면 currentComment가 해당 반수 코멘트로 바뀐다')`
  - `it('updateMoveComment 호출 시 draft moves 배열의 해당 반수만 갱신된다')`
  - `it('공백만 입력하면 빈 코멘트 규칙으로 정규화된다')`
- **최소 테스트 개수**:
  - 최소 3개
- **반드시 포함할 실패 시나리오**:
  - 선택된 반수와 다른 인덱스의 코멘트를 덮어쓰는 경우
  - 기존 `moves` 배열을 직접 mutate해서 이전 참조가 깨지는 경우

## ⚖️ 4. 기술 제약 및 규칙

- 코멘트 입력만 다루고 평가 기호 버튼은 추가하지 않습니다.
- 초안 저장을 염두에 두고 문자열 정규화 규칙을 store 한 곳에서 처리합니다.
- 입력창은 반수가 선택되지 않았을 때 빈 값과 disabled 상태를 동시에 보여줘야 합니다.

## 🧪 5. 검증 시나리오 및 단언

1. **정상 시나리오: 코멘트 입력**
   - 반수 하나를 선택한 뒤 텍스트를 입력한다.
   - 선택된 반수의 `comment` 필드만 즉시 갱신된다.

2. **경계 시나리오: 반수 미선택**
   - 반수를 선택하지 않은 상태에서 페이지를 연다.
   - 코멘트 입력창은 disabled 상태이고 저장 액션이 호출되지 않는다.

3. **실패 시나리오: 잘못된 인덱스 갱신**
   - 선택된 반수와 다른 인덱스가 수정된다.
   - store 테스트가 다른 반수의 코멘트 불변성을 검증해야 한다.

## 🚀 6. 권장 작업 순서

1. `draft-store.ts`에 `updateMoveComment` 액션과 문자열 정규화 로직을 추가합니다.
2. `use-move-comment-edit.ts`에서 선택된 반수와 현재 코멘트를 읽는 훅을 만듭니다.
3. `move-comment-editor.tsx`를 작성하고 페이지에 연결합니다.
4. 반수 전환, 입력, 공백 정규화 테스트를 추가합니다.

- **검증 실행**:
  - `pnpm --filter @chess-db/web test`
  - `pnpm --filter @chess-db/web build`

## ✅ 7. 완료 판정 체크리스트

- [ ] 코멘트가 반수 단위로 저장된다.
- [ ] 선택 반수 전환 시 입력값이 해당 반수 코멘트로 동기화된다.
- [ ] 공백 입력 정규화 규칙이 한 곳에서만 적용된다.

## 💬 9. 추천 커밋 메시지

- `feat: 반수별 코멘트 입력 규칙과 편집 UI를 추가`
