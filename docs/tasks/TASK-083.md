# 📋 개별 작업 지침서: apps/web React + Vite 프로젝트 초기화 (TASK-083)

**작업 상태**: 대기 중  
**선행 작업**: `[TASK-064]` (워크스페이스 초기화)  
**후속 작업**: `[TASK-084]` (Tailwind/shadcn)  
**연관 설계**: `[../architecture/tech-stack.md]`, `[../architecture/directory-structure.md]`

---

## 0. 현재 코드 상태와 이 작업의 위치

- **현재 상태 요약**: 모노레포 루트 구조는 잡혀 있으나 `apps/web` 디렉토리는 비어있거나 생성되지 않은 상태입니다.
- **이 작업의 책임**: Vite를 사용하여 최신 React + TypeScript 환경을 구축하고, 모노레포의 일원으로 패키지를 등록합니다.

## 🎯 1. 작업 목표

- **최종 상태**: `pnpm --filter web dev` 명령어로 개발 서버를 실행하고 브라우저에서 초기 화면을 확인할 수 있습니다.
- **성공 기준 (AC)**:
  - Vite의 표준 프로젝트 구조를 갖춘다.
  - 루트의 `tsconfig.base.json`을 상속받아 타입 설정을 공유한다.
  - 패키지명이 `@chess-db/web`으로 정확히 명시되어야 한다.

## 📂 2. 대상 아티팩트

- **신규 생성**:
  - `apps/web/package.json`
  - `apps/web/tsconfig.json`
  - `apps/web/index.html`
  - `apps/web/src/main.tsx`

## 🛠️ 3. 상세 기술 사양

- **프로젝트 생성**: `pnpm create vite web --template react-ts` (apps 폴더 내에서 실행 권장)
- **TypeScript 설정**:
  ```json
  {
    "extends": "../../tsconfig.base.json",
    "compilerOptions": {
      "jsx": "react-jsx",
      "baseUrl": ".",
      "paths": { "@/*": ["./src/*"] }
    }
  }
  ```
- **모노레포 연동**: `package.json`의 `name`을 `@chess-db/web`으로 설정하고 루트 `pnpm-workspace.yaml` 확인.
- **필수 describe/it 목록**:
  - describe: `Vite Application Bootstrapping`
    - it: `개발 서버가 에러 없이 구동되어야 한다`
    - it: `루트의 공통 TypeScript 규칙이 적용되어야 한다`

## ✅ 7. 완료 판정 체크리스트

- [ ] `apps/web` 프로젝트가 모노레포 워크스페이스에 정상 등록되었다.
- [ ] Vite 개발 서버가 정상 구동되며 HMR이 작동한다.
- [ ] 절대 경로(`@/*`) 설정이 IDE와 빌드 도구에서 모두 인식된다.

## 💬 9. 추천 커밋 메시지

- `feat: apps/web React + Vite 프로젝트 초기화 (TASK-083)`
