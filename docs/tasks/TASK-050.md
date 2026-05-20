# 📋 개별 작업 지침서: 분석 보드 직접 수 입력 (TASK-050)

**작업 상태**: 대기 중  
**선행 작업**: `[TASK-049]` (초기 포지션 표시), `[TASK-016]` (합법 수 착수와 보드 갱신)  
**후속 작업**: `[TASK-051]` (되돌리기)  
**연관 설계**: `[../architecture/project-rules.md]`, `[../architecture/patterns.md]`

---

## 0. 현재 코드 상태와 이 작업의 위치

- **현재 상태 요약**: 분석 보드에 초기 포지션은 보이지만, 사용자가 직접 수를 두며 포지션을 구성하는 흐름이 없습니다.
- **이 작업의 책임**: 분석 보드에서 합법 수 기반으로 직접 수를 두어 포지션을 구성하는 입력 모델을 연결합니다.
- **이번 작업에서 하지 않는 것**: 다시하기와 통계 조회는 후속 태스크에서 다룹니다.
- **경계 메모**:
  - 직접 수 입력과 상태 갱신만 다룹니다.

## 🎯 1. 작업 목표

- **최종 상태**: 사용자가 분석 보드에서 직접 수를 두어 원하는 포지션을 만들 수 있습니다.
- **이번 작업의 최소 결과물**:
  - `apps/web/src/features/analysis-input/model/use-analysis-board.ts`
  - `apps/web/src/widgets/analysis-board/ui/analysis-board.tsx`
- **성공 기준 (AC)**:
  - 분석용 포지션은 보드에서 수를 직접 두어 만들 수 있다.
  - 입력 방식은 합법 수 기반 입력 모델과 연결된다.
  - 분석용 히스토리가 반수 단위로 쌓인다.

## 📂 2. 대상 아티팩트

- **신규 생성**:
  - 없음
- **수정 대상**:
  - `apps/web/src/features/analysis-input/model/use-analysis-board.ts`
  - `apps/web/src/widgets/analysis-board/ui/analysis-board.tsx`
- **이번 작업에서 수정하지 않음**:
  - `apps/web/src/features/statistics-view/**`
- **아티팩트 작성 규칙**:
  - 파일 경로는 `apps/web`, `apps/api`, `packages/shared` 기준의 실제 예상 위치로 고정합니다.
  - 후속 태스크 책임 파일은 같은 폴더에 있더라도 이번 문서 범위에서 같이 닫지 않습니다.

## 🛠️ 3. 상세 기술 사양

- **핵심 구현 대상**:
  - 선택 기물과 합법 수 강조는 기존 보드 입력 모델을 재사용하거나 분석 전용 훅으로 감쌉니다.
  - 수를 두면 analysis history가 append됩니다.
- **데이터 모델 해석**:
  - 분석 보드도 선형 히스토리와 현재 포인터를 가집니다.
- **외부 의존성**:
  - `@chess-db/shared` move engine
- **import/export 규칙**:
  - 기보 입력 화면과 같은 domain engine을 쓰되, draft 저장 로직은 끌고 오지 않습니다.
- **권장 네이밍**:
  - `makeAnalysisMove`, `analysisHistory`, `selectedSquare`
- **이름별 사용 의도와 적용 시점**:
  - `makeAnalysisMove`는 저장 목적이 아닌 분석용 상태 갱신 액션을 뜻합니다.
- **인수 이름 가이드**:
  - `fromSquare`, `toSquare`, `currentState`
- **짧은 예시 골격**:

```tsx
makeAnalysisMove(fromSquare, toSquare);
```

- **필수 describe/it 목록**:
  - `describe('analysis move input')`
  - `it('분석 보드에서 합법 수를 둘 수 있다')`
  - `it('수를 두면 analysis history가 쌓인다')`
- **최소 테스트 개수**:
  - 최소 2개
- **반드시 포함할 실패 시나리오**:
  - 불법 수가 그대로 적용되는 경우

## ⚖️ 4. 기술 제약 및 규칙

- draft 저장 로직을 붙이지 않습니다.
- 분석 보드용 히스토리는 독립적으로 유지합니다.

## 🧪 5. 검증 시나리오 및 단언

1. **정상 시나리오: 직접 수 입력**
   - 합법 수 선택
   - 보드 상태 갱신

2. **실패 시나리오: 불법 수 입력**
   - 허용되지 않은 칸으로 이동 시도
   - 상태가 바뀌지 않아야 함

## 🚀 6. 권장 작업 순서

1. 분석 상태 훅에 move action을 추가합니다.
2. 보드 위젯 클릭 입력을 연결합니다.
3. 히스토리 append 테스트를 추가합니다.

- **검증 실행**:
  - `pnpm --filter @chess-db/web test`
  - `pnpm --filter @chess-db/web build`

## ✅ 7. 완료 판정 체크리스트

- [ ] 분석 보드에서 직접 수를 둘 수 있다.
- [ ] 합법 수 기반 입력 모델을 사용한다.
- [ ] 분석 히스토리가 쌓인다.

## 💬 9. 추천 커밋 메시지

- `feat: 분석 보드 직접 수 입력을 연결`
