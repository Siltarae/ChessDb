# EPIC-000 프로젝트 초기 설정

## 목적

- 프로젝트 전반에서 공통으로 필요한 초기 개발 기반과 모노레포 인프라를 정의한다.

## 포함 범위

- 모노레포 워크스페이스 및 빌드 시스템 구축
- 전역 코드 품질 도구 및 Git Hook 설정
- 전역 TypeScript 및 공통 설정 관리

## 하위 Feature

- [FEATURE-007 모노레포 전역 인프라 구축](../features/FEATURE-007.md)

## 메모

- 앱별 초기 설치(React, NestJS 등)는 각 앱의 첫 번째 기능 구현 Feature의 시작 태스크로 포함한다.
- `packages/shared` 초기화는 `FEATURE-001`에서 다룬다.
- `apps/web` 초기화는 `FEATURE-002`에서 다룬다.
- `apps/api` 초기화는 백엔드가 처음 필요한 Feature에서 다룬다.
