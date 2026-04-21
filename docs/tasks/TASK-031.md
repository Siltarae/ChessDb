# 📋 개별 작업 지침서: 저장소 생성 확정 (TASK-031)

**작업 상태**: 대기 중  
**선행 작업**: `[TASK-030]` (저장소 이름 입력)  
**후속 작업**: `[TASK-033]` (저장소 선택 진입)  
**연관 설계**: `[../architecture/directory-structure.md]`, `[../architecture/patterns.md]`

---

## 0. 현재 코드 상태와 이 작업의 위치

- **현재 상태 요약**: 이름을 입력할 수는 있지만 실제 저장소 생성 요청을 보내고 목록을 갱신하는 mutation 흐름이 없습니다.
- **이 작업의 책임**: 입력한 이름으로 저장소를 실제 생성하고 성공 시 목록을 갱신하며 다이얼로그를 닫습니다.
- **이번 작업에서 하지 않는 것**: 생성 후 특정 저장소로 자동 진입하는 흐름은 `[TASK-033]` 이후에서 다룹니다.
- **경계 메모**:
  - 저장소 생성 성공/실패 처리까지만 책임집니다.

## 🎯 1. 작업 목표

- **최종 상태**: 사용자가 이름을 입력하고 생성 버튼을 누르면 새 저장소가 추가됩니다.
- **이번 작업의 최소 결과물**:
  - `apps/web/src/features/repository-create/api/create-repository.ts`
  - `apps/web/src/features/repository-create/model/use-create-repository.ts`
  - `apps/web/src/features/repository-create/ui/create-repository-dialog.tsx`
- **성공 기준 (AC)**:
  - 입력한 이름으로 저장소를 생성할 수 있다.
  - 성공 후 목록이 갱신되고 다이얼로그가 닫힌다.
  - 실패 시 에러 메시지가 표시되고 입력값은 유지된다.

## 📂 2. 대상 아티팩트

- **신규 생성**:
  - `apps/web/src/features/repository-create/api/create-repository.ts`
- **수정 대상**:
  - `apps/web/src/features/repository-create/model/use-create-repository.ts`
  - `apps/web/src/features/repository-create/ui/create-repository-dialog.tsx`
  - `apps/web/src/entities/repository/model/repository-list-query.ts`
- **이번 작업에서 수정하지 않음**:
  - `apps/web/src/features/repository-select/**`
- **아티팩트 작성 규칙**:
  - 파일 경로는 `apps/web`, `apps/api`, `packages/shared` 기준의 실제 예상 위치로 고정합니다.
  - 후속 태스크 책임 파일은 같은 폴더에 있더라도 이번 문서 범위에서 같이 닫지 않습니다.

## 🛠️ 3. 상세 기술 사양

- **핵심 구현 대상**:
  - `create-repository.ts`는 POST 요청과 payload/response 타입을 캡슐화합니다.
  - `use-create-repository`는 mutation 상태, 제출 핸들러, 성공 후 invalidate를 담당합니다.
  - 성공 시 다이얼로그를 닫고 이름 입력 상태를 초기화합니다.
- **데이터 모델 해석**:
  - 생성 payload 최소 필드는 `name` 하나입니다.
- **외부 의존성**:
  - `@tanstack/react-query`
  - `@/shared/api/client`
- **import/export 규칙**:
  - API 함수는 순수 네트워크 호출만 담당하고, invalidate는 hook에서 처리합니다.
- **권장 네이밍**:
  - `createRepository`, `useCreateRepository`, `handleSubmitCreateRepository`, `isCreating`
- **이름별 사용 의도와 적용 시점**:
  - `createRepository`는 다른 화면에서도 재사용 가능한 순수 API 함수 이름으로 유지합니다.
- **인수 이름 가이드**:
  - `repositoryName`, `createRepositoryPayload`
- **짧은 예시 골격**:

```tsx
await createRepository({ name: repositoryName.trim() });
```

- **필수 describe/it 목록**:
  - `describe('useCreateRepository')`
  - `it('성공 시 목록 query를 invalidate하고 다이얼로그를 닫는다')`
  - `it('실패 시 에러를 노출하고 입력값을 유지한다')`
- **최소 테스트 개수**:
  - 최소 2개
- **반드시 포함할 실패 시나리오**:
  - 성공 후 목록 갱신 없이 다이얼로그만 닫는 경우

## ⚖️ 4. 기술 제약 및 규칙

- 생성 성공 후 자동 진입까지 여기서 처리하지 않습니다.
- mutation 성공/실패 상태를 UI에서 구분할 수 있어야 합니다.

## 🧪 5. 검증 시나리오 및 단언

1. **정상 시나리오: 생성 성공**
   - 유효한 이름으로 제출
   - POST 성공 후 목록이 갱신되고 다이얼로그가 닫힘

2. **실패 시나리오: 생성 실패**
   - 서버 에러 발생
   - 에러 메시지 표시 및 입력 상태 유지

## 🚀 6. 권장 작업 순서

1. API 함수를 작성합니다.
2. mutation hook을 구현합니다.
3. 다이얼로그 제출 버튼을 mutation과 연결합니다.
4. 성공/실패 테스트를 추가합니다.

- **검증 실행**:
  - `pnpm --filter @chess-db/web test`
  - `pnpm --filter @chess-db/web build`

## ✅ 7. 완료 판정 체크리스트

- [ ] 저장소 생성 요청이 전송된다.
- [ ] 성공 후 목록이 갱신된다.
- [ ] 실패 처리와 입력 유지가 동작한다.

## 💬 9. 추천 커밋 메시지

- `feat: 저장소 생성 mutation과 확정 흐름을 추가 (TASK-031)`
