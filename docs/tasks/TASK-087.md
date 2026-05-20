# 📋 개별 작업 지침서: packages/shared 테스트 및 검증 환경 구축 (TASK-087)

**작업 상태**: 완료  
**선행 작업**: `[TASK-086]`  
**후속 작업**: `[TASK-059]`  
**연관 설계**: `[../architecture/tech-stack.md]`

---

## 0. 현재 코드 상태와 이 작업의 위치

- **현재 상태 요약**: `shared` 패키지의 기본 뼈대가 마련되었으며, 로직을 검증할 테스트 도구(Vitest)와 데이터 검증 도구(Zod)가 설치되었습니다.
- **이 작업의 책임**: 체스 엔진의 무결성을 보장하기 위한 단위 테스트 환경을 구축하고, 런타임 타입 안전성을 위한 Zod를 도입했습니다.

## 🎯 1. 작업 목표

- **최종 상태**: `pnpm test` 명령어를 통해 `shared` 패키지의 모든 단위 테스트를 실행할 수 있습니다.
- **성공 기준 (AC)**:
  - `vitest`를 사용한 테스트 실행이 성공해야 한다.
  - `zod` 라이브러리가 설치되어 런타임 스키마 정의가 가능해야 한다.

## 🛠️ 3. 상세 기술 사양

- **외부 의존성**: `vitest`, `zod`
- **Vitest 설정**: `vitest.config.ts` 생성
  ```ts
  import { defineConfig } from 'vitest/config';
  export default defineConfig({
    test: {
      globals: true,
      environment: 'node',
    },
  });
  ```

## ✅ 4. 완료 판정 체크리스트

- [x] `pnpm --filter @chess-db/shared test` 실행 시 테스트가 수행된다.
- [x] `zod`가 의존성에 추가되어 정상적으로 import 가능하다.

## 🚧 5. 실행 중 발생한 문제 및 해결

- `vitest.config.ts`가 `src` 폴더 밖에 위치하여 ESLint의 `parserOptions.project` 설정과 충돌함.
- `packages/shared/tsconfig.json`에서 `rootDir: "src"` 제약을 제거하여 해결함.

## 💬 9. 추천 커밋 메시지

- `test: packages/shared 테스트 및 검증 환경 구축`
