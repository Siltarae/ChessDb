# TASK-065 Turborepo 설치 및 turbo.json 설정

## 상위 Feature

- [FEATURE-007 모노레포 전역 인프라 구축](../features/FEATURE-007.md)

## 목적

- 모노레포 내 패키지 간의 빌드, 테스트, 린트 작업을 효율적으로 관리하기 위해 Turborepo를 설치하고 설정한다.

## 완료 조건

- [ ] 루트 `package.json`의 `devDependencies`에 `turbo`가 포함되어야 한다.
- [ ] 루트 경로에 `turbo.json` 파일이 생성되고 기본 파이프라인(`build`, `lint`, `dev`, `test`)이 정의되어야 한다.
- [ ] 각 파이프라인에 필요한 캐시 경로(`outputs`)가 적절히 설정되어야 한다.

## 참고 사항

- 아직 하위 패키지가 없으므로 실제 실행 결과는 비어있을 수 있다.
