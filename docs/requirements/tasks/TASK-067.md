# TASK-067 전역 ESLint 및 Prettier 설정 구축

## 상세 구현 지침

- [구현 지침서 (Phase 3)](../../tasks/TASK-067.md)

## 상위 Feature

- [FEATURE-007 모노레포 전역 인프라 구축](../features/FEATURE-007.md)

## 목적

- 프로젝트 전반의 일관된 코드 스타일과 품질 유지를 위해 전역 린트 및 포맷 설정을 구성한다.

## 완료 조건

- [x] 루트 경로에 `eslint.config.js` 및 `.prettierrc` 설정 파일이 생성되어야 한다.
- [x] TypeScript 및 Prettier 연동을 위한 필수 플러그인이 `devDependencies`에 설치되어야 한다.
- [x] `.eslintignore` (또는 Flat Config 내 ignores) 및 `.prettierignore` 파일이 생성되어 빌드 결과물 등을 제외해야 한다.
- [x] `package.json`에 `lint`, `format` 스크립트가 정의되어야 한다.

## 참고 사항

- 향후 앱별(React용, NestJS용) 추가 규칙은 하위 패키지 수준에서 확장한다.
- ESLint v10의 Flat Config 형식을 따른다.
