# 📋 개별 작업 지침서: 대국 날짜 입력 (TASK-027)

**작업 상태**: 대기 중  
**선행 작업**: `[TASK-026]` (기보 결과와 종료 사유 입력)  
**후속 작업**: `[TASK-022]` (초안 자동 저장)
**연관 설계**: `[../architecture/project-rules.md]`, `[../architecture/directory-structure.md]`
**UI 기준안**: `[../ui/FEATURE-003-tab-game-info.svg]`

---

## 0. 현재 코드 상태와 이 작업의 위치

- **현재 상태 요약**: 기보 메타데이터에 결과와 종료 사유는 들어갈 수 있지만 대국 날짜를 입력하고 저장하는 필드는 없습니다.
- **이 작업의 책임**: 사용자가 대국 날짜를 선택해 draft metadata에 ISO 기준 문자열로 저장하는 규칙을 구현합니다.
- **이번 작업에서 하지 않는 것**: 상대 이름, 장소 같은 추가 메타데이터는 현재 범위에서 다루지 않습니다.
- **경계 메모**:
  - 날짜는 기본 메타데이터 필드로만 다루며, 목록/통계 활용은 후속 태스크에서 소비합니다.
  - 날짜 입력은 `FEATURE-003` 메타데이터 탭의 기보 정보 탭 안에서 결과/종료 사유와 함께 제공한다.

## 🎯 1. 작업 목표

- **최종 상태**: 새 기보의 날짜 기본값은 오늘 날짜로 채워지고, 사용자가 날짜를 선택하거나 지우면 draft metadata의 `playedAt` 필드가 일관된 포맷으로 갱신됩니다.
- **이번 작업의 최소 결과물**:
  - `apps/web/src/features/game-metadata-edit/ui/played-at-field.tsx`
  - `apps/web/src/features/game-metadata-edit/model/use-game-metadata-edit.ts`
  - `apps/web/src/entities/draft/model/draft-store.ts`
- **성공 기준 (AC)**:
  - 새 기보의 날짜 기본값은 오늘 날짜로 자동 채워진다.
  - 날짜 입력은 `YYYY-MM-DD` 또는 ISO date-only 규칙으로 저장된다.
  - 날짜를 지우면 metadata에서 해당 필드가 비워진다.
  - 날짜 입력 규칙이 결과/종료 사유와 같은 metadata update 흐름을 공유한다.

## 📂 2. 대상 아티팩트

- **신규 생성**:
  - `apps/web/src/features/game-metadata-edit/ui/played-at-field.tsx`
- **수정 대상**:
  - `apps/web/src/features/game-metadata-edit/model/use-game-metadata-edit.ts`
  - `apps/web/src/entities/draft/model/draft-store.ts`
  - `apps/web/src/pages/notation-input-page.tsx`
- **이번 작업에서 수정하지 않음**:
  - `apps/web/src/features/save-game/**`
  - `apps/web/src/features/statistics-view/**`
- **아티팩트 작성 규칙**:
  - 파일 경로는 `apps/web`, `apps/api`, `packages/shared` 기준의 실제 예상 위치로 고정합니다.
  - 후속 태스크 책임 파일은 같은 폴더에 있더라도 이번 문서 범위에서 같이 닫지 않습니다.

## 🛠️ 3. 상세 기술 사양

- **핵심 구현 대상**:
  - `played-at-field.tsx`는 달력 또는 date input을 감싼 필드입니다.
  - `use-game-metadata-edit`는 `updatePlayedAt(dateString | undefined)`를 노출합니다.
  - `draft-store`는 날짜 필드도 같은 metadata partial update 액션으로 저장합니다.
- **데이터 모델 해석**:
  - `draft.metadata.playedAt`은 날짜만 표현하는 문자열 필드입니다.
  - 새 draft 생성 시 `playedAt` 기본값은 현재 로컬 날짜의 `YYYY-MM-DD` 문자열입니다.
  - 시간대 정보가 필요한 범위가 아니므로 date-only 포맷을 우선 사용합니다.
- **외부 의존성**:
  - `react`
  - `zustand`
  - `@/shared/ui/calendar` 또는 `input[type=date]`
  - `@chess-db/shared` 메타데이터 타입
- **import/export 규칙**:
  - 날짜 포맷팅/파싱은 field 또는 shared util 한 곳에서만 처리합니다.
  - 페이지에서는 raw Date 객체를 store에 직접 저장하지 않습니다.
- **권장 네이밍**:
  - `updatePlayedAt`, `playedAtValue`, `selectedDate`, `formatPlayedAt`
- **이름별 사용 의도와 적용 시점**:
  - `updatePlayedAt`은 metadata partial update의 날짜 전용 래퍼로 사용합니다.
  - `formatPlayedAt`은 UI 표시와 저장 포맷 변환을 분리할 때 사용합니다.
- **인수 이름 가이드**:
  - `nextPlayedAt`, `selectedDate`, `isoDateString`
- **짧은 예시 골격**:

```tsx
updatePlayedAt('2026-04-21');
```

- **필수 describe/it 목록**:
  - `describe('playedAt field')`
  - `it('새 기보 생성 시 playedAt 기본값이 오늘 날짜로 채워진다')`
  - `it('날짜 선택 시 playedAt이 ISO date-only 문자열로 저장된다')`
  - `it('날짜 제거 시 playedAt이 비워진다')`
  - `it('날짜 업데이트가 result/termination을 덮어쓰지 않는다')`
- **최소 테스트 개수**:
  - 최소 3개
- **반드시 포함할 실패 시나리오**:
  - Date 객체를 그대로 store에 저장하는 경우
  - 날짜 업데이트가 다른 metadata 필드를 초기화하는 경우

## ⚖️ 4. 기술 제약 및 규칙

- 날짜는 문자열 포맷으로만 저장합니다.
- 새 기보 생성 시 기본 날짜는 오늘 날짜로 설정합니다.
- 시간대/시분초 정보는 현재 범위에 포함하지 않습니다.
- metadata update 흐름은 TASK-026과 동일한 액션을 공유합니다.

## 🧪 5. 검증 시나리오 및 단언

1. **정상 시나리오: 날짜 선택**
   - 달력에서 날짜 하나를 선택한다.
   - `draft.metadata.playedAt`이 date-only 문자열로 저장된다.

2. **정상 시나리오: 기본 날짜**
   - 새 기보를 시작한다.
   - `draft.metadata.playedAt`이 오늘 날짜의 date-only 문자열로 초기화된다.

3. **경계 시나리오: 날짜 제거**
   - 선택된 날짜를 지운다.
   - `playedAt` 필드가 비워지고 다른 메타데이터는 유지된다.

4. **실패 시나리오: 포맷 불일치**
   - UI는 Date 객체를 갖지만 store에 그대로 넣는다.
   - 직렬화 테스트가 기대하는 문자열 비교에서 실패해야 한다.

## 🚀 6. 권장 작업 순서

1. `use-game-metadata-edit.ts`에 `updatePlayedAt`을 추가합니다.
2. `played-at-field.tsx`를 구현해 페이지에 연결합니다.
3. 날짜 포맷 변환과 metadata partial update 테스트를 추가합니다.

- **검증 실행**:
  - `pnpm --filter @chess-db/web test`
  - `pnpm --filter @chess-db/web build`

## ✅ 7. 완료 판정 체크리스트

- [ ] 날짜가 일관된 문자열 포맷으로 저장된다.
- [ ] 새 기보의 날짜 기본값이 오늘 날짜로 채워진다.
- [ ] 날짜 제거가 가능하다.
- [ ] 결과/종료 사유와 같은 metadata 흐름을 공유한다.

## 💬 9. 추천 커밋 메시지

- `feat: 기보 대국 날짜 입력 규칙을 추가 (TASK-027)`
