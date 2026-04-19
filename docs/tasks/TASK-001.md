# 📋 개별 작업 지침서: 기보 입력 뷰 기본 화면 구성 (TASK-001)

**작업 상태**: 대기 중  
**선행 작업**: `[TASK-084]` (Tailwind/shadcn), `[TASK-085]` (Zustand)  
**후속 작업**: `[TASK-002]` (보드 표시)  
**연관 설계**: `[../architecture/directory-structure.md]`, `[../architecture/tech-stack.md]`

---

## 0. 현재 코드 상태와 이 작업의 위치

- **현재 상태 요약**: Vite 프로젝트 초기화와 스타일링 도구 설정은 완료되었으나, 실제 서비스를 위한 페이지 구조나 레이아웃 컴포넌트는 전무합니다.
- **이 작업의 책임**: 기보 입력을 위한 메인 페이지(`NotationInputPage`)의 골격과 각 기능 영역(보드, 수순 목록, 도구)의 배치를 담당합니다.

## 🎯 1. 작업 목표

- **최종 상태**: 사용자가 대국을 기록하기 위해 필요한 모든 UI 패널이 조화롭게 배치된 화면을 보게 됩니다.

## 📂 2. 대상 아티팩트

- **신규 생성**:
  - `apps/web/src/pages/NotationInputPage.tsx`
  - `apps/web/src/components/layout/MainLayout.tsx`
  - `apps/web/src/components/notation/BoardSection.tsx`
  - `apps/web/src/components/notation/SidePanel.tsx`

## 🛠️ 3. 상세 기술 사양

- **반응형 레이아웃 (Tailwind)**:
  - **Desktop (md 이상)**: 2컬럼 구조. 좌측에 체스 보드(고정 비율), 우측에 수순 목록과 코멘트 창을 수직 배치.
  - **Mobile**: 1컬럼 구조. 상단에 체스 보드, 하단에 탭(Tabs)을 사용하여 수순 목록과 코멘트 창을 전환.
- **UI 라이브러리 활용**:
  - `shadcn/ui`의 `Card`를 사용하여 각 영역 구분.
  - `shadcn/ui`의 `Resizable` (선택 사항)을 사용하여 영역 크기 조절 기능 검토.
- **권장 네이밍**:
  - `NotationInputView`: 페이지의 최상위 컴포넌트.
  - `BoardContainer`: 보드와 좌표 라벨을 감싸는 영역.
  - `EditorPanel`: 수순, 코멘트, 메타데이터 입력이 모여있는 우측 영역.

## ✅ 7. 완료 판정 체크리스트

- [ ] 데스크탑과 모바일 환경에서 각 영역의 배치가 깨지지 않고 유지된다.
- [ ] 보드 영역이 화면 크기에 맞춰 정사각형 비율을 유지하며 최대로 늘어난다.
- [ ] 사이드 패널의 스크롤 처리가 보드 영역과 독립적으로 작동한다.

## 💬 9. 추천 커밋 메시지

- `feat: 기보 입력 페이지 반응형 레이아웃 및 골격 구축 (TASK-001)`
