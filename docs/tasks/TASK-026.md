# 📋 개별 작업 지침서: 기보 결과와 종료 사유 입력 (TASK-026)

**작업 상태**: 대기 중  
**선행 작업**: `[TASK-021]` (반수별 착수 평가 기호 입력)
**후속 작업**: `[TASK-027]` (대국 날짜 입력)  
**연관 설계**: `[../architecture/project-rules.md]`, `[../architecture/directory-structure.md]`
**UI 기준안**: `[../ui/FEATURE-003-tab-game-info.svg]`

---

## 0. 현재 코드 상태와 이 작업의 위치

- **현재 상태 요약**: 기물 이동과 코멘트 입력은 가능하지만 게임 결과와 종료 사유를 draft 메타데이터에 기록하는 필드가 없습니다.
- **이 작업의 책임**: 정식 저장 기준 결과(`1-0`, `0-1`, `1/2-1/2`)와 종료 사유를 입력해 draft 메타데이터에 반영합니다.
- **이번 작업에서 하지 않는 것**: 대국 날짜 입력은 `[TASK-027]`, 정식 저장 확정 흐름은 `[TASK-025]`에서 처리합니다.
- **경계 메모**:
  - 결과 자동 판정은 현재 범위에 없습니다. 사용자가 선택한 메타데이터를 정확히 저장하는 것만 책임집니다.
  - 결과와 종료 사유 입력은 `FEATURE-003` 메타데이터 탭의 기보 정보 탭 안에서 제공한다.

## 🎯 1. 작업 목표

- **최종 상태**: 사용자가 결과와 종료 사유를 선택하면 해당 메타데이터가 draft 상태에 즉시 반영됩니다.
- **이번 작업의 최소 결과물**:
  - `apps/web/src/features/game-metadata-edit/ui/game-result-field.tsx`
  - `apps/web/src/features/game-metadata-edit/ui/game-termination-field.tsx`
  - `apps/web/src/features/game-metadata-edit/model/use-game-metadata-edit.ts`
- **성공 기준 (AC)**:
  - 결과 값은 정식 저장 기준 `1-0`, `0-1`, `1/2-1/2` 중 하나만 저장된다.
  - 종료 사유는 체크메이트, 시간패, 기권, 무승부 옵션 중 하나로 선택된다.
  - 결과와 종료 사유가 draft metadata 구조에 분리된 필드로 반영된다.

## 📂 2. 대상 아티팩트

- **신규 생성**:
  - `apps/web/src/features/game-metadata-edit/ui/game-result-field.tsx`
  - `apps/web/src/features/game-metadata-edit/ui/game-termination-field.tsx`
- **수정 대상**:
  - `apps/web/src/features/game-metadata-edit/model/use-game-metadata-edit.ts`
  - `apps/web/src/entities/draft/model/draft-store.ts`
  - `apps/web/src/pages/notation-input-page.tsx`
- **이번 작업에서 수정하지 않음**:
  - `apps/web/src/features/game-metadata-edit/ui/played-at-field.tsx`
  - `apps/web/src/features/save-game/**`
- **아티팩트 작성 규칙**:
  - 파일 경로는 `apps/web`, `apps/api`, `packages/shared` 기준의 실제 예상 위치로 고정합니다.
  - 후속 태스크 책임 파일은 같은 폴더에 있더라도 이번 문서 범위에서 같이 닫지 않습니다.

## 🛠️ 3. 상세 기술 사양

- **핵심 구현 대상**:
  - `use-game-metadata-edit`에서 결과와 종료 사유를 각각 수정하는 액션을 노출합니다.
  - `draft-store`는 `updateGameMetadata(partialMetadata)` 형태의 부분 갱신을 제공합니다.
  - 결과 필드와 종료 사유 필드는 같은 선택 컴포넌트 규칙을 사용합니다.
- **데이터 모델 해석**:
  - `draft.metadata.result`와 `draft.metadata.termination`을 별도 필드로 유지합니다.
  - 정식 저장용 결과는 `1-0`, `0-1`, `1/2-1/2`로 고정합니다.
  - 종료 사유 UI 문구는 `체크메이트`, `시간패`, `기권`, `무승부`로 고정하고 내부 값은 `CHECKMATE`, `TIMEOUT`, `RESIGNATION`, `DRAW`로 저장합니다.
- **외부 의존성**:
  - `react`
  - `zustand`
  - `@/shared/ui/select`
  - `@chess-db/shared`의 결과 메타데이터 타입
- **import/export 규칙**:
  - `use-game-metadata-edit.ts`는 결과/종료 사유 옵션 상수를 한 곳에서 관리합니다.
  - 페이지는 필드 UI를 조합만 하고 메타데이터 구조를 재정의하지 않습니다.
- **권장 네이밍**:
  - `updateGameMetadata`, `resultOptions`, `terminationOptions`, `selectedResult`, `selectedTermination`
- **이름별 사용 의도와 적용 시점**:
  - `updateGameMetadata`는 날짜 입력 태스크와 같은 액션을 재사용하도록 유지합니다.
  - 옵션 상수는 UI와 테스트에서 같은 목록을 쓰기 위해 상수로 둡니다.
- **인수 이름 가이드**:
  - `nextResult`, `nextTermination`, `metadataPatch`
- **짧은 예시 골격**:

```tsx
updateGameMetadata({ result: '1-0' });
updateGameMetadata({ termination: 'CHECKMATE' });
```

- **필수 describe/it 목록**:
  - `describe('useGameMetadataEdit')`
  - `it('결과 값을 정식 저장 허용 리터럴로만 저장한다')`
  - `it('종료 사유 변경이 다른 메타데이터 필드를 덮어쓰지 않는다')`
  - `it('현재 선택 값이 UI field에 반영된다')`
- **최소 테스트 개수**:
  - 최소 3개
- **반드시 포함할 실패 시나리오**:
  - 허용되지 않은 결과 문자열이 저장되는 경우
  - 종료 사유 업데이트가 날짜나 다른 메타데이터를 덮어쓰는 경우

## ⚖️ 4. 기술 제약 및 규칙

- 결과 자동 계산을 추가하지 않습니다.
- 미완료 결과 `*`는 정식 저장 결과 선택지에 포함하지 않습니다.
- 결과와 종료 사유는 별도 필드로 유지합니다.
- partial update 시 기존 metadata를 보존해야 합니다.

## 🧪 5. 검증 시나리오 및 단언

1. **정상 시나리오: 결과 선택**
   - 결과 필드에서 `1-0`을 선택한다.
   - `draft.metadata.result`가 `1-0`으로 바뀐다.

2. **정상 시나리오: 종료 사유 선택**
   - 종료 사유 필드에서 `RESIGNATION`을 선택한다.
   - `draft.metadata.termination`만 갱신되고 다른 필드는 유지된다.

3. **실패 시나리오: 허용되지 않은 값**
   - 지원하지 않는 문자열을 메타데이터 액션에 전달한다.
   - 타입 또는 검증 테스트가 실패해야 한다.

## 🚀 6. 권장 작업 순서

1. `draft-store.ts`에 메타데이터 partial update 액션을 추가합니다.
2. `use-game-metadata-edit.ts`에서 결과/종료 사유 업데이트 훅을 만듭니다.
3. 두 개의 field 컴포넌트를 작성해 페이지에 연결합니다.
4. 허용 값과 partial update 테스트를 추가합니다.

- **검증 실행**:
  - `pnpm --filter @chess-db/web test`
  - `pnpm --filter @chess-db/web build`

## ✅ 7. 완료 판정 체크리스트

- [ ] 결과 값이 허용된 리터럴로 제한된다.
- [ ] 종료 사유가 별도 필드로 저장된다.
- [ ] partial update가 다른 메타데이터를 보존한다.

## 💬 9. 추천 커밋 메시지

- `feat: 기보 결과와 종료 사유 입력 규칙을 추가`
