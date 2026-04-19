# 📋 개별 작업 지침서: 전역 ESLint 및 Prettier 설정 구축 (TASK-067)

**작업 상태**: 대기 중  
**선행 작업**: `[TASK-064]`, `[TASK-066]`  
**후속 작업**: `[TASK-068]`  
**연관 설계**: `[../architecture/tech-stack.md]`, `[../architecture/project-rules.md]`

---

## 0. 현재 코드 상태와 이 작업의 위치

- **현재 상태 요약**: 모노레포 설정과 TypeScript의 기반은 마련되었으나, 코드 포맷팅 컨벤션이나 코드 품질 규칙을 강제하는 린트 설정이 없습니다.
- **이 작업의 책임**: 모노레포 전역에 적용될 공통 Prettier 및 ESLint 설정을 작성하여 일관된 코드 스타일을 확립합니다.
- **이번 작업에서 하지 않는 것**: React 전용 훅스 린트 등 특정 도메인에 종속된 린트 규칙은 하위 패키지 생성 시에 확장하도록 남겨둡니다.

## 🎯 1. 작업 목표

- **최종 상태**: 루트 명령어(`pnpm lint`, `pnpm format`)를 통해 모든 하위 패키지의 코드 컨벤션과 잠재적 버그를 검사할 수 있습니다.
- **이번 작업의 최소 결과물**:
  - `.prettierrc`, `.prettierignore`
  - `.eslintrc.js` (또는 JSON), `.eslintignore`
- **성공 기준 (AC)**:
  - TypeScript 코드에 대해 ESLint 검사가 작동해야 한다.
  - Prettier와 ESLint 규칙 간 충돌이 없어야 한다 (`eslint-config-prettier` 연동).

## 📂 2. 대상 아티팩트

- **신규 생성**:
  - `.prettierrc`, `.prettierignore`
  - `.eslintrc.js`, `.eslintignore`
- **수정 대상**:
  - `package.json` (루트): 린트 관련 의존성 추가 및 스크립트 연결

## 🛠️ 3. 상세 기술 사양

- **외부 의존성 (devDependencies)**:
  - `eslint`, `prettier`, `eslint-config-prettier`, `@typescript-eslint/parser`, `@typescript-eslint/eslint-plugin`
- **Prettier 필수 규칙**:
  - `singleQuote: true`, `semi: true`, `tabWidth: 2`, `trailingComma: "all"`, `printWidth: 100`
- **ESLint 핵심 규칙**:
  - `root: true` 명시
  - `extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended", "prettier"]`
  - `parser: "@typescript-eslint/parser"`
- **Ignore 규칙**:
  - `node_modules`, `dist`, `build`, `.turbo` 등 빌드 및 캐시 폴더 제외.

## ⚖️ 4. 기술 제약 및 규칙

- **작성 원칙**: 전체 프로젝트에 과도한 제약을 가하기보다, `recommended` 수준의 표준적인 생태계 규칙을 유지합니다.

## 🧪 5. 검증 시나리오 및 단언

1. **정상 시나리오: 포맷팅 및 린트 통과**
   - 루트 경로에 임의의 `test.ts` 파일을 만들고 사용하지 않는 변수 등을 고의로 작성.
   - `npx eslint test.ts` 실행 시 에러나 경고가 출력됨을 확인.
   - 검증 후 `test.ts` 삭제.

## 🚀 6. 권장 작업 순서

1. `pnpm add -wD` 명령어로 관련 패키지 설치.
2. 루트에 `.prettierrc`, `.prettierignore` 설정.
3. 루트에 `.eslintrc.js`, `.eslintignore` 설정.
4. 검증용 임시 파일로 린트 동작 확인.

## ✅ 7. 완료 판정 체크리스트

- [ ] ESLint 및 Prettier 패키지가 설치되었다.
- [ ] 설정 파일과 ignore 파일이 생성되었다.
- [ ] ESLint에서 Prettier 연동 플러그인이 설정되어 충돌을 방지한다.


## 💬 9. 추천 커밋 메시지

- `chore: 전역 ESLint 및 Prettier 설정 구축 (TASK-067)`
