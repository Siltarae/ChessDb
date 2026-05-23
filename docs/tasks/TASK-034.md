# 📋 개별 작업 지침서: 저장소 기본 화면을 보드뷰로 고정 (TASK-034)

**작업 상태**: 완료  
**선행 작업**: `[TASK-033]` (저장소 선택 진입)  
**후속 작업**: `[TASK-035]` (새 기보 작성 버튼과 입력 뷰 전환)  
**연관 설계**: `[../architecture/directory-structure.md]`, `[../architecture/project-rules.md]`

---

## 0. 현재 코드 상태와 이 작업의 위치

- **현재 상태 요약**: 저장소 내부 경로 진입 시 FEATURE-002에서 만든 보드 중심 뷰가 기본 화면으로 렌더링됩니다.
- **이 작업의 책임**: 저장소 진입 직후 FEATURE-002에서 만든 보드 중심 뷰가 기본 landing이 되도록 고정했습니다.
- **이번 작업에서 하지 않는 것**: FEATURE-006 통계 분석 기능, 새 기보 작성 전환, 기존 기보 업데이트 저장, 작업 상태 복원은 후속 태스크에서 다룹니다.
- **경계 메모**:
  - 기본 보드뷰 표시와 저장 버튼 위치만 다룹니다.

## 🎯 1. 작업 목표

- **최종 상태**: 사용자가 저장소에 진입하면 저장소 기본 보드뷰가 가장 먼저 보입니다.
- **이번 작업의 최소 결과물**:
  - `apps/web/src/app/router.tsx`
  - `apps/web/src/pages/repository-home-page.tsx`
- **성공 기준 (AC)**:
  - 저장소 진입 시 기본 보드뷰가 보인다.
  - 기본 보드뷰가 새 기보 입력 화면과 FEATURE-006 통계 분석 화면과 구분된다.
  - 저장 버튼 위치는 고정되지만 실제 업데이트 저장은 실행하지 않는다.
  - 기본 화면 규칙이 문서와 라우터 모두에 드러난다.

## 📂 2. 대상 아티팩트

- **신규 생성**:
  - 없음
- **수정 대상**:
  - `apps/web/src/app/router.tsx`
  - `apps/web/src/pages/repository-home-page.tsx`
- **이번 작업에서 수정하지 않음**:
  - `apps/web/src/pages/notation-input-page.tsx`
- **아티팩트 작성 규칙**:
  - 파일 경로는 `apps/web`, `apps/api`, `packages/shared` 기준의 실제 예상 위치로 고정합니다.
  - 후속 태스크 책임 파일은 같은 폴더에 있더라도 이번 문서 범위에서 같이 닫지 않습니다.

## 🛠️ 3. 상세 기술 사양

- **핵심 구현 대상**:
  - 저장소 내부 index route에서 바로 기본 보드뷰를 렌더링합니다.
  - FEATURE-002의 보드 중심 UI를 재사용합니다.
  - 저장 버튼은 toolbar 위치만 고정하고 비활성 상태로 둡니다.
- **데이터 모델 해석**:
  - 저장소 컨텍스트 안의 첫 화면은 기본 보드뷰 하나로 고정합니다.
- **외부 의존성**:
  - `react-router-dom`
- **import/export 규칙**:
  - 저장소 내부 기본 route에서 하위 redirect 없이 기본 보드뷰를 렌더링합니다.
- **권장 네이밍**:
  - `RepositoryHomePage`, `RepositoryBoard`, `repositoryId`
- **이름별 사용 의도와 적용 시점**:
  - `RepositoryBoard`는 저장소 내부 기본 보드뷰를 나타낼 때만 사용합니다.
- **인수 이름 가이드**:
  - `repositoryId`
- **짧은 예시 골격**:

```tsx
<Route path="/repositories/:repositoryId" element={<RepositoryHomePage />} />
```

- **필수 describe/it 목록**:
  - `describe('RepositoryHomePage')`
  - `it('저장소 기본 보드뷰를 렌더링한다')`
- **최소 테스트 개수**:
  - 최소 1개
- **반드시 포함할 실패 시나리오**:
  - 기본 보드뷰가 FEATURE-006 통계 분석 화면과 섞이는 경우

## ⚖️ 4. 기술 제약 및 규칙

- 기본 화면은 저장소 기본 보드뷰 하나로 고정합니다.
- 새 기보 입력 전환 CTA는 여기서 추가하지 않습니다.
- 기존 기보 업데이트 저장 기능은 `[TASK-104]`에서 추가합니다.
- 원본 기준 작업 상태 복원 기능은 `[TASK-105]`에서 추가합니다.

## 🧪 5. 검증 시나리오 및 단언

1. **정상 시나리오: 저장소 진입**
   - 저장소 path 접근
   - 기본 보드뷰 렌더링

2. **실패 시나리오: 통계 분석 화면 혼입**
   - FEATURE-006의 다음 수 후보/승률 영역이 기본 보드뷰에 노출
   - 테스트가 실패해야 한다.

## 🚀 6. 권장 작업 순서

1. 저장소 home page 테스트를 기본 보드뷰 기준으로 변경합니다.
2. 저장소 home page에서 FEATURE-002 보드 shell을 재사용합니다.
3. 저장 버튼 위치를 비활성 상태로 고정합니다.

- **검증 실행**:
  - `pnpm --filter @chess-db/web test -- repository-home-page.spec.tsx`
  - `pnpm --filter @chess-db/web test`
  - `pnpm --filter @chess-db/web build`

## ✅ 7. 완료 판정 체크리스트

- [x] 저장소 기본 화면이 보드뷰다.
- [x] 기본 landing 규칙이 라우터 한 곳에 있다.
- [x] 새 기보 입력 화면과 혼동되지 않는다.
- [x] 기존 기보 업데이트 저장은 후속 Task로 분리되어 있다.

## 💬 9. 추천 커밋 메시지

- `feat: 저장소 기본 화면을 보드뷰로 고정`
