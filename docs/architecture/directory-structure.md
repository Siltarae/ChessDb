# 디렉토리 구조

# 디렉토리 구조 (Directory Structure)

## 목적

본 프로젝트는 프론트엔드와 백엔드를 하나의 저장소에서 관리하는 **모노레포(Monorepo)** 구조를 사용합니다.

- 프로젝트 디렉토리 구조와 파일 배치 원칙을 기록한다.

## 작성 원칙

- 실제로 합의된 구조만 기록한다.
- 디렉토리와 파일의 책임이 드러나도록 적는다.
- 아직 정해지지 않은 구조는 비워두고, 확정되면 반영한다.

## 루트 구조

## 주요 디렉토리

```text
ChessDb/
  apps/
    frontend/   # React + Vite (Feature-Sliced Design 적용)
      src/
        app/       # 전역 설정, 프로바이더, 라우터 진입점
        pages/     # 라우팅되는 각 페이지 단위 컴포넌트
        widgets/   # 여러 feature가 조합된 독립적인 UI 블록 (예: 보드 뷰, 컨트롤 패널)
        features/  # 사용자 행동 중심의 특정 기능 (예: 수 무르기, 기보 저장)
        entities/  # 비즈니스 도메인 데이터/상태 (예: Game, Notation)
        shared/    # 도메인에 종속되지 않은 공통 UI(shadcn), 유틸리티, API 클라이언트
    backend/    # NestJS 기반 백엔드 애플리케이션 (Pragmatic 모듈 구조)
      src/
        modules/  # 도메인/기능별 모듈 (예: games, stats)
          [feature]/
            [feature].controller.ts  # 외부 HTTP 요청/응답 처리
            [feature].service.ts     # 순수 비즈니스 로직 담당
            [feature].repository.ts  # DB(Prisma) 연동 전담
            [feature].module.ts      # 모듈 의존성 조립
  packages/
    shared/     # 체스 도메인 코어 로직(행마법, 상태 검증 등) 및 프론트/백엔드 공통 타입(DTO), 유틸리티
  docs/         # 프로젝트 산출물 및 문서 (요구사항, 프로세스, 아키텍처 등)
  pnpm-workspace.yaml # pnpm 모노레포 워크스페이스 설정
  turbo.json    # Turborepo 빌드 파이프라인 설정
```

## 파일 배치 원칙

> **참고**: 각 애플리케이션(`frontend`, `backend`) 내부의 상세 디렉토리 구조 및 패턴은 요구사항과 기술 스택에 맞추어 점진적으로 구체화합니다.
