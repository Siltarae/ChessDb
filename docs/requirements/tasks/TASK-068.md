# TASK-068 로컬 개발 워크플로우 자동화 (Husky & lint-staged)

## 상세 구현 지침

- [구현 지침서 (Phase 3)](../../tasks/TASK-068.md)

## 상위 Feature

- [FEATURE-007 모노레포 전역 인프라 구축](../features/FEATURE-007.md)

## 목적

- 커밋, 푸시, 풀 등 주요 Git 작업 시점에 자동화된 검사를 수행하여 코드 품질과 개발 환경의 일관성을 유지한다.

## 완료 조건

- [x] Husky v9 설치 및 활성화 (`.husky/` 폴더 생성)
- [x] `pre-commit` 훅: `lint-staged`를 통한 코드 품질 검사 강제
- [x] `commit-msg` 훅: `commitlint`를 통한 커밋 컨벤션 준수 여부 검사
- [x] `pre-push` 훅: 푸시 전 테스트 및 타입 체크 수행
- [x] `post-merge` 훅: 머지 후 의존성 자동 업데이트 처리
- [x] `package.json`에 관련 설정 및 스크립트 포함
