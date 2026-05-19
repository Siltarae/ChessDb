import {
  ArgumentsHost,
  BadRequestException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { API_ERROR_CODE } from '../errors/api-error-response';
import { ApiExceptionFilter } from './api-exception.filter';

const createArgumentsHost = () => {
  const response = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as unknown as jest.Mocked<Pick<Response, 'status' | 'json'>>;

  const host = {
    switchToHttp: jest.fn().mockReturnValue({
      getResponse: jest.fn().mockReturnValue(response),
    }),
  } as unknown as ArgumentsHost;

  return { host, response };
};

describe('ApiExceptionFilter', () => {
  let filter: ApiExceptionFilter;

  beforeEach(() => {
    filter = new ApiExceptionFilter();
  });

  describe('HttpException을 처리할 때', () => {
    it('공통 에러 응답 형태로 변환해야 한다', () => {
      const { host, response } = createArgumentsHost();

      filter.catch(new HttpException('Not Found', HttpStatus.NOT_FOUND), host);

      expect(response.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
      expect(response.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.NOT_FOUND,
        errorCode: API_ERROR_CODE.NOT_FOUND,
        message: '요청한 리소스를 찾을 수 없습니다.',
        details: [],
      });
    });
  });

  describe('검증 실패 예외를 처리할 때', () => {
    it('검증 상세 정보를 details로 담아야 한다', () => {
      const { host, response } = createArgumentsHost();
      const validationDetails = [{ path: ['moves'], message: 'Too small' }];

      filter.catch(
        new BadRequestException({
          message: validationDetails,
        }),
        host,
      );

      expect(response.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(response.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.BAD_REQUEST,
        errorCode: API_ERROR_CODE.VALIDATION_ERROR,
        message: '요청 값이 올바르지 않습니다.',
        details: validationDetails,
      });
    });
  });

  describe('알 수 없는 예외를 처리할 때', () => {
    it('내부 상세 없이 500 공통 에러 응답으로 변환해야 한다', () => {
      const { host, response } = createArgumentsHost();

      filter.catch(new Error('database password leaked'), host);

      expect(response.status).toHaveBeenCalledWith(
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      expect(response.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        errorCode: API_ERROR_CODE.INTERNAL_SERVER_ERROR,
        message: '서버 오류가 발생했습니다.',
        details: [],
      });
    });
  });
});
