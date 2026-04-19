# 📋 개별 작업 지침서: 저장소 목록 화면 표시 및 정렬 (TASK-028)

**작업 상태**: 대기 중  
**선행 작업**: `[TASK-088]` (API 초기화), `[TASK-083]` (Web 초기화)  
**후속 작업**: `[TASK-029]` (저장소 생성)  
**연관 설계**: `[../architecture/directory-structure.md]`, `[../architecture/tech-stack.md]`

---

## 0. 현재 코드 상태와 이 작업의 위치

- **현재 상태 요약**: 개별 기보 입력 페이지는 준비 중이나, 사용자가 앱에 처음 진입하여 자신의 저장소(폴더 개념) 목록을 볼 수 있는 메인 페이지가 없습니다.
- **이 작업의 책임**: 사용자가 보유한 모든 저장소를 서버로부터 조회하여 카드 형태로 보여주는 대시보드 성격의 목록 페이지를 구축합니다.

## 🎯 1. 작업 목표

- **최종 상태**: 사용자가 앱 진입 시 자신이 만든 저장소들의 이름과 기보 개수, 생성일을 확인합니다.
- **성공 기준 (AC)**:
  - 서버 API(`GET /api/repositories`)를 통해 실시간 데이터를 조회해야 한다.
  - 목록은 생성일 기준 과거순(기본값)으로 정렬되어야 한다.

## 📂 2. 대상 아티팩트

- **신규 생성**:
  - `apps/web/src/pages/RepositoryListPage.tsx`
  - `apps/web/src/components/repository/RepositoryCard.tsx`
- **백엔드 구현**:
  - `apps/api/src/repositories/repositories.controller.ts`
  - `apps/api/src/repositories/repositories.service.ts`

## 🛠️ 3. 상세 기술 사양

- **데이터 모델**:
  - `Repository`: `{ id: string, name: string, createdAt: string, _count: { games: number } }`
- **프론트엔드 (Web)**:
  - `TanStack Query`의 `useQuery`를 사용하여 목록 조회.
  - `shadcn/ui`의 `Card` 컴포넌트로 개별 저장소 시각화.
- **백엔드 (API)**:
  - `Prisma` 조회 시 `include: { _count: { select: { games: true } } }`를 통해 포함된 기보 수 합산.
  - `orderBy: { createdAt: 'asc' }` 적용.

## ✅ 7. 완료 판정 체크리스트

- [ ] 저장소 목록이 화면에 그리드 형태로 정상 출력된다.
- [ ] 각 카드에 저장소 이름, 생성일, 기보 수가 정확히 표시된다.
- [ ] 데이터가 없는 경우 "생성된 저장소가 없습니다"라는 빈 화면(Empty State)이 표시된다.

## 💬 9. 추천 커밋 메시지

- `feat: 저장소 목록 조회 화면 및 API 구현 (TASK-028)`
