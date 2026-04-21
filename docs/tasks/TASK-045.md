# 📋 개별 작업 지침서: 정식 기보 코멘트 수정과 자동 저장 (TASK-045)

**작업 상태**: 대기 중  
**선행 작업**: `[TASK-043]` (정식 기보 코멘트 조회와 표시)  
**후속 작업**: `[TASK-046]` (어노테이션 수정과 자동 저장)  
**연관 설계**: `[../architecture/directory-structure.md]`, `[../architecture/patterns.md]`

---

## 0. 현재 코드 상태와 이 작업의 위치

- **현재 상태 요약**: 정식 저장된 기보 코멘트를 볼 수는 있지만 이를 수정해 서버에 즉시 반영하는 흐름은 없습니다.
- **이 작업의 책임**: 정식 기보 상세 화면에서 코멘트를 수정하고 자동 저장합니다.
- **이번 작업에서 하지 않는 것**: 어노테이션 수정은 다음 태스크에서 다룹니다.
- **경계 메모**:
  - 코멘트 수정과 저장만 다룹니다.

## 🎯 1. 작업 목표

- **최종 상태**: 사용자가 정식 기보의 코멘트를 수정하면 별도 저장 버튼 없이 자동으로 반영됩니다.
- **이번 작업의 최소 결과물**:
  - `apps/web/src/features/game-comment-edit/ui/comment-editor.tsx`
  - `apps/web/src/features/game-comment-edit/model/use-game-comment-edit.ts`
  - `apps/web/src/features/game-comment-edit/api/update-move-comment.ts`
- **성공 기준 (AC)**:
  - 정식 저장된 기보에도 코멘트를 추가하거나 수정할 수 있다.
  - 코멘트 수정은 즉시 자동 저장된다.
  - 수순 수정 없이 코멘트만 보완하는 흐름이 분리되어 있다.

## 📂 2. 대상 아티팩트

- **신규 생성**:
  - `apps/web/src/features/game-comment-edit/model/use-game-comment-edit.ts`
- **수정 대상**:
  - `apps/web/src/features/game-comment-edit/ui/comment-editor.tsx`
  - `apps/web/src/features/game-comment-edit/api/update-move-comment.ts`
  - `apps/web/src/pages/game-detail-page.tsx`
- **이번 작업에서 수정하지 않음**:
  - `apps/web/src/features/game-annotation-edit/**`
- **아티팩트 작성 규칙**:
  - 파일 경로는 `apps/web`, `apps/api`, `packages/shared` 기준의 실제 예상 위치로 고정합니다.
  - 후속 태스크 책임 파일은 같은 폴더에 있더라도 이번 문서 범위에서 같이 닫지 않습니다.

## 🛠️ 3. 상세 기술 사양

- **핵심 구현 대상**:
  - `update-move-comment.ts`는 특정 `gameId`, `plyIndex`, `comment`를 PATCH 합니다.
  - `use-game-comment-edit`는 입력 상태와 debounce 저장을 묶습니다.
  - `comment-editor.tsx`는 선택된 반수 기준으로 수정 UI를 제공합니다.
- **데이터 모델 해석**:
  - 수정 대상은 정식 기보의 특정 반수 코멘트입니다.
- **외부 의존성**:
  - `@tanstack/react-query`
  - `@/shared/ui/textarea`
- **import/export 규칙**:
  - API 함수는 네트워크 호출만 담당하고, debounce와 optimistic state는 hook에서 처리합니다.
- **권장 네이밍**:
  - `useGameCommentEdit`, `updateMoveComment`, `pendingComment`, `saveCommentDebounced`
- **이름별 사용 의도와 적용 시점**:
  - `pendingComment`는 저장 대기 중인 입력값을 의미할 때 사용합니다.
- **인수 이름 가이드**:
  - `gameId`, `plyIndex`, `nextComment`
- **짧은 예시 골격**:

```tsx
const { pendingComment, updateComment } = useGameCommentEdit(gameId, plyIndex);
```

- **필수 describe/it 목록**:
  - `describe('useGameCommentEdit')`
  - `it('입력 변경 후 자동 저장 mutation을 호출한다')`
  - `it('실패 시 사용자 입력을 잃지 않는다')`
- **최소 테스트 개수**:
  - 최소 2개
- **반드시 포함할 실패 시나리오**:
  - 입력마다 즉시 네트워크를 때려 과도한 요청이 발생하는 경우

## ⚖️ 4. 기술 제약 및 규칙

- 자동 저장은 debounce 또는 최소 요청 제어를 포함해야 합니다.
- 수순 데이터 자체는 수정하지 않습니다.

## 🧪 5. 검증 시나리오 및 단언

1. **정상 시나리오: 코멘트 자동 저장**
   - 코멘트 입력 변경
   - 잠시 후 PATCH 요청 전송

2. **실패 시나리오: 저장 실패**
   - 서버 에러 발생
   - 입력값 유지 및 오류 표시

## 🚀 6. 권장 작업 순서

1. 코멘트 수정 API 함수를 작성합니다.
2. 자동 저장 훅을 구현합니다.
3. 상세 화면에 editor를 연결합니다.
4. 자동 저장/실패 테스트를 추가합니다.

- **검증 실행**:
  - `pnpm --filter @chess-db/web test`
  - `pnpm --filter @chess-db/web build`

## ✅ 7. 완료 판정 체크리스트

- [ ] 코멘트 수정이 가능하다.
- [ ] 자동 저장이 동작한다.
- [ ] 수순 수정과 분리된 흐름이다.

## 💬 9. 추천 커밋 메시지

- `feat: 정식 기보 코멘트 자동 저장 편집을 추가 (TASK-045)`
