# 📋 개별 작업 지침서: 정식 기보 어노테이션 조회와 표시 (TASK-044)

**작업 상태**: 대기 중  
**선행 작업**: `[TASK-041]` (기보 상세 수순 목록 표시)  
**후속 작업**: `[TASK-045]` (코멘트 수정과 자동 저장)  
**연관 설계**: `[../architecture/directory-structure.md]`, `[../architecture/project-rules.md]`

---

## 0. 현재 코드 상태와 이 작업의 위치

- **현재 상태 요약**: 상세 편집 화면에서 저장된 착수 평가 기호를 읽어 보여주는 별도 기준이 없습니다.
- **이 작업의 책임**: 정식 저장된 기보의 어노테이션을 상세 편집 뷰에서 조회하고 표시합니다.
- **이번 작업에서 하지 않는 것**: 어노테이션 수정은 `[TASK-046]`에서 다룹니다.
- **경계 메모**:
  - 조회와 표시만 다루고, 수정은 `[TASK-046]`에서 다룹니다.

## 🎯 1. 작업 목표

- **최종 상태**: 상세 뷰에서 반수별 어노테이션을 확인할 수 있습니다.
- **이번 작업의 최소 결과물**:
  - `apps/web/src/widgets/game-detail-moves/ui/game-detail-annotation.tsx`
  - `apps/web/src/widgets/game-detail-moves/ui/game-detail-move-list.tsx`
  - `apps/web/src/entities/game/model/game-detail-query.ts`
- **성공 기준 (AC)**:
  - 정식 저장된 기보의 어노테이션을 상세 뷰에서 조회할 수 있다.
  - 어노테이션은 반수와 연결되어 표시된다.
  - 코멘트 조회 규칙과 함께 동작하지만 별도 데이터로 분리되고, 어노테이션 수정 Task가 같은 연결을 재사용할 수 있다.

## 📂 2. 대상 아티팩트

- **신규 생성**:
  - `apps/web/src/widgets/game-detail-moves/ui/game-detail-annotation.tsx`
- **수정 대상**:
  - `apps/web/src/widgets/game-detail-moves/ui/game-detail-move-list.tsx`
  - `apps/web/src/entities/game/model/game-detail-query.ts`
- **이번 작업에서 수정하지 않음**:
  - `apps/web/src/features/game-annotation-edit/**`
- **아티팩트 작성 규칙**:
  - 파일 경로는 `apps/web`, `apps/api`, `packages/shared` 기준의 실제 예상 위치로 고정합니다.
  - 후속 태스크 책임 파일은 같은 폴더에 있더라도 이번 문서 범위에서 같이 닫지 않습니다.

## 🛠️ 3. 상세 기술 사양

- **핵심 구현 대상**:
  - query DTO에 `annotation` 필드를 포함합니다.
  - `game-detail-annotation.tsx`는 기호를 inline badge 또는 텍스트로 표시합니다.
- **데이터 모델 해석**:
  - 어노테이션은 고정된 기호 집합 중 하나 또는 없음입니다.
- **외부 의존성**:
  - `@/shared/ui/badge`
- **import/export 규칙**:
  - 이번 태스크의 표시 컴포넌트에서 수정 action을 import하지 않습니다.
- **권장 네이밍**:
  - `GameDetailAnnotation`, `moveAnnotation`, `selectedAnnotation`
- **이름별 사용 의도와 적용 시점**:
  - `selectedAnnotation`은 현재 선택 반수의 기호를 표시할 때 사용합니다.
- **인수 이름 가이드**:
  - `annotation`, `plyIndex`
- **짧은 예시 골격**:

```tsx
<GameDetailAnnotation annotation={move.annotation} />
```

- **필수 describe/it 목록**:
  - `describe('GameDetailAnnotation')`
  - `it('반수별 어노테이션을 표시한다')`
  - `it('어노테이션이 없으면 빈 상태를 유지한다')`
- **최소 테스트 개수**:
  - 최소 2개
- **반드시 포함할 실패 시나리오**:
  - 코멘트와 어노테이션을 같은 필드로 취급해 섞는 경우

## ⚖️ 4. 기술 제약 및 규칙

- 어노테이션과 코멘트는 분리된 데이터로 유지합니다.

## 🧪 5. 검증 시나리오 및 단언

1. **정상 시나리오: 어노테이션 표시**
   - 어노테이션이 있는 반수 렌더링
   - 기호가 보인다.

2. **실패 시나리오: 데이터 혼합**
   - 코멘트 필드를 읽어 어노테이션처럼 표시
   - 타입 또는 UI 테스트 실패

## 🚀 6. 권장 작업 순서

1. 상세 query에 어노테이션 필드를 포함합니다.
2. 조회용 어노테이션 컴포넌트를 추가합니다.
3. 수순 목록에 어노테이션 표시를 연결합니다.
4. 표시/미표시 상태 테스트를 추가합니다.

- **검증 실행**:
  - `pnpm --filter @chess-db/web test`
  - `pnpm --filter @chess-db/web build`

## ✅ 7. 완료 판정 체크리스트

- [ ] 어노테이션을 조회할 수 있다.
- [ ] 반수와 연결되어 표시된다.
- [ ] 코멘트 데이터와 분리되어 있다.

## 💬 9. 추천 커밋 메시지

- `feat: 정식 기보 어노테이션 조회와 표시를 추가`
