# TASK-067 전역 ESLint 및 Prettier 설정 구축

## 상위 Feature

- [FEATURE-007 모노레포 전역 인프라 구축](../features/FEATURE-007.md)

## 목적

- 프로젝트 전반의 일관된 코드 스타일과 품질 유지를 위해 전역 린트 및 포맷 설정을 구성한다.

## 완료 조건

- [ ] 루트 경로에 `.eslintrc.js` (또는 `.eslintrc.json`) 및 `.prettierrc` 설정 파일이 생성되어야 한다.
- [ ] TypeScript 및 Prettier 연동을 위한 필수 플러그인이 `devDependencies`에 설치되어야 한다.
- [ ] `.eslintignore` 및 `.prettierignore` 파일이 생성되어 빌드 결과물 등을 제외해야 한다.

## 참고 사항

- 향후 앱별(React용, NestJS용) 추가 규칙은 하위 패키지 수준에서 확장한다.


## 💬 9. 추천 커밋 메시지

- `chore: update TASK-067.md`
