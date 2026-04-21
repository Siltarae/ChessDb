# 📋 개별 작업 지침서: 기보 입력 뷰 기본 화면 구성 (TASK-001)

**작업 상태**: 대기 중  
**선행 작업**: `[TASK-084]` (Tailwind/shadcn), `[TASK-085]` (Zustand)  
**후속 작업**: `[TASK-002]` (보드 표시)  
**연관 설계**: `[../architecture/directory-structure.md]`, `[../architecture/tech-stack.md]`

---

## 0. 현재 코드 상태와 이 작업의 위치

- **현재 상태 요약**: `apps/web` 초기화와 공통 스타일 도구는 준비되었지만, 실제 기보 입력 화면의 페이지/위젯 구조는 비어 있습니다.
- **이 작업의 책임**: 기보 입력 페이지 shell과 보드 영역, 사이드 패널 영역, 반응형 배치 규칙을 고정합니다.
- **이번 작업에서 하지 않는 것**: 보드 내부 기물 표시와 실제 수순 데이터 연결은 후속 태스크에서 처리합니다.
- **경계 메모**:
  - 이 문서는 화면 골격과 배치만 다루며 실제 체스 규칙 UI는 다루지 않습니다.

## 🎯 1. 작업 목표

- **최종 상태**: 사용자가 기보 입력 페이지에 진입했을 때 보드 영역과 사이드 패널이 분리된 반응형 레이아웃을 봅니다.
- **이번 작업의 최소 결과물**:
  - `apps/web/src/pages/notation-input-page.tsx`
  - `apps/web/src/widgets/notation-input-layout/ui/notation-input-layout.tsx`
  - `apps/web/src/widgets/notation-input-layout/ui/board-shell.tsx`
  - `apps/web/src/widgets/notation-input-layout/ui/sidebar-shell.tsx`
- **성공 기준 (AC)**:
  - 데스크탑과 모바일 환경에서 각 영역의 배치가 깨지지 않는다.
  - 보드 영역이 정사각형 비율을 유지한다.
  - 사이드 패널 스크롤이 보드 영역과 독립적으로 동작한다.

## 📂 2. 대상 아티팩트

- **신규 생성**:
  - `apps/web/src/pages/notation-input-page.tsx`
  - `apps/web/src/widgets/notation-input-layout/ui/notation-input-layout.tsx`
  - `apps/web/src/widgets/notation-input-layout/ui/board-shell.tsx`
  - `apps/web/src/widgets/notation-input-layout/ui/sidebar-shell.tsx`
- **수정 대상**:
  - `apps/web/src/app/router.tsx`
- **이번 작업에서 수정하지 않음**:
  - `apps/web/src/widgets/chess-board/**`
  - `apps/web/src/widgets/move-history/**`
- **아티팩트 작성 규칙**:
  - 파일 경로는 `apps/web`, `apps/api`, `packages/shared` 기준의 실제 예상 위치로 고정합니다.
  - 후속 태스크 책임 파일은 같은 폴더에 있더라도 이번 문서 범위에서 같이 닫지 않습니다.

## 🛠️ 3. 상세 기술 사양

- **핵심 구현 대상**:
  - 페이지는 `NotationInputLayout` 위젯만 조합합니다.
  - 레이아웃 위젯은 `board-shell`과 `sidebar-shell` 슬롯을 받도록 설계합니다.
  - 모바일에서는 세로 스택, 데스크탑에서는 2열 배치를 고정합니다.
- **데이터 모델 해석**:
  - 이 태스크에서 다루는 상태는 layout 수준의 open/scroll 상태뿐이며 도메인 데이터는 아직 붙이지 않습니다.
- **외부 의존성**:
  - `react-router-dom`
  - `tailwindcss`
  - `shadcn/ui` `Card` 또는 layout용 공통 UI
- **import/export 규칙**:
  - page는 layout widget만 조합하고, shell 컴포넌트는 domain state를 직접 읽지 않습니다.
- **권장 네이밍**:
  - `NotationInputPage`, `NotationInputLayout`, `BoardShell`, `SidebarShell`
- **이름별 사용 의도와 적용 시점**:
  - `NotationInputLayout`은 페이지 전체 배치를 책임지는 위젯 이름으로 유지합니다.
  - `BoardShell`과 `SidebarShell`은 후속 태스크에서 내용물을 갈아 끼워도 같은 역할을 유지합니다.
- **인수 이름 가이드**:
  - `children`, `boardSlot`, `sidebarSlot`
- **짧은 예시 골격**:

```tsx
return <NotationInputLayout boardSlot={<BoardShell />} sidebarSlot={<SidebarShell />} />;
```

- **필수 describe/it 목록**:
  - `describe('NotationInputLayout')`
  - `it('데스크탑에서 2열 레이아웃을 렌더링한다')`
  - `it('모바일에서 세로 스택 레이아웃을 렌더링한다')`
  - `it('보드 영역이 정사각형 비율을 유지한다')`
- **최소 테스트 개수**:
  - 최소 3개
- **반드시 포함할 실패 시나리오**:
  - 보드 영역이 콘텐츠 크기에 따라 찌그러지는 경우
  - 사이드 패널이 보드와 같이 스크롤되는 경우

## ⚖️ 4. 기술 제약 및 규칙

- 레이아웃 태스크에서는 실제 보드 기물 렌더링을 추가하지 않습니다.
- layout shell은 후속 feature가 재사용할 수 있게 슬롯 구조를 유지합니다.

## 🧪 5. 검증 시나리오 및 단언

1. **정상 시나리오: 데스크탑 레이아웃**
   - 넓은 화면에서 페이지를 렌더링한다.
   - 보드와 사이드 패널이 2열로 보인다.

2. **정상 시나리오: 모바일 레이아웃**
   - 좁은 화면에서 페이지를 렌더링한다.
   - 보드가 위에, 패널이 아래에 쌓인다.

3. **실패 시나리오: 비율 붕괴**
   - 보드 영역 너비만 고정하고 높이 계산을 누락한다.
   - 레이아웃 테스트가 정사각형 비율 단언에서 실패한다.

## 🚀 6. 권장 작업 순서

1. 페이지와 위젯 shell 파일을 생성합니다.
2. 반응형 레이아웃과 슬롯 구조를 구현합니다.
3. 라우터에 페이지를 연결합니다.
4. 반응형/비율 테스트를 추가합니다.

- **검증 실행**:
  - `pnpm --filter @chess-db/web test`
  - `pnpm --filter @chess-db/web build`

## ✅ 7. 완료 판정 체크리스트

- [ ] 기보 입력 페이지 shell이 존재한다.
- [ ] 보드와 사이드 패널이 분리된 레이아웃이다.
- [ ] 반응형 배치 규칙이 테스트로 고정된다.

## 💬 9. 추천 커밋 메시지

- `feat: 기보 입력 페이지 기본 레이아웃을 추가 (TASK-001)`
