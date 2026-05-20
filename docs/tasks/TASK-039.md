# 📋 개별 작업 지침서: 기보 상세 편집 화면 구성 (TASK-039)

**작업 상태**: 대기 중  
**선행 작업**: `[TASK-037]` (기보 목록 조회)  
**후속 작업**: `[TASK-040]` (기보 상세 보드 표시)  
**연관 설계**: `[../architecture/directory-structure.md]`, `[../architecture/patterns.md]`

---

## 0. 현재 코드 상태와 이 작업의 위치

- **현재 상태 요약**: 목록은 조회할 수 있어도 특정 기보를 자세히 보고 수정하는 페이지 구조와 상세 query가 없습니다.
- **이 작업의 책임**: 기보 상세 편집 페이지의 기본 레이아웃과 데이터 조회 진입점을 구성합니다.
- **이번 작업에서 하지 않는 것**: 보드 자체 렌더링, 수순 목록, 상호작용은 각각 후속 태스크에서 다룹니다.
- **경계 메모**:
  - 상세 편집 화면의 레이아웃과 조회 진입점만 고정합니다.

## 🎯 1. 작업 목표

- **최종 상태**: 사용자가 특정 기보 상세 편집 페이지에 진입할 수 있고, 페이지 골격이 준비됩니다.
- **이번 작업의 최소 결과물**:
  - `apps/web/src/pages/game-detail-page.tsx`
  - `apps/web/src/entities/game/model/game-detail-query.ts`
- **성공 기준 (AC)**:
  - 기보 상세 편집 페이지 라우트가 존재한다.
  - 기보 상세 query가 route param 기반으로 동작한다.
  - 상세 화면 골격에 보드 영역과 수순 영역 자리가 분리된다.

## 📂 2. 대상 아티팩트

- **신규 생성**:
  - `apps/web/src/pages/game-detail-page.tsx`
  - `apps/web/src/entities/game/model/game-detail-query.ts`
- **수정 대상**:
  - `apps/web/src/app/router.tsx`
- **이번 작업에서 수정하지 않음**:
  - `apps/web/src/widgets/game-detail-board/**`
  - `apps/web/src/widgets/game-detail-moves/**`
- **아티팩트 작성 규칙**:
  - 파일 경로는 `apps/web`, `apps/api`, `packages/shared` 기준의 실제 예상 위치로 고정합니다.
  - 후속 태스크 책임 파일은 같은 폴더에 있더라도 이번 문서 범위에서 같이 닫지 않습니다.

## 🛠️ 3. 상세 기술 사양

- **핵심 구현 대상**:
  - `game-detail-query.ts`는 `gameId` 기반 상세 조회를 제공합니다.
  - `game-detail-page.tsx`는 loading/error/success 상태와 레이아웃 shell만 담당합니다.
  - 라우터에 game detail path를 추가합니다.
- **데이터 모델 해석**:
  - 상세 편집 최소 데이터는 게임 메타데이터, 보드 재생용 히스토리, 수순 목록입니다.
- **외부 의존성**:
  - `react-router-dom`
  - `@tanstack/react-query`
- **import/export 규칙**:
  - 상세 page는 query와 layout shell만 담당하고, 보드/수순 렌더링은 위젯으로 분리합니다.
- **권장 네이밍**:
  - `GameDetailPage`, `useGameDetailQuery`, `gameId`
- **이름별 사용 의도와 적용 시점**:
  - `useGameDetailQuery`는 상세 조회 책임을 고정할 때 사용합니다.
- **인수 이름 가이드**:
  - `gameId`
- **짧은 예시 골격**:

```tsx
const { data, isLoading } = useGameDetailQuery(gameId);
```

- **필수 describe/it 목록**:
  - `describe('GameDetailPage shell')`
  - `it('gameId 기반으로 상세 query를 호출한다')`
  - `it('로딩과 에러 상태를 분리해 보여준다')`
- **최소 테스트 개수**:
  - 최소 2개
- **반드시 포함할 실패 시나리오**:
  - gameId 없이 query가 실행되는 경우

## ⚖️ 4. 기술 제약 및 규칙

- 상세 편집 화면 shell만 구성하고 보드/수순 렌더링은 다음 태스크로 넘깁니다.

## 🧪 5. 검증 시나리오 및 단언

1. **정상 시나리오: 상세 진입**
   - gameId가 있는 상세 경로 접근
   - 상세 query와 페이지 shell이 렌더링

2. **실패 시나리오: route param 누락**
   - gameId 없이 query 실행
   - query key 또는 fetch 테스트 실패

## 🚀 6. 권장 작업 순서

1. 라우터에 상세 경로를 추가합니다.
2. 상세 query 훅을 만듭니다.
3. page shell을 작성합니다.
4. 로딩/에러/성공 상태 테스트를 추가합니다.

- **검증 실행**:
  - `pnpm --filter @chess-db/web test`
  - `pnpm --filter @chess-db/web build`

## ✅ 7. 완료 판정 체크리스트

- [ ] 상세 편집 화면 라우트가 존재한다.
- [ ] gameId 기반 query가 준비된다.
- [ ] 보드/수순 영역이 분리된 shell이 있다.

## 💬 9. 추천 커밋 메시지

- `feat: 기보 상세 편집 화면의 기본 레이아웃과 query를 추가`
