# 요구사항 문서 안내

## 목적

이 폴더는 요구사항 산출물을 Epic, Feature, Task 단위 문서로 관리한다.

## 폴더 구조

```text
docs/requirements/
  README.md
  epics/
  features/
  tasks/
  templates/
```

## 문서 구성

- `epics/` — Epic 문서
- `features/` — Feature 문서
- `tasks/` — Task 문서
- `templates/` — Epic/Feature/Task 작성 시 참고하는 기본 템플릿

## 읽는 순서

1. `epics/`에서 큰 범위를 확인한다.
2. 각 Epic 문서에서 연결된 `features/` 문서를 따라간다.
3. 각 Feature 문서에서 연결된 `tasks/` 문서를 따라간다.

## 문서 간 관계

- Epic 문서는 하위 Feature 문서로 연결된다.
- Feature 문서는 상위 Epic 문서와 하위 Task 문서로 연결된다.
- Task 문서는 상위 Feature 문서로 연결된다.

## 관련 규칙

- 요구사항 문서 작성 및 운영 규칙: `../process/phase-1.md`
- Epic 기본 템플릿: `./templates/EPIC-TEMPLATE.md`
- Feature 기본 템플릿: `./templates/FEATURE-TEMPLATE.md`
- Task 기본 템플릿: `./templates/TASK-TEMPLATE.md`
- 추후 계획 공용 문서: `../roadmap/README.md`
- 현재 진행 계획 문서: `../process/current-plan.md`
