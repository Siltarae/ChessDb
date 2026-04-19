# 📋 개별 작업 지침서: packages/shared 공통 도메인 패키지 초기화 (TASK-086)

**작업 상태**: 대기 중  
**선행 작업**: `[TASK-064]`, `[TASK-066]`  
**후속 작업**: `[TASK-087]`, `[TASK-059]`  
**연관 설계**: `[../architecture/tech-stack.md]`, `[../architecture/directory-structure.md]`

---

## 0. 현재 코드 상태와 이 작업의 위치

- **현재 상태 요약**: 모노레포 루트 설정이 완료되었으나, 실제 코드가 담길 `packages/shared` 폴더와 패키지 정의는 존재하지 않는 상태입니다.
- **이 작업의 책임**: 프론트엔드와 백엔드가 공유할 순수 로직 전용 패키지인 `packages/shared`를 생성하고 독립적인 빌드 및 타입 환경을 구축합니다.
- **이번 작업에서 하지 않는 것**: 실제 체스 로직 구현이나 테스트 라이브러리 설치는 다음 태스크로 넘깁니다.

## 🎯 1. 작업 목표

- **최종 상태**: `packages/shared` 폴더 내에 유효한 `package.json`과 `tsconfig.json`이 존재하며, 루트에서 워크스페이스 패키지로 인식됩니다.
- **이번 작업의 최소 결과물**:
  - `packages/shared/package.json`
  - `packages/shared/tsconfig.json`
  - `packages/shared/src/index.ts` (진입점)

## 📂 2. 대상 아티팩트

- **신규 생성**:
  - `packages/shared/package.json`: 패키지명 `@chess-db/shared` 정의
  - `packages/shared/tsconfig.json`: 루트 `tsconfig.base.json` 확장
  - `packages/shared/src/index.ts`: 공통 유틸리티 및 타입 export용

## 🛠️ 3. 상세 기술 사양

- **패키지 명명 규칙**: `@chess-db/shared`
- **TypeScript 설정**:
  ```json
  {
    "extends": "../../tsconfig.base.json",
    "compilerOptions": {
      "outDir": "./dist",
      "rootDir": "./src"
    },
    "include": ["src/**/*.ts"]
  }
  ```
- **빌드/스크립트**:
  - `"build": "tsc"`
  - `"lint": "eslint src --ext .ts"`

## ✅ 4. 완료 판정 체크리스트

- [ ] `packages/shared` 워크스페이스가 루트 `pnpm m ls` 결과에 나타난다.
- [ ] `pnpm --filter @chess-db/shared build` 명령이 성공한다.
- [ ] `src/index.ts`에서 내보낸 코드를 다른 패키지에서 참조할 준비가 되었다.


## 💬 9. 추천 커밋 메시지

- `chore: packages/shared 공통 도메인 패키지 초기화 (TASK-086)`
