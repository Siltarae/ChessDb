# 📋 개별 작업 지침서: 기보 목록 날짜 정보와 결과 표시 (TASK-038)

**작업 상태**: 대기 중  
**선행 작업**: `[TASK-037]` (기보 목록 조회), `[TASK-027]` (대국 날짜 입력)  
**후속 작업**: `[TASK-039]` (기보 상세 화면 구성)  
**연관 설계**: `[../architecture/directory-structure.md]`, `[../architecture/project-rules.md]`

---

## 0. 현재 코드 상태와 이 작업의 위치

- **현재 상태 요약**: 기보 목록은 조회할 수 있지만 각 항목에 날짜와 결과를 어떤 형식으로 보여줄지 고정되지 않았습니다.
- **이 작업의 책임**: 기보 목록 항목에 날짜와 결과 요약 정보를 추가합니다.
- **이번 작업에서 하지 않는 것**: 상세 화면 조회와 편집은 후속 태스크에서 처리합니다.
- **경계 메모**:
  - 목록 메타 표시만 다루며 상세 정보나 코멘트는 다루지 않습니다.

## 🎯 1. 작업 목표

- **최종 상태**: 사용자가 기보 목록에서 날짜와 결과를 기본 식별 정보로 확인할 수 있습니다.
- **이번 작업의 최소 결과물**:
  - `apps/web/src/widgets/game-list/ui/game-list.tsx`
  - `apps/web/src/widgets/game-list/ui/game-list-item-meta.tsx`
  - `apps/web/src/entities/game/model/game-list-query.ts`
- **성공 기준 (AC)**:
  - 목록 항목에 날짜가 표시된다.
  - 목록 항목에 결과 정보가 표시된다.
  - 날짜/결과가 없어도 항목 레이아웃이 깨지지 않는다.

## 📂 2. 대상 아티팩트

- **신규 생성**:
  - `apps/web/src/widgets/game-list/ui/game-list-item-meta.tsx`
- **수정 대상**:
  - `apps/web/src/widgets/game-list/ui/game-list.tsx`
  - `apps/web/src/entities/game/model/game-list-query.ts`
- **이번 작업에서 수정하지 않음**:
  - `apps/web/src/pages/game-detail-page.tsx`
- **아티팩트 작성 규칙**:
  - 파일 경로는 `apps/web`, `apps/api`, `packages/shared` 기준의 실제 예상 위치로 고정합니다.
  - 후속 태스크 책임 파일은 같은 폴더에 있더라도 이번 문서 범위에서 같이 닫지 않습니다.

## 🛠️ 3. 상세 기술 사양

- **핵심 구현 대상**:
  - `game-list-query.ts`에서 `playedAt`과 `result`를 목록 item DTO에 포함합니다.
  - `game-list-item-meta.tsx`는 날짜 포맷과 결과 뱃지 렌더링을 담당합니다.
  - `game-list.tsx`는 각 항목에 메타 위젯을 붙입니다.
- **데이터 모델 해석**:
  - 목록 메타 정보는 상세 진입 전 식별용 요약 데이터입니다.
  - 날짜가 없으면 placeholder 대신 빈 값 또는 미입력 표기를 명시합니다.
- **외부 의존성**:
  - `date-fns` 또는 shared date format util
  - `@/shared/ui/badge`
- **import/export 규칙**:
  - 날짜 포맷 변환은 meta 컴포넌트 또는 shared util 한 곳에서만 처리합니다.
- **권장 네이밍**:
  - `GameListItemMeta`, `formattedPlayedAt`, `resultLabel`
- **이름별 사용 의도와 적용 시점**:
  - `formattedPlayedAt`은 UI에 보여줄 최종 날짜 문자열을 뜻할 때 사용합니다.
- **인수 이름 가이드**:
  - `playedAt`, `result`
- **짧은 예시 골격**:

```tsx
<GameListItemMeta playedAt={game.playedAt} result={game.result} />
```

- **필수 describe/it 목록**:
  - `describe('GameListItemMeta')`
  - `it('날짜를 포맷해 표시한다')`
  - `it('결과 배지를 표시한다')`
  - `it('날짜 또는 결과가 없어도 레이아웃이 유지된다')`
- **최소 테스트 개수**:
  - 최소 3개
- **반드시 포함할 실패 시나리오**:
  - 날짜 미입력 항목에서 렌더링 오류가 나는 경우
  - 결과 문자열을 그대로 노출해 사용자 친화적 표기가 깨지는 경우

## ⚖️ 4. 기술 제약 및 규칙

- 표시용 포맷과 저장 포맷을 분리합니다.
- 메타 정보가 없어도 항목 클릭 영역은 유지합니다.

## 🧪 5. 검증 시나리오 및 단언

1. **정상 시나리오: 날짜와 결과 표시**
   - 날짜와 결과가 있는 기보 목록
   - 두 메타 정보가 항목에 보인다.

2. **경계 시나리오: 메타 일부 누락**
   - 날짜 또는 결과가 없는 항목
   - 레이아웃이 깨지지 않는다.

3. **실패 시나리오: 포맷 누락**
   - raw ISO 문자열을 그대로 렌더링
   - UI 테스트가 기대 포맷 비교에서 실패한다.

## 🚀 6. 권장 작업 순서

1. 목록 query DTO에 날짜와 결과를 포함합니다.
2. 메타 전용 컴포넌트를 만듭니다.
3. 기존 목록 아이템에 메타 UI를 붙입니다.
4. 포맷/누락 상태 테스트를 추가합니다.

- **검증 실행**:
  - `pnpm --filter @chess-db/web test`
  - `pnpm --filter @chess-db/web build`

## ✅ 7. 완료 판정 체크리스트

- [ ] 날짜 정보가 목록에 보인다.
- [ ] 결과 정보가 목록에 보인다.
- [ ] 메타 누락 상태도 안전하다.

## 💬 9. 추천 커밋 메시지

- `feat: 기보 목록 항목에 날짜와 결과 요약을 추가 (TASK-038)`
