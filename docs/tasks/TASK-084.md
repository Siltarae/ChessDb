# 📋 개별 작업 지침서: apps/web Tailwind CSS 및 shadcn/ui 설치 및 연동 (TASK-084)

**작업 상태**: 대기 중  
**선행 작업**: `[TASK-083]` (Web 초기화)  
**후속 작업**: `[TASK-085]` (공통 라이브러리)  
**연관 설계**: `[../architecture/tech-stack.md]`

---

## 0. 현재 코드 상태와 이 작업의 위치

- **현재 상태 요약**: 순수 React 프로젝트가 생성되었으나 스타일링 도구 및 UI 컴포넌트 프레임워크가 없는 상태입니다.
- **이 작업의 책임**: 프로젝트 전역에 Tailwind CSS를 설정하고, 고품질 UI 구현을 위한 shadcn/ui를 초기화합니다.

## 🎯 1. 작업 목표

- **최종 상태**: Tailwind 클래스를 사용하여 스타일을 적용할 수 있으며, shadcn/ui 컴포넌트(Button 등)를 즉시 추가하고 사용할 수 있습니다.

## 🛠️ 3. 상세 기술 사양

- **Tailwind 설치**: `tailwindcss`, `postcss`, `autoprefixer` 설치 및 `init -p` 실행.
- **shadcn/ui 초기화**: `npx shadcn-ui@latest init` 실행.
  - Style: New York
  - Base Color: Slate (또는 Zinc)
  - CSS Variables: Yes
- **Vite 설정 연동**: `vite.config.ts`에서 경로 별칭(`@`) 설정이 Tailwind 및 shadcn 설정과 일치하는지 확인.
- **필수 describe/it 목록**:
  - describe: `Styling Environment`
    - it: `Tailwind 유틸리티 클래스가 실제 DOM 요소에 적용되어야 한다`
    - it: `shadcn/ui 컴포넌트가 프로젝트 규칙에 맞는 위치에 생성되어야 한다`

## ✅ 7. 완료 판정 체크리스트

- [ ] `globals.css`에 Tailwind 지시어가 정상 포함되었다.
- [ ] `components.json` 설정 파일이 생성되고 경로 설정이 유효하다.
- [ ] 테스트용 버튼 컴포넌트가 정상적으로 렌더링되고 스타일이 적용된다.

## 💬 9. 추천 커밋 메시지

- `feat: apps/web Tailwind CSS 및 shadcn/ui 스타일링 환경 구축 (TASK-084)`
