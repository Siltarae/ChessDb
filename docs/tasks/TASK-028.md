# 📋 개별 작업 지침서: 저장소 목록 화면 표시 (TASK-028)

**작업 상태**: 대기 중  
**선행 작업**: `[TASK-025]` (정식 저장), `[TASK-089]` (DB 설정)  
**후속 작업**: `[TASK-032]` (목록 정렬)  
**연관 설계**: `[../architecture/directory-structure.md]`, `[../architecture/patterns.md]`

---

## 0. 현재 코드 상태와 이 작업의 위치

- **현재 상태 요약**: 저장소 데이터는 존재할 수 있지만 사용자가 이를 한눈에 볼 목록 화면과 조회 query가 없습니다.
- **이 작업의 책임**: 저장소 목록 페이지와 목록 위젯을 만들어 저장소 이름과 기본 진입 동작을 보여줍니다.
- **이번 작업에서 하지 않는 것**: 생성 순 정렬 규칙은 `[TASK-032]`, 생성/삭제 액션은 다른 태스크에서 닫습니다.
- **경계 메모**:
  - 이 문서는 목록 조회와 화면 출력 책임만 다룹니다.

## 🎯 1. 작업 목표

- **최종 상태**: 사용자가 저장소 목록 페이지에서 각 저장소 이름을 확인하고 선택 진입의 출발점을 볼 수 있습니다.
- **이번 작업의 최소 결과물**:
  - `apps/web/src/pages/repository-list-page.tsx`
  - `apps/web/src/widgets/repository-list/ui/repository-list.tsx`
  - `apps/web/src/entities/repository/model/repository-list-query.ts`
- **성공 기준 (AC)**:
  - 저장소 목록 페이지가 라우팅된다.
  - 저장소 이름이 리스트 형태로 렌더링된다.
  - 빈 목록일 때 안내 상태가 함께 정의된다.

## 📂 2. 대상 아티팩트

- **신규 생성**:
  - `apps/web/src/pages/repository-list-page.tsx`
  - `apps/web/src/widgets/repository-list/ui/repository-list.tsx`
  - `apps/web/src/entities/repository/model/repository-list-query.ts`
- **수정 대상**:
  - `apps/web/src/app/router.tsx`
- **이번 작업에서 수정하지 않음**:
  - `apps/web/src/features/repository-create/**`
  - `apps/web/src/features/repository-delete/**`
- **아티팩트 작성 규칙**:
  - 파일 경로는 `apps/web`, `apps/api`, `packages/shared` 기준의 실제 예상 위치로 고정합니다.
  - 후속 태스크 책임 파일은 같은 폴더에 있더라도 이번 문서 범위에서 같이 닫지 않습니다.

## 🛠️ 3. 상세 기술 사양

- **핵심 구현 대상**:
  - `repository-list-query.ts`는 저장소 목록 fetch와 로딩/에러 상태를 제공합니다.
  - `repository-list.tsx`는 빈 상태, 로딩 상태, 목록 렌더링을 담당합니다.
  - `repository-list-page.tsx`는 페이지 레이아웃과 위젯 조합만 담당합니다.
- **데이터 모델 해석**:
  - 목록 항목 최소 정보는 `id`, `name`, `createdAt`입니다.
  - 정렬 세부 규칙은 다음 태스크 전까지 query 기본 순서를 그대로 사용합니다.
- **외부 의존성**:
  - `react-router-dom`
  - `@tanstack/react-query` 또는 팀 표준 query 도구
  - `@/shared/api` fetch 유틸
- **import/export 규칙**:
  - page는 entity query를 직접 호출하지 않고 widget을 통해 소비합니다.
  - widget은 feature 액션을 호출하지 않고 조회 결과만 렌더링합니다.
- **권장 네이밍**:
  - `RepositoryListPage`, `RepositoryList`, `useRepositoryListQuery`, `isEmptyState`
- **이름별 사용 의도와 적용 시점**:
  - `useRepositoryListQuery`는 목록 조회 책임을 고정할 때 사용합니다.
  - `isEmptyState`는 빈 목록 분기를 읽기 쉽게 만들 때 사용합니다.
- **인수 이름 가이드**:
  - `repositories`, `isLoading`, `isEmptyState`
- **짧은 예시 골격**:

```tsx
const { repositories, isLoading } = useRepositoryListQuery();

return <RepositoryList repositories={repositories} isLoading={isLoading} />;
```

- **필수 describe/it 목록**:
  - `describe('RepositoryList')`
  - `it('저장소 이름 목록을 렌더링한다')`
  - `it('빈 목록일 때 빈 상태 메시지를 보여준다')`
  - `it('로딩 상태일 때 스켈레톤을 보여준다')`
- **최소 테스트 개수**:
  - 최소 3개
- **반드시 포함할 실패 시나리오**:
  - 빈 목록과 로딩 상태를 구분하지 못하는 경우
  - 페이지 컴포넌트가 조회 로직과 렌더링 로직을 한 파일에 과도하게 섞는 경우

## ⚖️ 4. 기술 제약 및 규칙

- 목록 표시 태스크에서는 정렬 UI를 추가하지 않습니다.
- 비어 있는 상태 문구를 반드시 정의합니다.
- 목록 아이템 클릭 동작은 TASK-033에서 닫습니다.

## 🧪 5. 검증 시나리오 및 단언

1. **정상 시나리오: 목록 렌더링**
   - 저장소 두 개를 조회한다.
   - 이름이 리스트로 표시된다.

2. **경계 시나리오: 빈 목록**
   - 저장소가 하나도 없다.
   - 빈 상태 메시지와 생성 CTA만 노출된다.

3. **실패 시나리오: 상태 혼합**
   - 로딩 중인데 빈 상태 메시지가 동시에 보인다.
   - UI 테스트가 상태 분리를 검증해야 한다.

## 🚀 6. 권장 작업 순서

1. `repository-list-query.ts`를 만들고 목록 조회 훅을 구현합니다.
2. `repository-list.tsx`에서 로딩/빈 상태/정상 상태를 나눠 렌더링합니다.
3. `repository-list-page.tsx`와 라우터를 연결합니다.
4. 목록/빈 상태/로딩 상태 테스트를 추가합니다.

- **검증 실행**:
  - `pnpm --filter @chess-db/web test`
  - `pnpm --filter @chess-db/web build`

## ✅ 7. 완료 판정 체크리스트

- [ ] 저장소 목록 페이지가 존재한다.
- [ ] 저장소 이름을 목록으로 보여준다.
- [ ] 빈 상태와 로딩 상태가 분리되어 있다.

## 💬 9. 추천 커밋 메시지

- `feat: 저장소 목록 화면과 조회 위젯을 추가`
