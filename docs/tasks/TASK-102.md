# 📋 개별 작업 지침서: 정식 기보 정보 수정 (TASK-102)

**작업 상태**: 대기 중  
**선행 작업**: `[TASK-039]` (기보 상세 편집 화면 구성)  
**후속 작업**: `[TASK-103]` (정식 기보 수순 수정)  
**연관 설계**: `[../architecture/directory-structure.md]`, `[../architecture/patterns.md]`

---

## 0. 현재 코드 상태와 이 작업의 위치

- **현재 상태 요약**: 새 기보 입력 화면에서는 기보 정보 메타데이터를 작성할 수 있지만, 정식 저장된 기보의 정보를 상세 화면에서 수정하는 규칙은 없습니다.
- **이 작업의 책임**: 정식 기보 상세 편집 화면에서 결과, 종료 사유, 대국 날짜를 수정하고 서버에 반영합니다.
- **이번 작업에서 하지 않는 것**: 수순, 코멘트, 어노테이션 수정은 별도 태스크에서 다룹니다.
- **경계 메모**:
  - 상대 이름, 장소, 제목, 즐겨찾기는 현재 범위 밖입니다.

## 🎯 1. 작업 목표

- **최종 상태**: 사용자가 정식 저장된 기보의 기본 정보를 상세 편집 화면에서 수정할 수 있습니다.
- **이번 작업의 최소 결과물**:
  - `apps/web/src/features/game-info-edit/ui/game-info-editor.tsx`
  - `apps/web/src/features/game-info-edit/model/use-game-info-edit.ts`
  - `apps/web/src/features/game-info-edit/api/update-game-info.ts`
- **성공 기준 (AC)**:
  - 정식 저장된 기보의 결과를 수정할 수 있다.
  - 정식 저장된 기보의 종료 사유를 수정할 수 있다.
  - 정식 저장된 기보의 대국 날짜를 수정할 수 있다.
  - 기보 정보 수정은 수순, 코멘트, 어노테이션 수정과 책임이 분리되어 있다.

## 📂 2. 대상 아티팩트

- **신규 생성**:
  - `apps/web/src/features/game-info-edit/ui/game-info-editor.tsx`
  - `apps/web/src/features/game-info-edit/model/use-game-info-edit.ts`
  - `apps/web/src/features/game-info-edit/api/update-game-info.ts`
- **수정 대상**:
  - `apps/web/src/pages/game-detail-page.tsx`
  - `apps/web/src/entities/game/model/game-detail-query.ts`
- **이번 작업에서 수정하지 않음**:
  - `apps/web/src/features/game-comment-edit/**`
  - `apps/web/src/features/game-annotation-edit/**`
  - `apps/web/src/features/game-sequence-edit/**`

## 🛠️ 3. 상세 기술 사양

- `game-info-editor.tsx`는 결과, 종료 사유, 대국 날짜 입력을 제공합니다.
- `use-game-info-edit`는 현재 값, 변경 값, 저장 상태를 관리합니다.
- `update-game-info.ts`는 특정 `gameId`의 메타데이터를 갱신합니다.
- 결과가 진행 중이면 종료 사유는 비워야 합니다.
- 대국 날짜는 기존 date-only 문자열 규칙을 재사용합니다.

## ⚖️ 4. 기술 제약 및 규칙

- 새 기보 입력의 메타데이터 옵션과 같은 값 집합을 사용합니다.
- 수순 수정이나 반수별 데이터 수정 API와 섞지 않습니다.

## 🧪 5. 검증 시나리오 및 단언

1. **정상 시나리오: 기보 정보 수정**
   - 결과, 종료 사유, 대국 날짜를 수정한다.
   - 저장 요청이 올바른 `gameId`와 값으로 전송된다.

2. **실패 시나리오: 잘못된 종료 사유 유지**
   - 결과를 진행 중으로 바꾼 뒤 종료 사유가 남아 있다.
   - 검증 테스트가 실패해야 한다.

## 🚀 6. 권장 작업 순서

1. 상세 query에서 기보 정보 필드를 확인합니다.
2. update API 함수를 작성합니다.
3. 편집 훅과 UI를 연결합니다.
4. 값 검증과 저장 실패 테스트를 추가합니다.

- **검증 실행**:
  - `pnpm --filter @chess-db/web test`
  - `pnpm --filter @chess-db/web build`

## ✅ 7. 완료 판정 체크리스트

- [ ] 결과 수정이 가능하다.
- [ ] 종료 사유 수정이 가능하다.
- [ ] 대국 날짜 수정이 가능하다.
- [ ] 다른 상세 편집 책임과 분리되어 있다.

## 💬 9. 추천 커밋 메시지

- `feat: 정식 기보 정보 편집을 추가`
