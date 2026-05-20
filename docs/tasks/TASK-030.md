# 📋 개별 작업 지침서: 저장소 이름 입력 (TASK-030)

**작업 상태**: 대기 중  
**선행 작업**: `[TASK-029]` (저장소 생성 흐름 구축)  
**후속 작업**: `[TASK-031]` (저장소 생성 확정)  
**연관 설계**: `[../architecture/directory-structure.md]`, `[../architecture/project-rules.md]`

---

## 0. 현재 코드 상태와 이 작업의 위치

- **현재 상태 요약**: 생성 다이얼로그는 열리지만 사용자가 저장소 이름을 입력할 필드와 검증 규칙이 없습니다.
- **이 작업의 책임**: 저장소 이름 입력 필드, 필수값 검증, 입력 상태 관리를 구현합니다.
- **이번 작업에서 하지 않는 것**: 실제 생성 요청 전송은 `[TASK-031]`에서 처리합니다.
- **경계 메모**:
  - 이 문서는 이름 입력 규칙과 validation 메시지까지만 다룹니다.

## 🎯 1. 작업 목표

- **최종 상태**: 사용자가 생성 다이얼로그에서 저장소 이름을 입력하고 유효성 상태를 확인할 수 있습니다.
- **이번 작업의 최소 결과물**:
  - `apps/web/src/features/repository-create/ui/repository-name-field.tsx`
  - `apps/web/src/features/repository-create/model/use-create-repository.ts`
  - `apps/web/src/features/repository-create/ui/create-repository-dialog.tsx`
- **성공 기준 (AC)**:
  - 저장소 이름은 필수 입력값이다.
  - 공백만 있는 이름은 유효하지 않다.
  - 입력 에러 상태가 다이얼로그 안에서 즉시 보인다.

## 📂 2. 대상 아티팩트

- **신규 생성**:
  - `apps/web/src/features/repository-create/ui/repository-name-field.tsx`
- **수정 대상**:
  - `apps/web/src/features/repository-create/model/use-create-repository.ts`
  - `apps/web/src/features/repository-create/ui/create-repository-dialog.tsx`
- **이번 작업에서 수정하지 않음**:
  - `apps/web/src/features/repository-create/api/create-repository.ts`
- **아티팩트 작성 규칙**:
  - 파일 경로는 `apps/web`, `apps/api`, `packages/shared` 기준의 실제 예상 위치로 고정합니다.
  - 후속 태스크 책임 파일은 같은 폴더에 있더라도 이번 문서 범위에서 같이 닫지 않습니다.

## 🛠️ 3. 상세 기술 사양

- **핵심 구현 대상**:
  - `use-create-repository.ts`에 `repositoryName`, `setRepositoryName`, `nameError`를 추가합니다.
  - `repository-name-field.tsx`는 label, input, 에러 메시지를 담당합니다.
  - trim 기준 최소 검증을 다이얼로그 제출 전에 수행합니다.
- **데이터 모델 해석**:
  - 입력 상태는 생성 다이얼로그가 닫히면 초기화됩니다.
- **외부 의존성**:
  - `react`
  - `@/shared/ui/input`
  - `@/shared/ui/form`
- **import/export 규칙**:
  - 입력 validation은 hook 또는 store 한 곳에서 수행하고 field는 표시만 담당합니다.
- **권장 네이밍**:
  - `repositoryName`, `setRepositoryName`, `nameError`, `RepositoryNameField`
- **이름별 사용 의도와 적용 시점**:
  - `repositoryName`은 create mutation payload로 바로 이어질 필드 이름을 미리 맞출 때 사용합니다.
- **인수 이름 가이드**:
  - `nextRepositoryName`, `trimmedRepositoryName`
- **짧은 예시 골격**:

```tsx
const isValidName = repositoryName.trim().length > 0;
```

- **필수 describe/it 목록**:
  - `describe('RepositoryNameField')`
  - `it('공백만 입력하면 에러를 보여준다')`
  - `it('유효한 이름이면 에러를 숨긴다')`
- **최소 테스트 개수**:
  - 최소 2개
- **반드시 포함할 실패 시나리오**:
  - trim 없이 공백 이름을 허용하는 경우

## ⚖️ 4. 기술 제약 및 규칙

- 이름 validation은 필수값과 trim 규칙만 먼저 고정합니다.
- 서버 중복 이름 검사는 현재 범위에 포함하지 않습니다.

## 🧪 5. 검증 시나리오 및 단언

1. **정상 시나리오: 유효한 이름 입력**
   - 문자열 입력
   - 에러 없이 상태 유지

2. **실패 시나리오: 빈 이름**
   - 공백만 입력
   - 에러 메시지 표시 및 제출 비활성화

## 🚀 6. 권장 작업 순서

1. create hook에 입력 상태와 validation을 추가합니다.
2. 이름 필드를 다이얼로그에 붙입니다.
3. 빈 값/trim validation 테스트를 추가합니다.

- **검증 실행**:
  - `pnpm --filter @chess-db/web test`
  - `pnpm --filter @chess-db/web build`

## ✅ 7. 완료 판정 체크리스트

- [ ] 저장소 이름이 필수값으로 취급된다.
- [ ] 공백 이름이 막힌다.
- [ ] 입력 에러가 다이얼로그 안에서 보인다.

## 💬 9. 추천 커밋 메시지

- `feat: 저장소 이름 입력 필드와 검증 규칙을 추가`
