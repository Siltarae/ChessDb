# 📋 개별 작업 지침서: 분석 보드 초기 포지션 표시 (TASK-049)

**작업 상태**: 대기 중  
**선행 작업**: `[TASK-048]` (분석 보드 기본 화면 구성), `[TASK-059]` (게임 상태 모델)  
**후속 작업**: `[TASK-050]` (직접 수 입력)  
**연관 설계**: `[../architecture/project-rules.md]`, `[../architecture/directory-structure.md]`

---

## 0. 현재 코드 상태와 이 작업의 위치

- **현재 상태 요약**: 분석 보드 shell은 있어도 어떤 초기 포지션으로 시작할지와 보드 표시 규칙이 정해지지 않았습니다.
- **이 작업의 책임**: 분석 보드가 표준 초기 포지션으로 시작하고 이를 화면에 렌더링하도록 구현합니다.
- **이번 작업에서 하지 않는 것**: FEN 직접 입력은 현재 범위에 포함하지 않습니다.
- **경계 메모**:
  - 초기 상태 렌더링만 다룹니다.

## 🎯 1. 작업 목표

- **최종 상태**: 분석 보드를 열면 표준 체스 초기 포지션이 보입니다.
- **이번 작업의 최소 결과물**:
  - `apps/web/src/features/analysis-input/model/use-analysis-board.ts`
  - `apps/web/src/widgets/analysis-board/ui/analysis-board.tsx`
- **성공 기준 (AC)**:
  - 분석 보드 초기 포지션 표시 규칙이 정의된다.
  - 초기 상태에서 직접 수를 둘 준비가 된다.
  - FEN 입력 없이도 시작할 수 있다.

## 📂 2. 대상 아티팩트

- **신규 생성**:
  - 없음
- **수정 대상**:
  - `apps/web/src/features/analysis-input/model/use-analysis-board.ts`
  - `apps/web/src/widgets/analysis-board/ui/analysis-board.tsx`
- **이번 작업에서 수정하지 않음**:
  - `apps/web/src/features/analysis-history/**`
- **아티팩트 작성 규칙**:
  - 파일 경로는 `apps/web`, `apps/api`, `packages/shared` 기준의 실제 예상 위치로 고정합니다.
  - 후속 태스크 책임 파일은 같은 폴더에 있더라도 이번 문서 범위에서 같이 닫지 않습니다.

## 🛠️ 3. 상세 기술 사양

- **핵심 구현 대상**:
  - `use-analysis-board`가 초기 `GameState`를 생성합니다.
  - analysis board 위젯은 초기 스냅샷을 그대로 렌더링합니다.
- **데이터 모델 해석**:
  - 초기 분석 상태는 표준 시작 포지션의 `GameState`입니다.
- **외부 의존성**:
  - `@chess-db/shared` 초기 상태 생성 로직
- **import/export 규칙**:
  - 초기 포지션 생성은 shared 또는 model 한 곳에서만 수행합니다.
- **권장 네이밍**:
  - `createInitialAnalysisState`, `initialBoardState`
- **이름별 사용 의도와 적용 시점**:
  - `initialBoardState`는 분석 보드 최초 렌더 상태를 뜻할 때만 사용합니다.
- **인수 이름 가이드**:
  - `initialState`
- **짧은 예시 골격**:

```tsx
const initialBoardState = createInitialAnalysisState();
```

- **필수 describe/it 목록**:
  - `describe('analysis initial position')`
  - `it('분석 보드가 표준 초기 포지션으로 시작한다')`
- **최소 테스트 개수**:
  - 최소 1개
- **반드시 포함할 실패 시나리오**:
  - 분석 보드가 빈 보드로 시작하는 경우

## ⚖️ 4. 기술 제약 및 규칙

- FEN 직접 입력을 추가하지 않습니다.

## 🧪 5. 검증 시나리오 및 단언

1. **정상 시나리오: 초기 포지션 표시**
   - 분석 보드 진입
   - 초기 포지션 렌더링

## 🚀 6. 권장 작업 순서

1. 초기 상태 생성 로직을 model에 추가합니다.
2. 위젯이 그 상태를 렌더링하도록 연결합니다.
3. 초기 렌더 테스트를 추가합니다.

- **검증 실행**:
  - `pnpm --filter @chess-db/web test`
  - `pnpm --filter @chess-db/web build`

## ✅ 7. 완료 판정 체크리스트

- [ ] 초기 포지션이 보인다.
- [ ] 직접 수 입력 준비 상태가 된다.
- [ ] FEN 입력 없이 시작 가능하다.

## 💬 9. 추천 커밋 메시지

- `feat: 분석 보드 초기 포지션 표시 규칙을 추가`
