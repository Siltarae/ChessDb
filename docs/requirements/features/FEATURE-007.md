# FEATURE-007 모노레포 전역 인프라 구축

## 상위 Epic

- [EPIC-000 프로젝트 초기 설정](../epics/EPIC-000.md)

## 브랜치명

- `feat/007-monorepo-foundation`

## 목적

- 프로젝트 전반에 적용되는 모노레포 구조를 잡고 공통 개발 도구를 설정한다.

## 동작 개요

- `pnpm` 워크스페이스를 통해 `apps`와 `packages` 폴더를 구분한다.
- `Turborepo`를 사용하여 빌드 및 린트 파이프라인을 구축한다.
- 전역 `TypeScript`, `ESLint`, `Prettier` 설정을 통해 코드 품질을 관리한다.
- `Husky`와 `lint-staged`를 사용하여 커밋 전 검사 절차를 자동화한다.

## 하위 Task

- [TASK-064 pnpm 워크스페이스 초기화 및 package.json 작성](../tasks/TASK-064.md)
- [TASK-065 Turborepo 설치 및 turbo.json 설정](../tasks/TASK-065.md)
- [TASK-066 전역 TypeScript 베이스 설정 작성](../tasks/TASK-066.md)
- [TASK-067 전역 ESLint 및 Prettier 설정 구축](../tasks/TASK-067.md)
- [TASK-068 Husky 및 lint-staged 커밋 훅 연결](../tasks/TASK-068.md)
- [TASK-091 GitHub Actions CI 워크플로우 기본 설정](../tasks/TASK-091.md)

## 메모

- 이 작업은 프로젝트의 가장 밑바닥 설정이며, 이후 개별 앱 추가의 기반이 된다.
