# 📋 개별 작업 지침서: 수순 선택 시 보드 이동 (TASK-042)

**작업 상태**: 대기 중  
**선행 작업**: `[TASK-040]` (기보 상세 보드 표시), `[TASK-041]` (기보 상세 수순 목록 표시)  
**후속 작업**: `[TASK-043]` (코멘트 조회와 표시)  
**연관 설계**: `[../architecture/project-rules.md]`, `[../architecture/patterns.md]`

---

## 0. 현재 코드 상태와 이 작업의 위치

- **현재 상태 요약**: 상세 편집 화면에 보드와 수순 목록은 있어도 둘이 같은 시점을 가리키도록 동기화하는 상호작용이 없습니다.
- **이 작업의 책임**: 수순 목록의 특정 반수를 선택하면 상세 편집 보드가 해당 시점으로 이동하도록 연결합니다.
- **이번 작업에서 하지 않는 것**: 저장된 코멘트/어노테이션 표시와 수정은 후속 태스크로 남깁니다.
- **경계 메모**:
  - 수순-보드 동기화만 다루고, 수순 수정은 `[TASK-103]`에서 다룹니다.

## 🎯 1. 작업 목표

- **최종 상태**: 사용자가 상세 편집 화면에서 특정 수를 선택하면 해당 시점 보드 상태가 보입니다.
- **이번 작업의 최소 결과물**:
  - `apps/web/src/features/game-detail-navigation/model/use-game-detail-navigation.ts`
  - `apps/web/src/widgets/game-detail-moves/ui/game-detail-move-list.tsx`
  - `apps/web/src/widgets/game-detail-board/ui/game-detail-board.tsx`
- **성공 기준 (AC)**:
  - 수순 선택 시 보드가 같은 시점으로 이동한다.
  - 선택된 수순과 보드 상태가 같은 반수 인덱스를 가리킨다.
  - 기본 선택 상태가 명확히 정의된다.

## 📂 2. 대상 아티팩트

- **신규 생성**:
  - `apps/web/src/features/game-detail-navigation/model/use-game-detail-navigation.ts`
- **수정 대상**:
  - `apps/web/src/widgets/game-detail-moves/ui/game-detail-move-list.tsx`
  - `apps/web/src/widgets/game-detail-board/ui/game-detail-board.tsx`
  - `apps/web/src/pages/game-detail-page.tsx`
- **이번 작업에서 수정하지 않음**:
  - `apps/web/src/features/game-comment-edit/**`
  - `apps/web/src/features/game-annotation-edit/**`
- **아티팩트 작성 규칙**:
  - 파일 경로는 `apps/web`, `apps/api`, `packages/shared` 기준의 실제 예상 위치로 고정합니다.
  - 후속 태스크 책임 파일은 같은 폴더에 있더라도 이번 문서 범위에서 같이 닫지 않습니다.

## 🛠️ 3. 상세 기술 사양

- **핵심 구현 대상**:
  - `use-game-detail-navigation`은 `selectedPlyIndex`와 현재 보드 스냅샷 계산을 제공합니다.
  - 수순 목록 item click이 `setSelectedPlyIndex`를 호출합니다.
  - 보드 위젯은 현재 선택 스냅샷만 입력으로 받습니다.
- **데이터 모델 해석**:
  - 상세 데이터는 반수별 스냅샷 또는 재생 가능한 히스토리를 포함해야 합니다.
- **외부 의존성**:
  - `react`
- **import/export 규칙**:
  - 보드와 수순 목록은 navigation 훅을 통해서만 선택 상태를 공유합니다.
- **권장 네이밍**:
  - `useGameDetailNavigation`, `selectedPlyIndex`, `currentBoardState`, `setSelectedPlyIndex`
- **이름별 사용 의도와 적용 시점**:
  - `selectedPlyIndex`는 수순 목록 강조와 보드 스냅샷 계산의 공통 기준으로 유지합니다.
- **인수 이름 가이드**:
  - `plyIndex`, `historySnapshots`
- **짧은 예시 골격**:

```tsx
const { selectedPlyIndex, currentBoardState, setSelectedPlyIndex } = useGameDetailNavigation(data);
```

- **필수 describe/it 목록**:
  - `describe('useGameDetailNavigation')`
  - `it('반수 선택 시 currentBoardState가 해당 시점으로 바뀐다')`
  - `it('수순 목록과 보드가 같은 selectedPlyIndex를 공유한다')`
- **최소 테스트 개수**:
  - 최소 2개
- **반드시 포함할 실패 시나리오**:
  - 수순 강조 인덱스와 보드 스냅샷 인덱스가 달라지는 경우

## ⚖️ 4. 기술 제약 및 규칙

- 상태 공유는 한 훅 또는 한 page state에서만 관리합니다.
- 입력용 합법 수 강조 로직은 이번 태스크에 도입하지 않습니다.

## 🧪 5. 검증 시나리오 및 단언

1. **정상 시나리오: 특정 수 선택**
   - 수순 목록의 12번째 반수를 클릭한다.
   - 보드가 12번째 반수 시점으로 이동한다.

2. **실패 시나리오: 보드-목록 불일치**
   - 목록 강조는 바뀌지만 보드는 이전 상태를 유지한다.
   - 선택 인덱스 일치 테스트가 실패해야 한다.

## 🚀 6. 권장 작업 순서

1. navigation 훅을 구현합니다.
2. 수순 목록 클릭 이벤트를 연결합니다.
3. 보드 위젯이 현재 선택 스냅샷을 읽도록 정리합니다.
4. 선택 동기화 테스트를 추가합니다.

- **검증 실행**:
  - `pnpm --filter @chess-db/web test`
  - `pnpm --filter @chess-db/web build`

## ✅ 7. 완료 판정 체크리스트

- [ ] 수순 선택 시 보드가 같은 시점으로 이동한다.
- [ ] 선택 인덱스가 보드와 목록에서 공유된다.
- [ ] 기본 선택 상태가 명확하다.

## 💬 9. 추천 커밋 메시지

- `feat: 기보 상세 수순 선택과 보드 이동을 연결 (TASK-042)`
