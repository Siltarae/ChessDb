# 📋 개별 작업 지침서: 정식 기보 코멘트 조회와 표시 (TASK-043)

**작업 상태**: 대기 중  
**선행 작업**: `[TASK-041]` (기보 상세 수순 목록 표시)  
**후속 작업**: `[TASK-044]` (어노테이션 조회와 표시)  
**연관 설계**: `[../architecture/directory-structure.md]`, `[../architecture/project-rules.md]`

---

## 0. 현재 코드 상태와 이 작업의 위치

- **현재 상태 요약**: 상세 편집 화면에서 수순 목록은 볼 수 있지만 저장된 코멘트를 읽어 보여주는 기준이 없습니다.
- **이 작업의 책임**: 정식 저장된 기보의 반수별 코멘트를 상세 편집 화면에서 조회하고 표시합니다.
- **이번 작업에서 하지 않는 것**: 코멘트 수정과 자동 저장은 `[TASK-045]`에서 다룹니다.
- **경계 메모**:
  - 조회와 표시만 다루고, 수정은 `[TASK-045]`에서 다룹니다.

## 🎯 1. 작업 목표

- **최종 상태**: 상세 뷰에서 반수에 연결된 코멘트를 읽을 수 있습니다.
- **이번 작업의 최소 결과물**:
  - `apps/web/src/widgets/game-detail-moves/ui/game-detail-comment.tsx`
  - `apps/web/src/pages/game-detail-page.tsx`
  - `apps/web/src/entities/game/model/game-detail-query.ts`
- **성공 기준 (AC)**:
  - 정식 저장된 기보의 코멘트를 상세 뷰에서 조회할 수 있다.
  - 코멘트는 반수와 연결되어 표시된다.
  - 코멘트 수정 Task가 같은 반수 연결을 재사용할 수 있다.

## 📂 2. 대상 아티팩트

- **신규 생성**:
  - `apps/web/src/widgets/game-detail-moves/ui/game-detail-comment.tsx`
- **수정 대상**:
  - `apps/web/src/pages/game-detail-page.tsx`
  - `apps/web/src/entities/game/model/game-detail-query.ts`
  - `apps/web/src/widgets/game-detail-moves/ui/game-detail-move-list.tsx`
- **이번 작업에서 수정하지 않음**:
  - `apps/web/src/features/game-comment-edit/**`
- **아티팩트 작성 규칙**:
  - 파일 경로는 `apps/web`, `apps/api`, `packages/shared` 기준의 실제 예상 위치로 고정합니다.
  - 후속 태스크 책임 파일은 같은 폴더에 있더라도 이번 문서 범위에서 같이 닫지 않습니다.

## 🛠️ 3. 상세 기술 사양

- **핵심 구현 대상**:
  - 상세 query DTO에 반수별 코멘트를 포함합니다.
  - `game-detail-comment.tsx`는 현재 선택 반수의 코멘트 또는 목록 inline 코멘트를 렌더링합니다.
- **데이터 모델 해석**:
  - 코멘트는 반수와 1:1 또는 optional 관계입니다.
- **외부 의존성**:
  - `@/shared/ui/card`
- **import/export 규칙**:
  - 조회 컴포넌트는 수정 action을 import하지 않습니다.
- **권장 네이밍**:
  - `GameDetailComment`, `selectedMoveComment`, `moveComment`
- **이름별 사용 의도와 적용 시점**:
  - `selectedMoveComment`는 현재 선택 반수에 연결된 코멘트를 뜻할 때 사용합니다.
- **인수 이름 가이드**:
  - `comment`, `plyIndex`
- **짧은 예시 골격**:

```tsx
<GameDetailComment comment={selectedMoveComment} />
```

- **필수 describe/it 목록**:
  - `describe('GameDetailComment')`
  - `it('선택 반수의 코멘트를 표시한다')`
  - `it('코멘트가 없으면 비어 있는 상태를 보여준다')`
- **최소 테스트 개수**:
  - 최소 2개
- **반드시 포함할 실패 시나리오**:
  - 다른 반수의 코멘트를 잘못 표시하는 경우

## ⚖️ 4. 기술 제약 및 규칙

- 이번 태스크의 조회 컴포넌트는 수정 입력 UI를 포함하지 않습니다.

## 🧪 5. 검증 시나리오 및 단언

1. **정상 시나리오: 코멘트 표시**
   - 코멘트가 있는 반수 선택
   - 해당 코멘트 표시

2. **경계 시나리오: 코멘트 없음**
   - 코멘트가 없는 반수 선택
   - 빈 상태 또는 미입력 문구 표시

## 🚀 6. 권장 작업 순서

1. 상세 query에 코멘트 필드를 포함합니다.
2. 조회용 코멘트 컴포넌트를 추가합니다.
3. 현재 선택 반수와 연결합니다.
4. 표시/미입력 상태 테스트를 추가합니다.

- **검증 실행**:
  - `pnpm --filter @chess-db/web test`
  - `pnpm --filter @chess-db/web build`

## ✅ 7. 완료 판정 체크리스트

- [ ] 코멘트를 조회할 수 있다.
- [ ] 코멘트가 반수와 연결되어 표시된다.
- [ ] 수정 UI와 연결 가능한 반수 기준이 유지된다.

## 💬 9. 추천 커밋 메시지

- `feat: 정식 기보 코멘트 조회와 표시를 추가 (TASK-043)`
