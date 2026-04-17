# TASK-064 pnpm 워크스페이스 초기화 및 package.json 작성

## 상위 Feature

- [FEATURE-007 모노레포 전역 인프라 구축](../features/FEATURE-007.md)

## 목적

- 프로젝트의 루트 폴더에 pnpm 워크스페이스 설정을 구축하여 모노레포 구조의 시작점을 만든다.

## 완료 조건

- [ ] 루트 경로에 `pnpm-workspace.yaml` 파일이 존재하고 `apps/*`, `packages/*` 경로가 정의되어야 한다.
- [ ] 루트 `package.json` 파일에 프로젝트 이름과 `pnpm` 엔진 제한 설정이 포함되어야 한다.
- [ ] `.npmrc` 파일에 의존성 격리 관련 설정(public-hoist-pattern 등)이 포함되어야 한다.

## 참고 사항

- 이 단계에서는 아직 하위 패키지나 앱을 생성하지 않는다.
