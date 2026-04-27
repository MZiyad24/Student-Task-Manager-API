import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class FirebaseExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    // Map Firebase codes to HTTP Statuses
    if (exception.code === 'auth/email-already-exists') {
      status = HttpStatus.CONFLICT;
      message = 'Email already in use.';
    } else if (exception.code === 'auth/invalid-email') {
      status = HttpStatus.BAD_REQUEST;
      message = 'Invalid email format.';
    }

    response.status(status).json({
      statusCode: status,
      message: message,
      timestamp: new Date().toISOString(),
    });
  }
}