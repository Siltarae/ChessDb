# 📋 개별 작업 지침서: 새로고침 후 초안 복원 (TASK-023)

**작업 상태**: 대기 중  
**선행 작업**: `[TASK-022]` (초안 자동 저장)  
**후속 작업**: `[TASK-024]` (기존 초안 폐기 후 새 기보 시작)  
**연관 설계**: `[../architecture/project-rules.md]`, `[../architecture/patterns.md]`, `[../architecture/directory-structure.md]`

---

## 0. 현재 코드 상태와 이 작업의 위치

- **현재 상태 요약**: 자동 저장된 초안은 생겼지만, 페이지를 다시 열었을 때 그 데이터를 draft-store에 다시 주입하는 복원 흐름이 없습니다.
- **이 작업의 책임**: 앱 진입 시 저장된 초안을 읽어 draft-store에 복원하는 규칙과 초기화 순서를 구현합니다.
- **이번 작업에서 하지 않는 것**: 새 기보 시작 시 기존 초안을 폐기하는 확인 흐름은 `[TASK-024]`에서 다룹니다.
- **경계 메모**:
  - 이 문서는 자동 복원 규칙을 다루며, 여러 초안 중 선택하는 UI는 현재 범위에 포함하지 않습니다.

## 🎯 1. 작업 목표

- **최종 상태**: 사용자가 새로고침한 뒤에도 작업하던 초안이 같은 보드와 수순 상태로 다시 열립니다.
- **이번 작업의 최소 결과물**:
  - `apps/web/src/app/providers/draft-restore-provider.tsx`
  - `apps/web/src/shared/lib/storage/draft-storage.ts`
  - `apps/web/src/entities/draft/model/draft-store.ts`
- **성공 기준 (AC)**:
  - 새로고침 뒤 저장된 초안이 자동으로 store에 복원된다.
  - 복원 대상에는 보드 상태, 수순 목록, 코멘트, 어노테이션, 메타데이터가 포함된다.
  - 저장된 초안이 없거나 파싱에 실패하면 초기 초안 상태로 안전하게 폴백한다.

## 📂 2. 대상 아티팩트

- **신규 생성**:
  - `apps/web/src/app/providers/draft-restore-provider.tsx`
- **수정 대상**:
  - `apps/web/src/shared/lib/storage/draft-storage.ts`
  - `apps/web/src/entities/draft/model/draft-store.ts`
  - `apps/web/src/app/providers/index.tsx`
- **이번 작업에서 수정하지 않음**:
  - `apps/web/src/features/draft-management/**`의 새 기보 시작 확인 UI
- **아티팩트 작성 규칙**:
  - 파일 경로는 `apps/web`, `apps/api`, `packages/shared` 기준의 실제 예상 위치로 고정합니다.
  - 후속 태스크 책임 파일은 같은 폴더에 있더라도 이번 문서 범위에서 같이 닫지 않습니다.

## 🛠️ 3. 상세 기술 사양

- **핵심 구현 대상**:
  - `draft-storage.ts`에 `loadDraft`와 파싱 실패 fallback을 추가합니다.
  - `draft-store.ts`에 `hydrateDraft` 또는 `replaceDraft` 액션을 추가합니다.
  - `draft-restore-provider.tsx`는 앱 초기 렌더 한 번만 복원 로직을 실행합니다.
- **데이터 모델 해석**:
  - 복원 입력값은 자동 저장된 draft 직렬화 객체 그대로입니다.
  - 저장된 초안이 없으면 초기 포지션 기반 빈 draft를 사용합니다.
- **외부 의존성**:
  - `react`
  - `zustand`
  - 브라우저 `localStorage`
  - `zod` 또는 shared schema 기반 파싱 검증
- **import/export 규칙**:
  - `draft-restore-provider.tsx`는 UI를 렌더링하지 않고 부트스트랩 부수효과만 담당합니다.
  - `draft-store.ts`는 복원 데이터 검증 통과 후에만 상태 치환을 허용합니다.
- **권장 네이밍**:
  - `DraftRestoreProvider`, `loadDraft`, `hydrateDraft`, `restoreDraftOnce`
- **이름별 사용 의도와 적용 시점**:
  - `hydrateDraft`는 전체 draft 상태를 한 번에 치환할 때 사용합니다.
  - `restoreDraftOnce`는 중복 복원을 막는 내부 effect helper 이름으로 사용합니다.
- **인수 이름 가이드**:
  - `storedDraft`, `parsedDraft`, `fallbackDraft`
- **짧은 예시 골격**:

```tsx
useEffect(() => {
  const storedDraft = loadDraft();
  if (storedDraft) hydrateDraft(storedDraft);
}, [hydrateDraft]);
```

- **필수 describe/it 목록**:
  - `describe('DraftRestoreProvider')`
  - `it('저장된 초안이 있으면 store를 그 값으로 초기화한다')`
  - `it('저장된 초안이 없으면 초기 draft를 유지한다')`
  - `it('파싱 실패 시 앱이 죽지 않고 초기 상태로 폴백한다')`
- **최소 테스트 개수**:
  - 최소 3개
- **반드시 포함할 실패 시나리오**:
  - 복원 로직이 여러 번 실행되어 사용자 입력을 덮어쓰는 경우
  - 파싱 실패 시 예외를 그대로 던져 앱이 중단되는 경우

## ⚖️ 4. 기술 제약 및 규칙

- 복원은 앱 시작 시 한 번만 실행해야 합니다.
- 저장 포맷 검증 실패를 UI 레벨 예외로 넘기지 않습니다.
- 자동 저장과 복원이 같은 직렬화 구조를 공유해야 합니다.

## 🧪 5. 검증 시나리오 및 단언

1. **정상 시나리오: 자동 복원**
   - 로컬 저장소에 초안이 있는 상태에서 페이지를 다시 연다.
   - draft-store가 저장된 초안 값으로 초기화된다.

2. **경계 시나리오: 저장된 초안 없음**
   - 로컬 저장소 키가 없는 상태에서 페이지를 연다.
   - 초기 초안 상태가 그대로 유지된다.

3. **실패 시나리오: 손상된 JSON**
   - 저장 값이 잘못된 JSON이거나 스키마와 맞지 않는다.
   - 복원 로직은 실패를 삼키고 안전한 초기 상태로 폴백한다.

## 🚀 6. 권장 작업 순서

1. `draft-storage.ts`에 `loadDraft`와 파싱 fallback을 추가합니다.
2. `draft-store.ts`에 전체 상태 치환 액션을 추가합니다.
3. `DraftRestoreProvider`를 만들고 앱 provider 체인에 연결합니다.
4. 저장값 있음/없음/손상됨 시나리오를 테스트합니다.

- **검증 실행**:
  - `pnpm --filter @chess-db/web test`
  - `pnpm --filter @chess-db/web build`

## ✅ 7. 완료 판정 체크리스트

- [ ] 새로고침 후 초안이 자동 복원된다.
- [ ] 복원 대상 필드가 자동 저장 범위와 일치한다.
- [ ] 손상된 저장값에도 앱이 안전하게 기동된다.

## 💬 9. 추천 커밋 메시지

- `feat: 새로고침 후 기보 초안 복원 규칙을 추가 (TASK-023)`
