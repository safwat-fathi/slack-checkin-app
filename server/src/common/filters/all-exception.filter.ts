import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
  PayloadTooLargeException,
} from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Smart error logging
    if (exception instanceof Error) {
      this.logger.error(exception.message, exception.stack);
    } else {
      this.logger.error(
        'Caught exception (non-Error):',
        JSON.stringify(exception),
      );
    }

    // Handle large payloads
    if (
      exception instanceof PayloadTooLargeException ||
      (exception && exception.type === 'entity.too.large')
    ) {
      return response.status(HttpStatus.PAYLOAD_TOO_LARGE).json({
        success: false,
        message: 'Payload too large. Please reduce the size of your request.',
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    }

    // Native JS errors
    if (
      exception instanceof TypeError ||
      exception instanceof RangeError ||
      exception instanceof ReferenceError ||
      exception instanceof SyntaxError ||
      exception instanceof EvalError ||
      exception instanceof URIError
    ) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Internal server error',
      });
    }

    // Class-validator
    if (
      exception &&
      Array.isArray(exception) &&
      exception[0] instanceof ValidationError
    ) {
      const validationError = exception[0];
      // default constraints to {} if it’s undefined
      const constraints = validationError.constraints ?? {};
      const messages = Object.values(constraints).join(', ');

      return response.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: `Validation error for ${validationError.property} – ${messages}`,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    }

    // HTTP exceptions
    let exceptionResponse: any;
    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'An unexpected error occurred';

    if (exception instanceof HttpException) {
      exceptionResponse = exception.getResponse();
      statusCode = exception.getStatus();
    }

    if (exceptionResponse) {
      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse.message
      ) {
        message = Array.isArray(exceptionResponse.message)
          ? exceptionResponse.message.join(', ')
          : exceptionResponse.message;
      }
    }

    return response.status(statusCode).json({
      success: false,
      message,
      errors: exceptionResponse?.error || null,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
