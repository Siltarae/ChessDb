# 📋 개별 작업 지침서: packages/shared 공통 도메인 패키지 초기화 (TASK-086)

**작업 상태**: 완료  
**선행 작업**: `[TASK-064]`, `[TASK-066]`  
**후속 작업**: `[TASK-087]`, `[TASK-059]`  
**연관 설계**: `[../architecture/tech-stack.md]`, `[../architecture/directory-structure.md]`

---

## 0. 현재 코드 상태와 이 작업의 위치

- **현재 상태 요약**: 모노레포 설정이 완료되었으며, 실제 코드가 담길 `packages/shared` 패키지가 초기화되었습니다.
- **이 작업의 책임**: 프론트엔드와 백엔드가 공유할 순수 로직 전용 패키지인 `packages/shared`를 생성하고 `tsdown` 기반의 독립적인 빌드 및 타입 환경을 구축했습니다.

## 🎯 1. 작업 목표

- **최종 상태**: `packages/shared` 폴더 내에 유효한 `package.json`과 `tsconfig.json`이 존재하며, 루트에서 워크스페이스 패키지로 인식됩니다.
- **이번 작업의 결과물**:
  - `packages/shared/package.json` (tsdown 빌드 설정 포함)
  - `packages/shared/tsconfig.json` (루트 설정 상속)
  - `packages/shared/src/index.ts` (진입점)

## 📂 2. 대상 아티팩트

- **신규 생성**:
  - `packages/shared/package.json`: 패키지명 `@chess-db/shared` 정의 및 ESM/CJS 듀얼 빌드 설정
  - `packages/shared/tsconfig.json`: 루트 `tsconfig.base.json` 확장
  - `packages/shared/src/index.ts`: 빈 진입점 파일

## 🛠️ 3. 상세 기술 사양

- **빌드 도구**: `tsdown` (유지보수가 종료된 `tsup`의 대안)
- **배포 형식**: ESM(`.mjs`) 및 CommonJS(`.cjs`) 듀얼 빌드 지원
- **타입 정의**: `--dts` 옵션을 통한 타입 정의 파일 자동 생성 및 병합

## ✅ 4. 완료 판정 체크리스트

- [x] `packages/shared` 워크스페이스가 루트 `pnpm m ls` 결과에 나타난다.
- [x] `pnpm --filter @chess-db/shared build` 명령이 성공하여 `dist` 결과물이 생성된다.
- [x] `src/index.ts`에서 내보낸 코드를 다른 패키지에서 참조할 수 있도록 `exports` 설정이 완료되었다.

## 🚧 5. 실행 중 발생한 문제 및 해결

- `tsup`이 공식적으로 유지보수 중단되었음을 확인하여 최신 대안인 `tsdown`을 채택함.
- pnpm v10의 엄격한 의존성 규칙에 맞춰 `pnpm add` 명령어를 통해 정석적으로 의존성을 추가함.

## 💬 9. 추천 커밋 메시지

- `chore: packages/shared 공통 도메인 패키지 초기화 (TASK-086)`
