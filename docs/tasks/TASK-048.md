# 📋 개별 작업 지침서: 분석 보드 기본 화면 구성 (TASK-048)

**작업 상태**: 대기 중  
**선행 작업**: `[TASK-034]` (저장소 기본 화면 고정)  
**후속 작업**: `[TASK-049]` (초기 포지션 표시)  
**연관 설계**: `[../architecture/directory-structure.md]`, `[../architecture/patterns.md]`

---

## 0. 현재 코드 상태와 이 작업의 위치

- **현재 상태 요약**: 저장소 기본 화면이 분석 보드여야 한다는 규칙은 있지만 실제 분석 보드 페이지 shell과 위젯 구조가 없습니다.
- **이 작업의 책임**: 분석 보드 페이지와 위젯 골격을 구성해 분석 전용 화면의 레이아웃을 고정합니다.
- **이번 작업에서 하지 않는 것**: 초기 포지션 표시와 직접 수 입력은 후속 태스크에서 다룹니다.
- **경계 메모**:
  - 분석 화면 shell과 상태 진입점만 다룹니다.

## 🎯 1. 작업 목표

- **최종 상태**: 사용자가 저장소에 들어오면 분석 보드 전용 화면 골격을 볼 수 있습니다.
- **이번 작업의 최소 결과물**:
  - `apps/web/src/pages/analysis-board-page.tsx`
  - `apps/web/src/widgets/analysis-board/ui/analysis-board.tsx`
  - `apps/web/src/features/analysis-input/model/use-analysis-board.ts`
- **성공 기준 (AC)**:
  - 분석 보드 페이지가 라우팅된다.
  - 보드 영역과 통계 영역 자리 구성이 분리된다.
  - 분석 전용 상태 훅이 페이지 진입점으로 존재한다.

## 📂 2. 대상 아티팩트

- **신규 생성**:
  - `apps/web/src/pages/analysis-board-page.tsx`
  - `apps/web/src/widgets/analysis-board/ui/analysis-board.tsx`
  - `apps/web/src/features/analysis-input/model/use-analysis-board.ts`
- **수정 대상**:
  - `apps/web/src/app/router.tsx`
- **이번 작업에서 수정하지 않음**:
  - `apps/web/src/widgets/statistics-panel/**`
- **아티팩트 작성 규칙**:
  - 파일 경로는 `apps/web`, `apps/api`, `packages/shared` 기준의 실제 예상 위치로 고정합니다.
  - 후속 태스크 책임 파일은 같은 폴더에 있더라도 이번 문서 범위에서 같이 닫지 않습니다.

## 🛠️ 3. 상세 기술 사양

- **핵심 구현 대상**:
  - `analysis-board.tsx`는 보드 영역, 컨트롤 영역, 통계 슬롯을 가진 위젯 shell입니다.
  - `use-analysis-board`는 현재 분석 상태와 액션 진입점만 노출합니다.
  - page는 저장소 컨텍스트와 위젯 조합만 담당합니다.
- **데이터 모델 해석**:
  - 분석 상태 최소 정보는 현재 보드 스냅샷, 히스토리 포인터, 현재 저장소 id입니다.
- **외부 의존성**:
  - `react-router-dom`
  - `zustand` 또는 page-local state
- **import/export 규칙**:
  - page는 feature hook을 조합하고 위젯은 상태 소비만 담당합니다.
- **권장 네이밍**:
  - `AnalysisBoardPage`, `AnalysisBoard`, `useAnalysisBoard`
- **이름별 사용 의도와 적용 시점**:
  - `useAnalysisBoard`는 분석 화면 전체 상태 진입점 이름으로 고정합니다.
- **인수 이름 가이드**:
  - `repositoryId`, `boardState`
- **짧은 예시 골격**:

```tsx
const { boardState } = useAnalysisBoard(repositoryId);

return <AnalysisBoard boardState={boardState} />;
```

- **필수 describe/it 목록**:
  - `describe('AnalysisBoardPage shell')`
  - `it('분석 보드 페이지를 렌더링한다')`
  - `it('보드와 통계 영역 슬롯을 분리한다')`
- **최소 테스트 개수**:
  - 최소 2개
- **반드시 포함할 실패 시나리오**:
  - 분석 보드와 기보 입력 화면 구조가 뒤섞이는 경우

## ⚖️ 4. 기술 제약 및 규칙

- 분석 화면은 입력 뷰와 다른 목적의 shell을 유지합니다.
- 통계 패널 실제 렌더링은 후속 태스크로 넘깁니다.

## 🧪 5. 검증 시나리오 및 단언

1. **정상 시나리오: 분석 보드 진입**
   - 저장소 기본 route로 진입
   - 분석 보드 shell이 렌더링된다.

2. **실패 시나리오: 화면 목적 혼합**
   - 기보 입력용 수순 편집 UI가 분석 보드에 섞임
   - 레이아웃 테스트가 실패해야 함

## 🚀 6. 권장 작업 순서

1. 분석 보드 page와 widget shell을 작성합니다.
2. 상태 진입 훅을 만듭니다.
3. 라우터와 연결합니다.
4. shell 구조 테스트를 추가합니다.

- **검증 실행**:
  - `pnpm --filter @chess-db/web test`
  - `pnpm --filter @chess-db/web build`

## ✅ 7. 완료 판정 체크리스트

- [ ] 분석 보드 페이지가 존재한다.
- [ ] 전용 위젯 shell이 있다.
- [ ] 분석 상태 진입 훅이 마련된다.

## 💬 9. 추천 커밋 메시지

- `feat: 분석 보드 기본 화면 구조를 추가 (TASK-048)`
