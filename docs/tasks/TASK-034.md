# 📋 개별 작업 지침서: 저장소 기본 화면을 분석 보드로 고정 (TASK-034)

**작업 상태**: 대기 중  
**선행 작업**: `[TASK-033]` (저장소 선택 진입)  
**후속 작업**: `[TASK-035]` (새 기보 작성 버튼과 입력 뷰 전환)  
**연관 설계**: `[../architecture/directory-structure.md]`, `[../architecture/project-rules.md]`

---

## 0. 현재 코드 상태와 이 작업의 위치

- **현재 상태 요약**: 저장소 내부 경로는 생길 수 있지만, 진입 직후 어떤 화면이 기본인지 아직 정해지지 않았습니다.
- **이 작업의 책임**: 저장소 진입 직후 분석 보드 화면이 기본 landing이 되도록 라우트 규칙을 고정합니다.
- **이번 작업에서 하지 않는 것**: 분석 보드 내부 기능이나 새 기보 작성 버튼은 후속 태스크에서 다룹니다.
- **경계 메모**:
  - 기본 landing route 규칙만 다룹니다.

## 🎯 1. 작업 목표

- **최종 상태**: 사용자가 저장소에 진입하면 분석 보드가 가장 먼저 보입니다.
- **이번 작업의 최소 결과물**:
  - `apps/web/src/app/router.tsx`
  - `apps/web/src/pages/analysis-board-page.tsx`
- **성공 기준 (AC)**:
  - 저장소 진입 시 분석 보드 경로로 redirect된다.
  - 분석 보드가 새 기보 입력 화면과 구분된다.
  - 기본 화면 규칙이 문서와 라우터 모두에 드러난다.

## 📂 2. 대상 아티팩트

- **신규 생성**:
  - 없음
- **수정 대상**:
  - `apps/web/src/app/router.tsx`
  - `apps/web/src/pages/analysis-board-page.tsx`
- **이번 작업에서 수정하지 않음**:
  - `apps/web/src/pages/notation-input-page.tsx`
- **아티팩트 작성 규칙**:
  - 파일 경로는 `apps/web`, `apps/api`, `packages/shared` 기준의 실제 예상 위치로 고정합니다.
  - 후속 태스크 책임 파일은 같은 폴더에 있더라도 이번 문서 범위에서 같이 닫지 않습니다.

## 🛠️ 3. 상세 기술 사양

- **핵심 구현 대상**:
  - 저장소 내부 index route를 analysis-board page로 연결합니다.
  - 필요하면 redirect 컴포넌트를 사용해 단일 landing rule을 만듭니다.
- **데이터 모델 해석**:
  - 저장소 컨텍스트 안의 첫 화면은 분석 보드 하나로 고정합니다.
- **외부 의존성**:
  - `react-router-dom`
- **import/export 규칙**:
  - router에서 기본 landing을 결정하고 개별 page 컴포넌트는 리다이렉트 로직을 갖지 않습니다.
- **권장 네이밍**:
  - `AnalysisBoardPage`, `repositoryIndexRedirect`
- **이름별 사용 의도와 적용 시점**:
  - `repositoryIndexRedirect`는 저장소 내부 첫 진입 분기를 나타낼 때만 사용합니다.
- **인수 이름 가이드**:
  - `repositoryId`
- **짧은 예시 골격**:

```tsx
<Route index element={<Navigate to="analysis" replace />} />
```

- **필수 describe/it 목록**:
  - `describe('repository index route')`
  - `it('저장소 index 진입 시 분석 보드로 이동한다')`
- **최소 테스트 개수**:
  - 최소 1개
- **반드시 포함할 실패 시나리오**:
  - 기본 landing이 기보 입력 화면과 섞이는 경우

## ⚖️ 4. 기술 제약 및 규칙

- 기본 화면은 분석 보드 하나로 고정합니다.
- 새 기보 입력 전환 CTA는 여기서 추가하지 않습니다.

## 🧪 5. 검증 시나리오 및 단언

1. **정상 시나리오: 저장소 진입**
   - 저장소 index path 접근
   - analysis route로 redirect

## 🚀 6. 권장 작업 순서

1. router에 저장소 index redirect를 추가합니다.
2. analysis board page 경로를 연결합니다.
3. redirect 테스트를 추가합니다.

- **검증 실행**:
  - `pnpm --filter @chess-db/web test`
  - `pnpm --filter @chess-db/web build`

## ✅ 7. 완료 판정 체크리스트

- [ ] 저장소 기본 화면이 분석 보드다.
- [ ] 기본 landing 규칙이 라우터 한 곳에 있다.
- [ ] 새 기보 입력 화면과 혼동되지 않는다.

## 💬 9. 추천 커밋 메시지

- `feat: 저장소 기본 화면을 분석 보드로 고정`
