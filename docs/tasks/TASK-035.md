# 📋 개별 작업 지침서: 새 기보 작성 버튼과 입력 뷰 전환 (TASK-035)

**작업 상태**: 대기 중  
**선행 작업**: `[TASK-034]` (기본 화면 고정), `[TASK-024]` (기존 초안 폐기 후 새 기보 시작)  
**후속 작업**: `[TASK-037]` (기보 목록 조회)  
**연관 설계**: `[../architecture/directory-structure.md]`, `[../architecture/patterns.md]`

---

## 0. 현재 코드 상태와 이 작업의 위치

- **현재 상태 요약**: 저장소 기본 화면은 분석 보드로 고정되었지만, 거기서 기보 입력 화면으로 넘어가는 명시적 진입 동작이 없습니다.
- **이 작업의 책임**: 분석 보드 화면의 새 기보 작성 버튼과 기보 입력 뷰 전환 규칙을 구현합니다.
- **이번 작업에서 하지 않는 것**: 기보 입력 화면 내부 편집 기능은 기존 FEATURE-002/003 태스크 범위로 남깁니다.
- **경계 메모**:
  - 이 문서는 진입 CTA와 라우트 전환만 다룹니다.

## 🎯 1. 작업 목표

- **최종 상태**: 사용자가 분석 보드에서 새 기보 작성 버튼을 눌러 기보 입력 화면으로 이동합니다.
- **이번 작업의 최소 결과물**:
  - `apps/web/src/features/new-game-entry/ui/start-notation-input-button.tsx`
  - `apps/web/src/features/new-game-entry/model/use-start-notation-input.ts`
  - `apps/web/src/pages/analysis-board-page.tsx`
- **성공 기준 (AC)**:
  - 분석 보드 화면에 새 기보 작성 버튼이 존재한다.
  - 버튼 클릭 시 기보 입력 뷰로 이동한다.
  - 기존 초안이 있으면 초안 폐기 확인 규칙과 연결할 수 있는 진입 훅이 마련된다.

## 📂 2. 대상 아티팩트

- **신규 생성**:
  - `apps/web/src/features/new-game-entry/ui/start-notation-input-button.tsx`
  - `apps/web/src/features/new-game-entry/model/use-start-notation-input.ts`
- **수정 대상**:
  - `apps/web/src/pages/analysis-board-page.tsx`
  - `apps/web/src/app/router.tsx`
- **이번 작업에서 수정하지 않음**:
  - `apps/web/src/pages/notation-input-page.tsx` 내부 편집 UI
- **아티팩트 작성 규칙**:
  - 파일 경로는 `apps/web`, `apps/api`, `packages/shared` 기준의 실제 예상 위치로 고정합니다.
  - 후속 태스크 책임 파일은 같은 폴더에 있더라도 이번 문서 범위에서 같이 닫지 않습니다.

## 🛠️ 3. 상세 기술 사양

- **핵심 구현 대상**:
  - `use-start-notation-input`은 필요 시 초안 확인 로직을 감싸고 최종 navigate를 수행합니다.
  - `start-notation-input-button.tsx`는 CTA와 disabled/loading 상태만 담당합니다.
  - analysis board page는 CTA를 배치하고 진입 이유를 설명하는 카피를 둘 수 있습니다.
- **데이터 모델 해석**:
  - 입력 뷰 진입에 필요한 최소 정보는 `repositoryId`와 초안 존재 여부입니다.
- **외부 의존성**:
  - `react-router-dom`
  - `zustand` 또는 draft 존재 여부 selector
- **import/export 규칙**:
  - 초안 존재 확인 로직은 button 컴포넌트가 아니라 hook에서 처리합니다.
- **권장 네이밍**:
  - `useStartNotationInput`, `startNotationInput`, `hasDraftToReplace`
- **이름별 사용 의도와 적용 시점**:
  - `hasDraftToReplace`는 기존 초안 폐기 확인 다이얼로그 연결 시 사용합니다.
- **인수 이름 가이드**:
  - `repositoryId`, `hasDraftToReplace`
- **짧은 예시 골격**:

```tsx
const startNotationInput = useStartNotationInput();
<Button onClick={() => startNotationInput(repositoryId)}>새 기보 작성</Button>;
```

- **필수 describe/it 목록**:
  - `describe('useStartNotationInput')`
  - `it('새 기보 작성 버튼 클릭 시 입력 뷰로 navigate한다')`
  - `it('기존 초안이 있으면 확인 흐름을 먼저 호출한다')`
- **최소 테스트 개수**:
  - 최소 2개
- **반드시 포함할 실패 시나리오**:
  - 초안 확인 없이 곧바로 draft를 덮어쓰는 경우

## ⚖️ 4. 기술 제약 및 규칙

- 초안 폐기 확인은 TASK-024에서 정한 규칙을 재사용합니다.
- 새 기보 작성 CTA는 분석 보드에만 둡니다.

## 🧪 5. 검증 시나리오 및 단언

1. **정상 시나리오: 새 기보 작성 진입**
   - 버튼 클릭
   - notation input route로 이동

2. **경계 시나리오: 기존 초안 존재**
   - 초안이 있는 상태에서 버튼 클릭
   - 확인 흐름 후 이동

## 🚀 6. 권장 작업 순서

1. 진입 훅을 구현합니다.
2. 버튼 컴포넌트를 분석 보드 페이지에 배치합니다.
3. 초안 존재 여부 연결을 확인합니다.
4. navigate/확인 흐름 테스트를 추가합니다.

- **검증 실행**:
  - `pnpm --filter @chess-db/web test`
  - `pnpm --filter @chess-db/web build`

## ✅ 7. 완료 판정 체크리스트

- [ ] 분석 보드에서 새 기보 작성 CTA가 보인다.
- [ ] 버튼이 기보 입력 화면으로 이동시킨다.
- [ ] 초안 확인 규칙과 연결할 수 있다.

## 💬 9. 추천 커밋 메시지

- `feat: 분석 보드에서 새 기보 작성 진입을 추가 (TASK-035)`
