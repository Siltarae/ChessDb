# 📋 개별 작업 지침서: 기보 목록 조회 및 정보 표시 (TASK-037)

**작업 상태**: 대기 중  
**선행 작업**: `[TASK-033]` (저장소 진입), `[TASK-025]` (기보 저장)  
**후속 작업**: `[TASK-039]` (상세 진입)  
**연관 설계**: `[../architecture/directory-structure.md]`, `[../architecture/tech-stack.md]`

---

## 0. 현재 코드 상태와 이 작업의 위치

- **현재 상태 요약**: 저장소 진입 시 분석 보드만 보이며, 저장된 기보 목록을 확인할 수 있는 화면이 없습니다.
- **이 작업의 책임**: 특정 저장소 내에 저장된 모든 기보를 조회하여 요약 정보(날짜, 결과, 주요 수순)를 리스트 형태로 보여줍니다.

## 🎯 1. 작업 목표

- **최종 상태**: 사용자가 '기보 목록' 탭에서 저장된 모든 대국을 최신순으로 확인하고, 클릭하여 상세 내용을 볼 수 있습니다.
- **성공 기준 (AC)**:
  - 기보 요약 데이터에는 대국 날짜, 최종 결과, 종료 사유가 포함되어야 한다.
  - 초반 5수 정도의 SAN 기보를 미리보기로 표시하여 대국 식별을 돕는다.

## 📂 2. 대상 아티팩트

- **신규 생성**:
  - `apps/web/src/pages/GameListPage.tsx`
  - `apps/web/src/components/game/GameListItem.tsx`
- **백엔드 구현**:
  - `apps/api/src/games/games.controller.ts`: 목록 조회 메서드 추가.

## 🛠️ 3. 상세 기술 사양

- **데이터 모델 (GameSummary)**:
  ```ts
  { id: string, playedAt: string, result: string, termination: string, previewMoves: string[] }
  ```
- **정렬**: `playedAt` 기준 내림차순 (최신순).
- **프론트엔드 (Web)**:
  - `TanStack Query`의 `useQuery`를 사용하여 특정 저장소(`repoId`)의 기보 목록 조회.
  - `shadcn/ui`의 `Badge`와 `Table` 컴포넌트로 정보 시각화.
- **권장 네이밍**:
  - `GameListContainer`: 목록 전체를 감싸는 컨테이너.
  - `fetchRepositoryGames`: API 호출 함수.

## ✅ 7. 완료 판정 체크리스트

- [ ] 특정 저장소의 기보들이 날짜 역순으로 정상 출력된다.
- [ ] 결과 정보(1-0 등)와 종료 사유가 Badge 형태로 명확히 표시된다.
- [ ] 기보 미리보기(Preview Moves)가 정확한 SAN 문자열로 나타난다.

## 💬 9. 추천 커밋 메시지

- `feat: 저장소별 기보 목록 조회 화면 및 API 구현 (TASK-037)`
