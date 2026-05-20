# 📋 개별 작업 지침서: 로컬 개발 워크플로우 자동화 (TASK-068)

**작업 상태**: 완료  
**선행 작업**: `[TASK-067]`  
**후속 작업**: 없음 (로컬 환경 인프라 완료)  
**연관 설계**: `[../architecture/project-rules.md]`

---

## 0. 현재 코드 상태와 이 작업의 위치

- **현재 상태 요약**: 린트, 포맷터, 테스트 체계는 갖춰졌으나 실행이 강제되지 않아 품질이 파편화될 위험이 있습니다.
- **이 작업의 책임**: Git Hook을 통해 커밋, 메시지, 푸시, 풀 전 과정에서 품질 검사와 환경 동기화를 자동화합니다.

## 🎯 1. 작업 목표

- **최종 상태**: 협업 시 발생하는 '린트 누락', '커밋 메시지 혼선', '푸시 후 CI 실패', '의존성 미설치' 문제를 시스템적으로 방지합니다.
- **이번 작업의 결과물**:
  - `.husky/` 내 4개 훅 스크립트 (`pre-commit`, `commit-msg`, `pre-push`, `post-merge`)
  - `commitlint.config.js` 설정 파일
  - `package.json`의 `lint-staged` 및 스크립트 설정
- **성공 기준 (AC)**:
  - 잘못된 커밋 메시지 작성 시 커밋이 차단되어야 한다.
  - 커밋 시 변경된 파일만 포맷팅/린트가 수행되어야 한다.
  - 푸시 시 전체 타입 체크와 테스트가 통과해야 한다.
  - 머지 후 의존성 변경 시 자동으로 `pnpm install`이 안내되거나 수행되어야 한다.

## 📂 2. 대상 아티팩트

- **신규 생성**:
  - `.husky/pre-commit`, `.husky/commit-msg`, `.husky/pre-push`, `.husky/post-merge`
  - `commitlint.config.js`
- **수정 대상**:
  - `package.json` (루트): 의존성 추가 및 `lint-staged` 설정

## 🛠️ 3. 상세 기술 사양

- **외부 의존성**: `husky`, `lint-staged`, `@commitlint/cli`, `@commitlint/config-conventional`
- **훅별 동작**:
  - `pre-commit`: `pnpm lint-staged` 실행
  - `commit-msg`: `pnpm commitlint --edit $1` 실행
  - `pre-push`: `pnpm turbo run test type-check` 실행 (나중에 추가될 태스크 대비)
  - `post-merge`: `pnpm-lock.yaml` 변경 시 `pnpm install` 수행

## 🧪 4. 검증 시나리오

1. **커밋 메시지 검증**: `git commit -m "bad message"` 시도 시 차단 확인.
2. **린트 자동화**: 포맷팅이 틀린 파일 커밋 시 자동 수정 확인.
3. **푸시 차단**: 테스트 고의 실패 후 푸시 시도 시 차단 확인.

## 🚀 5. 권장 작업 순서

1. 의존성 설치 (`husky`, `lint-staged`, `commitlint` 관련).
2. `husky init` 및 훅 스크립트 작성.
3. `commitlint.config.js` 작성.
4. `package.json`에 `lint-staged` 룰 추가.
5. 각 훅 동작 여부 실무 검증.

## ✅ 7. 완료 판정 체크리스트

- [x] `husky` 및 `lint-staged`가 `devDependencies`에 존재한다.
- [x] `.husky/` 내 4개 훅 스크립트가 올바르게 작성되고 실행 권한이 부여되었다.
- [x] `commitlint.config.js` 설정이 완료되었다.
- [x] `package.json`에 `lint-staged` 룰과 `prepare` 스크립트가 포함되었다.

## 🚧 8. 실행 중 발생한 문제 및 해결

- `eslint.config.js`의 CommonJS/ESM 혼용 문제로 인해 CommonJS 방식으로 통일함.
- `naming-convention` 규칙 적용을 위해 루트 `tsconfig.json`을 추가함.
- Husky 훅 스크립트 내 변수(`$1`) 이스케이프 문제를 해결함.

## 💬 9. 추천 커밋 메시지

- `feat: 로컬 개발 워크플로우 자동화`
