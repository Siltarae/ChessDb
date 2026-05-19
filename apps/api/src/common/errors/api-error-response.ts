import { HttpStatus } from '@nestjs/common';

export const API_ERROR_CODE = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
} as const;

type ApiErrorCode = (typeof API_ERROR_CODE)[keyof typeof API_ERROR_CODE];

export type ApiErrorResponse = {
  readonly statusCode: number;
  readonly errorCode: ApiErrorCode;
  readonly message: string;
  readonly details: readonly unknown[];
};

const DEFAULT_ERROR_RESPONSE_BY_STATUS = {
  [HttpStatus.BAD_REQUEST]: {
    errorCode: API_ERROR_CODE.VALIDATION_ERROR,
    message: '요청 값이 올바르지 않습니다.',
  },
  [HttpStatus.NOT_FOUND]: {
    errorCode: API_ERROR_CODE.NOT_FOUND,
    message: '요청한 리소스를 찾을 수 없습니다.',
  },
  [HttpStatus.CONFLICT]: {
    errorCode: API_ERROR_CODE.CONFLICT,
    message: '요청이 현재 리소스 상태와 충돌합니다.',
  },
  [HttpStatus.INTERNAL_SERVER_ERROR]: {
    errorCode: API_ERROR_CODE.INTERNAL_SERVER_ERROR,
    message: '서버 오류가 발생했습니다.',
  },
} as const satisfies Record<
  number,
  Pick<ApiErrorResponse, 'errorCode' | 'message'>
>;

export function buildApiErrorResponse(
  statusCode: number,
  details: readonly unknown[] = [],
): ApiErrorResponse {
  const fallback =
    DEFAULT_ERROR_RESPONSE_BY_STATUS[HttpStatus.INTERNAL_SERVER_ERROR];
  const defaultResponse =
    DEFAULT_ERROR_RESPONSE_BY_STATUS[
      statusCode as keyof typeof DEFAULT_ERROR_RESPONSE_BY_STATUS
    ] ?? fallback;

  return {
    statusCode,
    errorCode: defaultResponse.errorCode,
    message: defaultResponse.message,
    details,
  };
}

export function buildUnknownApiErrorResponse(): ApiErrorResponse {
  return buildApiErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR);
}
