# 📋 개별 작업 지침서: apps/web React + Vite 프로젝트 초기화 (TASK-083)

**작업 상태**: 대기 중  
**선행 작업**: `[TASK-064]`, `[TASK-066]`  
**후속 작업**: `[TASK-084]`, `[TASK-085]`  
**연관 설계**: `[../architecture/tech-stack.md]`

---

## 0. 현재 코드 상태와 이 작업의 위치

- **현재 상태 요약**: 모노레포 루트 인프라는 구축되었으나, 실제 웹 애플리케이션이 위치할 `apps/web` 폴더는 존재하지 않거나 비어있는 상태입니다.
- **이 작업의 책임**: Vite를 사용하여 React + TypeScript 기반의 웹 프로젝트 스캐폴딩을 생성하고, 모노레포 구성원으로 연결합니다.

## 🎯 1. 작업 목표

- **최종 상태**: `pnpm --filter web dev` 명령을 통해 Vite 개발 서버를 구동하고 기본 React 화면을 확인할 수 있습니다.
- **이번 작업의 최소 결과물**:
  - `apps/web/package.json`
  - `apps/web/tsconfig.json`
  - `apps/web/index.html`, `src/main.tsx`

## 🛠️ 3. 상세 기술 사양

- **프로젝트 생성**: `pnpm create vite web --template react-ts` (apps 폴더 내에서 실행)
- **TypeScript 설정**:
  ```json
  {
    "extends": "../../tsconfig.base.json",
    "compilerOptions": {
      "jsx": "react-jsx",
      "baseUrl": ".",
      "paths": {
        "@/*": ["./src/*"]
      }
    }
  }
  ```
- **환경 변수**: `VITE_` 접두사를 사용하는 Vite 표준 방식을 따릅니다.

## ✅ 4. 완료 판정 체크리스트

- [ ] `apps/web` 프로젝트가 모노레포 워크스페이스에 정상 등록되었다.
- [ ] Vite 개발 서버가 에러 없이 실행된다.
- [ ] 루트 `tsconfig.base.json`의 규칙이 정상적으로 상속된다.
