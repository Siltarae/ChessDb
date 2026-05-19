import { HttpStatus } from '@nestjs/common';
import {
  API_ERROR_CODE,
  buildApiErrorResponse,
  buildUnknownApiErrorResponse,
} from './api-error-response';

describe('buildApiErrorResponse', () => {
  describe('요청 검증 실패 상태 코드를 매핑할 때', () => {
    it('400 VALIDATION_ERROR 응답을 만들어야 한다', () => {
      const details = [{ path: ['moves'], message: 'Too small' }];

      expect(buildApiErrorResponse(HttpStatus.BAD_REQUEST, details)).toEqual({
        statusCode: HttpStatus.BAD_REQUEST,
        errorCode: API_ERROR_CODE.VALIDATION_ERROR,
        message: '요청 값이 올바르지 않습니다.',
        details,
      });
    });
  });

  describe('존재하지 않는 리소스 상태 코드를 매핑할 때', () => {
    it('404 NOT_FOUND 응답을 만들어야 한다', () => {
      expect(buildApiErrorResponse(HttpStatus.NOT_FOUND)).toEqual({
        statusCode: HttpStatus.NOT_FOUND,
        errorCode: API_ERROR_CODE.NOT_FOUND,
        message: '요청한 리소스를 찾을 수 없습니다.',
        details: [],
      });
    });
  });

  describe('충돌 상태 코드를 매핑할 때', () => {
    it('409 CONFLICT 응답을 만들어야 한다', () => {
      expect(buildApiErrorResponse(HttpStatus.CONFLICT)).toEqual({
        statusCode: HttpStatus.CONFLICT,
        errorCode: API_ERROR_CODE.CONFLICT,
        message: '요청이 현재 리소스 상태와 충돌합니다.',
        details: [],
      });
    });
  });

  describe('정의되지 않은 상태 코드를 매핑할 때', () => {
    it('기본 서버 오류 코드와 메시지를 사용해야 한다', () => {
      expect(buildApiErrorResponse(HttpStatus.FORBIDDEN)).toEqual({
        statusCode: HttpStatus.FORBIDDEN,
        errorCode: API_ERROR_CODE.INTERNAL_SERVER_ERROR,
        message: '서버 오류가 발생했습니다.',
        details: [],
      });
    });
  });
});

describe('buildUnknownApiErrorResponse', () => {
  describe('알 수 없는 예외를 매핑할 때', () => {
    it('500 INTERNAL_SERVER_ERROR 응답을 만들어야 한다', () => {
      expect(buildUnknownApiErrorResponse()).toEqual({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        errorCode: API_ERROR_CODE.INTERNAL_SERVER_ERROR,
        message: '서버 오류가 발생했습니다.',
        details: [],
      });
    });
  });
});
