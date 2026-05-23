# 📋 개별 작업 지침서: 저장소 선택 진입 (TASK-033)

**작업 상태**: 완료  
**선행 작업**: `[TASK-028]` (저장소 목록 화면 표시)  
**후속 작업**: `[TASK-034]` (기본 화면 고정)  
**연관 설계**: `[../architecture/directory-structure.md]`, `[../architecture/patterns.md]`

---

## 0. 현재 코드 상태와 이 작업의 위치

- **현재 상태 요약**: 저장소 목록 항목 클릭이 `repositoryId` 기반 내부 라우트 진입으로 연결되었습니다.
- **이 작업의 책임**: 저장소 목록 항목 클릭을 저장소 내부 화면 진입으로 연결했습니다.
- **이번 작업에서 하지 않는 것**: 저장소 진입 후 어떤 화면이 기본으로 열리는지는 `[TASK-034]`에서 고정합니다.
- **경계 메모**:
  - 선택 동작과 라우트 전환만 다룹니다.

## 🎯 1. 작업 목표

- **최종 상태**: 사용자가 저장소 하나를 클릭하면 해당 저장소 컨텍스트로 진입합니다.
- **이번 작업의 최소 결과물**:
  - `apps/web/src/features/repository-select/model/use-open-repository.ts`
  - `apps/web/src/app/router.tsx`
  - `apps/web/src/pages/repository-home-page.tsx`
  - `apps/web/src/pages/repository-list-page.tsx`
- **성공 기준 (AC)**:
  - 목록 항목 클릭 시 저장소 id 기반 라우트로 이동한다.
  - 선택 동작이 버튼/링크 접근성을 만족한다.
  - 진입 라우트 규칙이 이후 기본 화면 태스크와 충돌하지 않는다.

## 📂 2. 대상 아티팩트

- **신규 생성**:
  - `apps/web/src/features/repository-select/model/use-open-repository.ts`
  - `apps/web/src/features/repository-select/index.ts`
  - `apps/web/src/pages/repository-home-page.tsx`
- **수정 대상**:
  - `apps/web/src/app/router.tsx`
  - `apps/web/src/pages/index.ts`
  - `apps/web/src/widgets/repository-list/ui/repository-list.tsx`
  - `apps/web/src/pages/repository-list-page.tsx`
- **이번 작업에서 수정하지 않음**:
  - `apps/web/src/pages/analysis-board-page.tsx`의 내부 구성
- **아티팩트 작성 규칙**:
  - 파일 경로는 `apps/web`, `apps/api`, `packages/shared` 기준의 실제 예상 위치로 고정합니다.
  - 후속 태스크 책임 파일은 같은 폴더에 있더라도 이번 문서 범위에서 같이 닫지 않습니다.

## 🛠️ 3. 상세 기술 사양

- **핵심 구현 대상**:
  - `use-open-repository`는 `repositoryId`를 받아 navigate를 수행합니다.
  - `RepositoryList`는 각 항목을 클릭 가능한 row 또는 link로 렌더링합니다.
  - 라우터에 저장소 컨텍스트 경로를 미리 고정합니다.
- **데이터 모델 해석**:
  - 저장소 진입에 필요한 최소 식별자는 `repositoryId`입니다.
- **외부 의존성**:
  - `react-router-dom`
- **import/export 규칙**:
  - 목록 item UI는 navigate 구현을 직접 쓰지 말고 `useOpenRepository`를 통해 호출합니다.
- **권장 네이밍**:
  - `useOpenRepository`, `openRepository`, `repositoryId`
- **이름별 사용 의도와 적용 시점**:
  - `openRepository`는 목록 클릭과 생성 후 진입 모두에서 재사용할 수 있는 동사 이름으로 유지합니다.
- **인수 이름 가이드**:
  - `repositoryId`
- **짧은 예시 골격**:

```tsx
const openRepository = useOpenRepository();
openRepository(repository.id);
```

- **필수 describe/it 목록**:
  - `describe('useOpenRepository')`
  - `it('repositoryId 기반 경로로 navigate한다')`
  - `it('목록 항목 클릭이 openRepository를 호출한다')`
- **최소 테스트 개수**:
  - 최소 2개
- **반드시 포함할 실패 시나리오**:
  - 저장소 이름을 path key로 써서 id와 라우팅 기준이 어긋나는 경우

## ⚖️ 4. 기술 제약 및 규칙

- 저장소 진입 식별자는 이름이 아니라 id를 사용합니다.
- 내부 기본 화면 결정은 다음 태스크로 넘깁니다.

## 🧪 5. 검증 시나리오 및 단언

1. **정상 시나리오: 목록 항목 클릭**
   - 저장소 row 클릭
   - 해당 저장소 경로로 이동

2. **실패 시나리오: 잘못된 식별자**
   - 이름 문자열을 path에 넣음
   - 중복 이름 상황을 가정한 테스트가 실패

## 🚀 6. 권장 작업 순서

1. 저장소 내부 라우트 path를 정의합니다.
2. `use-open-repository`를 구현합니다.
3. 목록 item을 클릭 가능한 UI로 연결합니다.
4. navigate 테스트를 추가합니다.

- **검증 실행**:
  - `pnpm --filter @chess-db/web test`
  - `pnpm --filter @chess-db/web build`

## ✅ 7. 완료 판정 체크리스트

- [x] 저장소 선택이 id 기반 진입으로 연결된다.
- [x] 목록 항목이 접근 가능한 클릭 타겟이다.
- [x] 기본 화면 결정 책임을 넘지 않았다.

## 💬 9. 추천 커밋 메시지

- `feat: 저장소 선택 진입 라우팅을 추가`
