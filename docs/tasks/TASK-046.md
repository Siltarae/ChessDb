# 📋 개별 작업 지침서: 정식 기보 어노테이션 수정과 자동 저장 (TASK-046)

**작업 상태**: 대기 중  
**선행 작업**: `[TASK-044]` (정식 기보 어노테이션 조회와 표시)  
**후속 작업**: `[TASK-047]` (기보 삭제 확인 및 처리), `[TASK-103]` (정식 기보 수순 수정)  
**연관 설계**: `[../architecture/directory-structure.md]`, `[../architecture/patterns.md]`

---

## 0. 현재 코드 상태와 이 작업의 위치

- **현재 상태 요약**: 정식 저장된 기보 어노테이션을 읽을 수는 있지만 수정해서 바로 저장하는 흐름은 없습니다.
- **이 작업의 책임**: 정식 기보 상세 화면에서 어노테이션을 수정하고 자동 저장합니다.
- **이번 작업에서 하지 않는 것**: 기보 삭제, 기보 정보 수정, 수순 수정은 범위 밖입니다.
- **경계 메모**:
  - 어노테이션 수정과 저장만 다룹니다.

## 🎯 1. 작업 목표

- **최종 상태**: 사용자가 어노테이션을 수정하면 즉시 자동 저장됩니다.
- **이번 작업의 최소 결과물**:
  - `apps/web/src/features/game-annotation-edit/ui/annotation-picker.tsx`
  - `apps/web/src/features/game-annotation-edit/model/use-game-annotation-edit.ts`
  - `apps/web/src/features/game-annotation-edit/api/update-move-annotation.ts`
- **성공 기준 (AC)**:
  - 정식 저장된 기보에도 착수 평가 기호를 추가하거나 수정할 수 있다.
  - 어노테이션 수정은 즉시 자동 저장된다.
  - 코멘트 수정과 병행 가능하지만 별도 책임으로 분리되어 있다.

## 📂 2. 대상 아티팩트

- **신규 생성**:
  - `apps/web/src/features/game-annotation-edit/ui/annotation-picker.tsx`
  - `apps/web/src/features/game-annotation-edit/model/use-game-annotation-edit.ts`
  - `apps/web/src/features/game-annotation-edit/api/update-move-annotation.ts`
- **수정 대상**:
  - `apps/web/src/pages/game-detail-page.tsx`
- **이번 작업에서 수정하지 않음**:
  - `apps/web/src/features/game-comment-edit/**`
  - `apps/web/src/features/game-sequence-edit/**`
- **아티팩트 작성 규칙**:
  - 파일 경로는 `apps/web`, `apps/api`, `packages/shared` 기준의 실제 예상 위치로 고정합니다.
  - 후속 태스크 책임 파일은 같은 폴더에 있더라도 이번 문서 범위에서 같이 닫지 않습니다.

## 🛠️ 3. 상세 기술 사양

- **핵심 구현 대상**:
  - 어노테이션 update API를 작성합니다.
  - `use-game-annotation-edit`는 선택 기호와 자동 저장 mutation을 관리합니다.
  - `annotation-picker.tsx`는 고정된 기호 집합만 제공합니다.
- **데이터 모델 해석**:
  - 정식 기보 어노테이션도 고정된 기호 집합 중 하나 또는 없음입니다.
- **외부 의존성**:
  - `@tanstack/react-query`
  - `@/shared/ui/toggle-group`
- **import/export 규칙**:
  - 코멘트 수정 훅과 분리된 feature로 유지합니다.
- **권장 네이밍**:
  - `useGameAnnotationEdit`, `updateMoveAnnotation`, `selectedAnnotation`, `saveAnnotationDebounced`
- **이름별 사용 의도와 적용 시점**:
  - `selectedAnnotation`은 현재 반수의 저장된 기호와 편집 중 값을 함께 나타낼 때 사용합니다.
- **인수 이름 가이드**:
  - `gameId`, `plyIndex`, `nextAnnotation`
- **짧은 예시 골격**:

```tsx
const { selectedAnnotation, updateAnnotation } = useGameAnnotationEdit(gameId, plyIndex);
```

- **필수 describe/it 목록**:
  - `describe('useGameAnnotationEdit')`
  - `it('기호 선택 후 자동 저장 mutation을 호출한다')`
  - `it('허용 목록 밖 값은 저장하지 않는다')`
- **최소 테스트 개수**:
  - 최소 2개
- **반드시 포함할 실패 시나리오**:
  - 허용되지 않은 기호를 서버로 보내는 경우

## ⚖️ 4. 기술 제약 및 규칙

- 허용 기호 집합을 유지합니다.
- 코멘트 자동 저장 로직과 분리된 feature로 둡니다.
- 이후 수순 수정 시 어노테이션 보존/삭제 규칙은 `[TASK-103]`에서 확정합니다.

## 🧪 5. 검증 시나리오 및 단언

1. **정상 시나리오: 어노테이션 수정 저장**
   - 기호 선택
   - 자동 저장 요청 전송

2. **실패 시나리오: 잘못된 기호**
   - 허용되지 않은 문자열 전달
   - 검증 테스트 실패

## 🚀 6. 권장 작업 순서

1. 어노테이션 update API를 작성합니다.
2. 편집 훅을 구현합니다.
3. 상세 화면에 picker를 연결합니다.
4. 자동 저장/허용 목록 테스트를 추가합니다.

- **검증 실행**:
  - `pnpm --filter @chess-db/web test`
  - `pnpm --filter @chess-db/web build`

## ✅ 7. 완료 판정 체크리스트

- [ ] 어노테이션 수정이 가능하다.
- [ ] 자동 저장이 동작한다.
- [ ] 코멘트 편집과 별도 책임으로 분리된다.

## 💬 9. 추천 커밋 메시지

- `feat: 정식 기보 어노테이션 자동 저장 편집을 추가 (TASK-046)`
