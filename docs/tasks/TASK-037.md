# 📋 개별 작업 지침서: 기보 목록 조회 (TASK-037)

**작업 상태**: 대기 중  
**선행 작업**: `[TASK-025]` (정식 저장), `[TASK-033]` (저장소 선택 진입)  
**후속 작업**: `[TASK-038]` (날짜와 결과 표시)  
**연관 설계**: `[../architecture/directory-structure.md]`, `[../architecture/patterns.md]`

---

## 0. 현재 코드 상태와 이 작업의 위치

- **현재 상태 요약**: 저장소 안으로 들어갈 수는 있지만, 해당 저장소에 속한 기보 목록을 조회하는 화면과 query가 없습니다.
- **이 작업의 책임**: 저장소 단위 기보 목록 조회와 기본 리스트 렌더링을 구현합니다.
- **이번 작업에서 하지 않는 것**: 목록 항목의 날짜/결과 요약 표시는 `[TASK-038]`, 상세 진입은 후속 태스크에서 구체화합니다.
- **경계 메모**:
  - 이 문서는 기보 목록 fetch와 기본 리스트 표시만 다룹니다.

## 🎯 1. 작업 목표

- **최종 상태**: 사용자가 저장소 안에서 저장된 기보 목록을 확인할 수 있습니다.
- **이번 작업의 최소 결과물**:
  - `apps/web/src/pages/game-list-page.tsx`
  - `apps/web/src/widgets/game-list/ui/game-list.tsx`
  - `apps/web/src/entities/game/model/game-list-query.ts`
- **성공 기준 (AC)**:
  - 저장소별 기보 목록이 조회된다.
  - 빈 목록과 로딩 상태가 분리되어 보인다.
  - 목록 페이지가 저장소 컨텍스트와 연결된다.

## 📂 2. 대상 아티팩트

- **신규 생성**:
  - `apps/web/src/pages/game-list-page.tsx`
  - `apps/web/src/widgets/game-list/ui/game-list.tsx`
  - `apps/web/src/entities/game/model/game-list-query.ts`
- **수정 대상**:
  - `apps/web/src/app/router.tsx`
- **이번 작업에서 수정하지 않음**:
  - `apps/web/src/widgets/game-list/ui/game-list-item-meta.tsx`
  - `apps/web/src/pages/game-detail-page.tsx`
- **아티팩트 작성 규칙**:
  - 파일 경로는 `apps/web`, `apps/api`, `packages/shared` 기준의 실제 예상 위치로 고정합니다.
  - 후속 태스크 책임 파일은 같은 폴더에 있더라도 이번 문서 범위에서 같이 닫지 않습니다.

## 🛠️ 3. 상세 기술 사양

- **핵심 구현 대상**:
  - `game-list-query.ts`는 `repositoryId` 기반 목록 조회와 캐시 키를 고정합니다.
  - `game-list.tsx`는 목록/빈 상태/로딩 상태를 렌더링합니다.
  - `game-list-page.tsx`는 현재 저장소 id를 읽어 위젯에 전달합니다.
- **데이터 모델 해석**:
  - 목록 항목 최소 정보는 `id`, `title` 또는 식별용 텍스트, `playedAt`, `result` 후보 필드입니다.
  - 조회 범위는 현재 저장소의 정식 저장 기보만 포함합니다.
- **외부 의존성**:
  - `react-router-dom`
  - `@tanstack/react-query` 또는 팀 표준 query 도구
  - `@/shared/api/client`
- **import/export 규칙**:
  - page는 route param을 읽고 widget은 목록 표시만 담당합니다.
  - query layer에서 저장소 범위를 강제하고 widget은 다시 필터링하지 않습니다.
- **권장 네이밍**:
  - `GameListPage`, `GameList`, `useGameListQuery`, `repositoryId`
- **이름별 사용 의도와 적용 시점**:
  - `useGameListQuery`는 저장소 단위 목록 조회 책임을 고정할 때 사용합니다.
  - `repositoryId`는 목록 범위를 표현하는 핵심 인수 이름으로 유지합니다.
- **인수 이름 가이드**:
  - `repositoryId`, `games`, `isEmptyState`
- **짧은 예시 골격**:

```tsx
const { games, isLoading } = useGameListQuery(repositoryId);

return <GameList games={games} isLoading={isLoading} />;
```

- **필수 describe/it 목록**:
  - `describe('GameList')`
  - `it('저장소의 기보 목록을 렌더링한다')`
  - `it('빈 목록일 때 빈 상태를 보여준다')`
  - `it('로딩 상태를 별도로 표시한다')`
- **최소 테스트 개수**:
  - 최소 3개
- **반드시 포함할 실패 시나리오**:
  - 다른 저장소 기보가 섞여 보이는 경우
  - 빈 상태와 로딩 상태가 혼합되는 경우

## ⚖️ 4. 기술 제약 및 규칙

- 목록 조회 범위는 현재 저장소 하나로 한정합니다.
- 정렬/요약 메타 정보 확장은 다음 태스크로 넘깁니다.
- 목록 item 클릭 시 상세 진입 로직을 여기서 완결하지 않습니다.

## 🧪 5. 검증 시나리오 및 단언

1. **정상 시나리오: 저장소별 목록 조회**
   - repositoryId를 주고 목록 페이지를 연다.
   - 해당 저장소 기보만 리스트에 보인다.

2. **경계 시나리오: 빈 목록**
   - 기보가 없는 저장소를 연다.
   - 빈 상태 메시지가 노출된다.

3. **실패 시나리오: 저장소 범위 누락**
   - query에 repositoryId를 넘기지 않는다.
   - 다른 저장소 데이터가 섞이는 테스트가 실패해야 한다.

## 🚀 6. 권장 작업 순서

1. `game-list-query.ts`를 작성합니다.
2. `game-list.tsx`에서 로딩/빈 상태/정상 상태를 나눕니다.
3. `game-list-page.tsx`와 라우터를 연결합니다.
4. 저장소 범위와 상태 분리 테스트를 추가합니다.

- **검증 실행**:
  - `pnpm --filter @chess-db/web test`
  - `pnpm --filter @chess-db/web build`

## ✅ 7. 완료 판정 체크리스트

- [ ] 저장소별 기보 목록 조회가 가능하다.
- [ ] 빈 목록과 로딩 상태가 구분된다.
- [ ] 현재 저장소 범위만 조회한다.

## 💬 9. 추천 커밋 메시지

- `feat: 저장소 단위 기보 목록 조회 화면을 추가 (TASK-037)`
