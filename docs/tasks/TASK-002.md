# 📋 개별 작업 지침서: 표준 시작 포지션 보드 표시 (TASK-002)

**작업 상태**: 대기 중
**선행 작업**: `[TASK-001]` (기보 입력 뷰 기본 화면 구성), `[TASK-059]` (데이터 모델)
**후속 작업**: `[TASK-003]` (현재 턴 초기화와 전환 규칙)
**연관 설계**: `[../architecture/directory-structure.md]`, `[../architecture/project-rules.md]`
**UI 기준안**: `[../ui/TASK-002-standard-start-board.svg]`

---

## 0. 현재 코드 상태와 이 작업의 위치

- **현재 상태 요약**: 기보 입력 페이지 shell은 있어도 보드 위젯 내부는 비어 있어 표준 시작 포지션을 볼 수 없습니다.
- **이 작업의 책임**: 체스 보드 위젯과 칸/기물 표시를 구현해 표준 시작 포지션을 렌더링합니다.
- **이번 작업에서 하지 않는 것**: 기물 선택과 합법 수 표시, 수 입력은 후속 태스크에서 다룹니다.
- **경계 메모**:
  - 조회용 시작 포지션 렌더링만 다룹니다.
  - 흰색 기준 보드로 표시하며, a1은 아래 왼쪽의 어두운 칸, h8은 위 오른쪽의 어두운 칸입니다.

## 🎯 1. 작업 목표

- **최종 상태**: 사용자가 페이지를 열면 8x8 체스판과 초기 기물 배치를 볼 수 있습니다.
- **이번 작업의 최소 결과물**:
  - `apps/web/src/widgets/chess-board/ui/chess-board.tsx`
  - `apps/web/src/widgets/chess-board/ui/chess-square.tsx`
  - `apps/web/src/widgets/chess-board/ui/chess-piece.tsx`
  - `apps/web/src/entities/game/model/game-store.ts`
- **성공 기준 (AC)**:
  - 8x8 격자가 정확한 색상 교차와 함께 그려진다.
  - 흰색 기물과 검은색 기물이 표준 위치에 배치된다.
  - 보드 배율이 조정되어도 기물 정렬이 흐트러지지 않는다.

## 📂 2. 대상 아티팩트

- **신규 생성**:
  - `apps/web/src/widgets/chess-board/ui/chess-board.tsx`
  - `apps/web/src/widgets/chess-board/ui/chess-square.tsx`
  - `apps/web/src/widgets/chess-board/ui/chess-piece.tsx`
- **수정 대상**:
  - `apps/web/src/entities/game/model/game-store.ts`
  - `apps/web/src/pages/notation-input-page.tsx`
- **이번 작업에서 수정하지 않음**:
  - `apps/web/src/features/legal-move-highlight/**`
- **아티팩트 작성 규칙**:
  - 파일 경로는 `apps/web`, `apps/api`, `packages/shared` 기준의 실제 예상 위치로 고정합니다.
  - 후속 태스크 책임 파일은 같은 폴더에 있더라도 이번 문서 범위에서 같이 닫지 않습니다.

## 🛠️ 3. 상세 기술 사양

- **핵심 구현 대상**:
  - `game-store`는 초기 `GameState`를 준비해 보드 위젯에 제공합니다.
  - `chess-board.tsx`는 64개 칸을 렌더링하고 `ChessSquare`에 전달합니다.
  - `chess-piece.tsx`는 기물 타입/색상에 따라 아이콘 또는 SVG를 렌더링합니다.
  - `BoardShell`은 `TASK-001`에서 합의한 프레임과 접근성 이름을 유지합니다.
- **데이터 모델 해석**:
  - 보드 렌더링은 `GameState.board`의 셀 배열을 화면 칸으로 매핑합니다.
  - 화면 좌표와 도메인 좌표(a1~h8) 대응 규칙을 문서와 테스트로 고정합니다.
- **외부 의존성**:
  - `@chess-db/shared` `GameState`
  - 기물 아이콘용 SVG 자산 또는 shared icon 컴포넌트
- **import/export 규칙**:
  - 보드 위젯은 초기 상태 selector만 사용하고 수 입력 액션은 아직 import하지 않습니다.
- **권장 네이밍**:
  - `ChessBoard`, `ChessSquare`, `ChessPiece`, `initialBoardState`
- **이름별 사용 의도와 적용 시점**:
  - `initialBoardState`는 shared에서 받은 표준 시작 포지션을 뜻할 때만 사용합니다.
- **인수 이름 가이드**:
  - `boardState`, `squareIndex`, `piece`
- **짧은 예시 골격**:

```tsx
<ChessBoard boardState={initialBoardState} />
```

- **필수 describe/it 목록**:
  - `describe('ChessBoard initial rendering')`
  - `it('64개 칸을 렌더링한다')`
  - `it('32개 기물을 시작 위치에 렌더링한다')`
  - `it('좌표 매핑이 a1 기준과 일치한다')`
- **최소 테스트 개수**:
  - 최소 3개
- **반드시 포함할 실패 시나리오**:
  - 도메인 인덱스와 화면 좌표가 뒤집혀 기물 배치가 틀어지는 경우

## ⚖️ 4. 기술 제약 및 규칙

- 기물 선택/드래그 입력은 추가하지 않습니다.
- 초기 포지션 생성은 shared model 또는 store 한 곳에서만 수행합니다.
- 실제 착수, 하이라이트, 수순 기록은 후속 `FEATURE-002` Task로 남기고, 저장 API와 초안 복원은 `FEATURE-003` 범위로 남깁니다.

## 🧪 5. 검증 시나리오 및 단언

1. **정상 시나리오: 초기 렌더**
   - 초기 상태로 보드 위젯 렌더링
   - 기물 32개가 표준 위치에 보인다.

2. **경계 시나리오: 반응형 크기 변경**
   - 보드 너비가 변한다.
   - 칸과 기물이 정사각형 비율을 유지한다.

3. **실패 시나리오: 좌표 뒤집힘**
   - a1과 h8 방향이 뒤집힌다.
   - 기물 위치 테스트가 실패해야 한다.

## 🚀 6. 권장 작업 순서

1. 보드/칸/기물 위젯을 만듭니다.
2. store에 초기 상태 selector를 추가합니다.
3. 페이지에 보드 위젯을 연결합니다.
4. 초기 배치와 좌표 매핑 테스트를 추가합니다.

- **검증 실행**:
  - `pnpm --filter @chess-db/web test`
  - `pnpm --filter @chess-db/web build`

## ✅ 7. 완료 판정 체크리스트

- [ ] 초기 포지션 보드가 렌더링된다.
- [ ] 기물 배치가 정확하다.
- [ ] 좌표 매핑과 비율 규칙이 고정된다.

## 💬 9. 추천 커밋 메시지

- `feat: 표준 시작 포지션 보드 렌더링을 추가 (TASK-002)`
