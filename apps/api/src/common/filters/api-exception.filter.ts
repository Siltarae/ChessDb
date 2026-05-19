import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import {
  ApiErrorResponse,
  buildApiErrorResponse,
  buildUnknownApiErrorResponse,
} from '../errors/api-error-response';

type HttpExceptionBody = {
  readonly message?: unknown;
  readonly details?: unknown;
  readonly errors?: unknown;
};

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();
    const errorResponse = this.toApiErrorResponse(exception);

    response.status(errorResponse.statusCode).json(errorResponse);
  }

  private toApiErrorResponse(exception: unknown): ApiErrorResponse {
    if (!(exception instanceof HttpException)) {
      return buildUnknownApiErrorResponse();
    }

    const statusCode = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    return buildApiErrorResponse(
      statusCode,
      this.extractDetails(exceptionResponse),
    );
  }

  private extractDetails(
    exceptionResponse: string | object,
  ): readonly unknown[] {
    if (typeof exceptionResponse === 'string') {
      return [];
    }

    const body = exceptionResponse as HttpExceptionBody;
    const details = body.details ?? body.errors ?? body.message;

    return Array.isArray(details) ? details : [];
  }
}
