import {
  BadRequestException,
  HttpStatus,
  ValidationPipe as NestValidationPipe,
} from '@nestjs/common';
import { ValidationPipeOptions } from '@nestjs/common';
import { ValidationError } from 'class-validator';

export class CustomValidationPipe extends NestValidationPipe {
  constructor(options?: ValidationPipeOptions) {
    super({
      exceptionFactory: (errors) => {
        const mapErrors = new Map<string, string[]>();
        this.makeValidatorMessage(errors, mapErrors);
        return new BadRequestException({
          statusCode: HttpStatus.BAD_REQUEST,
          message: Object.fromEntries(mapErrors),
          error: 'Bad Request',
        });
      },
      ...options,
    });
  }

  makeValidatorMessage(
    errors: ValidationError[],
    mapErrors: Map<string, string[]>,
    key = '',
  ) {
    errors.forEach((error) => {
      if (error.children.length) {
        this.makeValidatorMessage(
          error.children,
          mapErrors,
          key + error.property + '.',
        );
      } else {
        mapErrors.set(key + error.property, Object.values(error.constraints));
      }
    });
  }
}
