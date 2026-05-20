# 📋 개별 작업 지침서: 정식 기보 수순 수정 (TASK-103)

**작업 상태**: 대기 중  
**선행 작업**: `[TASK-040]` (기보 상세 보드 표시), `[TASK-041]` (기보 상세 수순 목록 표시), `[TASK-042]` (수순 선택 시 보드 이동)  
**후속 작업**: 없음  
**연관 설계**: `[../architecture/directory-structure.md]`, `[../architecture/patterns.md]`

---

## 0. 현재 코드 상태와 이 작업의 위치

- **현재 상태 요약**: 새 기보 입력 화면은 보드에서 수순을 만들 수 있지만, 정식 저장된 기보 상세 화면에서 수순을 수정하는 규칙은 없습니다.
- **이 작업의 책임**: 정식 저장된 기보의 수순을 상세 편집 화면에서 수정하고 저장하는 흐름을 정의합니다.
- **이번 작업에서 하지 않는 것**: PGN import/export, 분기 수순, 중간 포지션 기반 새 기보 생성은 다루지 않습니다.
- **경계 메모**:
  - 이 작업은 저장된 기보 전체 무결성을 갱신하는 작업입니다.

## 🎯 1. 작업 목표

- **최종 상태**: 사용자가 정식 저장된 기보의 수순을 상세 편집 화면에서 수정하고 저장할 수 있습니다.
- **이번 작업의 최소 결과물**:
  - `apps/web/src/features/game-sequence-edit/model/use-game-sequence-edit.ts`
  - `apps/web/src/features/game-sequence-edit/api/update-game-sequence.ts`
  - `apps/web/src/pages/game-detail-page.tsx`
- **성공 기준 (AC)**:
  - 정식 저장된 기보의 마지막 시점에서 수순을 이어 둘 수 있다.
  - 기존 수순 중간을 수정하면 수정 지점 이후 수순 상태를 재계산하거나 제거하는 규칙이 명확하다.
  - 수순 수정 시 반수별 코멘트와 어노테이션 보존/삭제 기준이 명확하다.
  - 수순 수정 결과를 서버에 저장할 수 있다.

## 📂 2. 대상 아티팩트

- **신규 생성**:
  - `apps/web/src/features/game-sequence-edit/model/use-game-sequence-edit.ts`
  - `apps/web/src/features/game-sequence-edit/api/update-game-sequence.ts`
- **수정 대상**:
  - `apps/web/src/pages/game-detail-page.tsx`
  - `apps/web/src/widgets/game-detail-board/ui/game-detail-board.tsx`
  - `apps/web/src/widgets/game-detail-moves/ui/game-detail-move-list.tsx`
  - `apps/web/src/entities/game/model/game-detail-query.ts`
- **이번 작업에서 수정하지 않음**:
  - `apps/web/src/features/game-comment-edit/**`
  - `apps/web/src/features/game-annotation-edit/**`
  - `apps/web/src/features/game-info-edit/**`

## 🛠️ 3. 상세 기술 사양

- 마지막 수 이후 입력은 새 기보 입력 화면의 착수 경험을 최대한 재사용합니다.
- 중간 수 수정은 수정 지점 이후 수순을 유지할 수 없으면 제거하는 것을 기본 규칙으로 검토합니다.
- 반수 인덱스가 바뀌는 경우 코멘트와 어노테이션은 같은 수순에 남길 수 있을 때만 보존합니다.
- 서버 저장 API는 수순 전체 교체 또는 변경분 적용 중 하나로 설계하되, Phase 3에서 하나만 선택합니다.
- 저장 전에는 현재 상세 화면 상태와 서버 원본 사이의 변경 여부를 표시해야 합니다.

## ⚖️ 4. 기술 제약 및 규칙

- 불법 수를 저장 상태에 반영하지 않습니다.
- 수순 변경 후 보드 상태, SAN, 반수 인덱스가 서로 일치해야 합니다.
- 새 기보 입력 화면과 공통화할 수 있더라도 이번 태스크 범위 밖 리팩터링은 하지 않습니다.

## 🧪 5. 검증 시나리오 및 단언

1. **정상 시나리오: 마지막 수 이후 이어 두기**
   - 마지막 시점에서 합법 수를 둔다.
   - 수순 목록, 보드, 저장 요청이 같은 새 반수를 가리킨다.

2. **정상 시나리오: 중간 수 수정**
   - 중간 반수를 선택해 다른 합법 수로 바꾼다.
   - 수정 지점 이후 수순 처리 규칙이 적용된다.

3. **실패 시나리오: 메타데이터 불일치**
   - 삭제된 반수의 코멘트나 어노테이션이 남아 있다.
   - 무결성 테스트가 실패해야 한다.

## 🚀 6. 권장 작업 순서

1. 중간 수 수정 시 이후 수순 처리 규칙을 확정합니다.
2. 새 기보 입력 화면의 보드/수순 로직 재사용 가능성을 확인합니다.
3. 수순 수정 훅과 저장 API를 작성합니다.
4. 보드, 수순 목록, 반수별 메타데이터 정합성 테스트를 추가합니다.

- **검증 실행**:
  - `pnpm --filter @chess-db/web test`
  - `pnpm --filter @chess-db/web build`

## ✅ 7. 완료 판정 체크리스트

- [ ] 마지막 시점에서 수순을 이어 둘 수 있다.
- [ ] 중간 수 수정 규칙이 명확히 구현되어 있다.
- [ ] 코멘트와 어노테이션 보존/삭제 기준이 지켜진다.
- [ ] 서버 저장 후 상세 화면 상태가 갱신된다.

## 💬 9. 추천 커밋 메시지

- `feat: 정식 기보 수순 편집을 추가`
