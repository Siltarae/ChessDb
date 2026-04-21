# 📋 개별 작업 지침서: 기보 상세 보드 표시 (TASK-040)

**작업 상태**: 대기 중  
**선행 작업**: `[TASK-039]` (기보 상세 화면 구성)  
**후속 작업**: `[TASK-041]` (기보 상세 수순 목록 표시)  
**연관 설계**: `[../architecture/directory-structure.md]`, `[../architecture/project-rules.md]`

---

## 0. 현재 코드 상태와 이 작업의 위치

- **현재 상태 요약**: 상세 페이지 shell은 있어도 해당 기보의 현재 보드 상태를 보여주는 위젯이 없습니다.
- **이 작업의 책임**: 상세 화면에 보드 위젯을 추가하고 현재 선택 시점의 기물 배치를 표시합니다.
- **이번 작업에서 하지 않는 것**: 수순 목록과 수순 선택 연동은 뒤 태스크에서 다룹니다.
- **경계 메모**:
  - 조회 중심 보드 렌더링만 다룹니다.

## 🎯 1. 작업 목표

- **최종 상태**: 상세 뷰에서 해당 기보의 보드를 볼 수 있습니다.
- **이번 작업의 최소 결과물**:
  - `apps/web/src/widgets/game-detail-board/ui/game-detail-board.tsx`
  - `apps/web/src/pages/game-detail-page.tsx`
- **성공 기준 (AC)**:
  - 기보 상세 뷰에서 보드가 렌더링된다.
  - 조회 전용 화면으로 동작해 착수 입력 UI가 없다.
  - 초기 선택 시점의 보드 상태를 정확히 반영한다.

## 📂 2. 대상 아티팩트

- **신규 생성**:
  - `apps/web/src/widgets/game-detail-board/ui/game-detail-board.tsx`
- **수정 대상**:
  - `apps/web/src/pages/game-detail-page.tsx`
  - `apps/web/src/entities/game/model/game-detail-query.ts`
- **이번 작업에서 수정하지 않음**:
  - `apps/web/src/widgets/game-detail-moves/**`
- **아티팩트 작성 규칙**:
  - 파일 경로는 `apps/web`, `apps/api`, `packages/shared` 기준의 실제 예상 위치로 고정합니다.
  - 후속 태스크 책임 파일은 같은 폴더에 있더라도 이번 문서 범위에서 같이 닫지 않습니다.

## 🛠️ 3. 상세 기술 사양

- **핵심 구현 대상**:
  - `game-detail-board.tsx`는 상세 query에서 받은 현재 보드 스냅샷을 렌더링합니다.
  - 입력용 보드 위젯과 달리 클릭/착수 이벤트를 노출하지 않습니다.
- **데이터 모델 해석**:
  - 초기 보드 상태는 보통 마지막 수 또는 기본 선택 시점 하나를 기준으로 합니다.
- **외부 의존성**:
  - `@chess-db/shared` 보드 상태 타입
- **import/export 규칙**:
  - 조회 전용 보드 위젯은 make-move feature를 import하지 않습니다.
- **권장 네이밍**:
  - `GameDetailBoard`, `currentBoardState`
- **이름별 사용 의도와 적용 시점**:
  - `currentBoardState`는 상세 화면이 현재 보여주는 스냅샷을 뜻할 때 사용합니다.
- **인수 이름 가이드**:
  - `boardState`
- **짧은 예시 골격**:

```tsx
<GameDetailBoard boardState={currentBoardState} />
```

- **필수 describe/it 목록**:
  - `describe('GameDetailBoard')`
  - `it('조회 전용 보드를 렌더링한다')`
  - `it('착수 입력 핸들러 없이 현재 스냅샷만 반영한다')`
- **최소 테스트 개수**:
  - 최소 2개
- **반드시 포함할 실패 시나리오**:
  - 입력용 보드 컴포넌트를 재사용하면서 클릭 이벤트가 열려 있는 경우

## ⚖️ 4. 기술 제약 및 규칙

- 상세 보드는 조회 전용이어야 합니다.
- 클릭/드래그 기반 착수 로직을 연결하지 않습니다.

## 🧪 5. 검증 시나리오 및 단언

1. **정상 시나리오: 보드 렌더링**
   - 상세 데이터 로드 후 보드 위젯 표시
   - 현재 스냅샷과 같은 배치가 렌더링

2. **실패 시나리오: 입력 이벤트 노출**
   - 보드 셀 클릭으로 합법 수가 강조됨
   - 조회 전용 테스트가 실패해야 함

## 🚀 6. 권장 작업 순서

1. 보드 위젯을 작성합니다.
2. 상세 page shell에 보드 영역을 연결합니다.
3. 입력용 이벤트가 없는지 테스트합니다.

- **검증 실행**:
  - `pnpm --filter @chess-db/web test`
  - `pnpm --filter @chess-db/web build`

## ✅ 7. 완료 판정 체크리스트

- [ ] 상세 화면에 보드가 보인다.
- [ ] 조회 전용 보드로 동작한다.
- [ ] 현재 스냅샷을 정확히 반영한다.

## 💬 9. 추천 커밋 메시지

- `feat: 기보 상세 화면에 조회 전용 보드를 추가 (TASK-040)`
