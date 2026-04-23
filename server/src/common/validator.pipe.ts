import {
  HttpException,
  HttpStatus,
  ValidationPipe,
  ValidationPipeOptions,
} from '@nestjs/common';
import { ValidationError } from 'class-validator';

export class BodyValidatorPipe extends ValidationPipe {
  constructor() {
    const options: ValidationPipeOptions = {
      transform: true,
      disableErrorMessages: false,
      exceptionFactory: (errors: ValidationError[]) => {
        const error = errors
          .map((error) => {
            return {
              property: error.property,
              constraints: error.constraints,
            };
          })
          .reduce((acc, val) => {
            return { ...acc, [val.property]: Object.values(val.constraints) };
          }, {});

        return new HttpException(
          {
            message: 'Invalid Input',
            statusCode: HttpStatus.BAD_REQUEST,
            errors: error,
          },
          HttpStatus.BAD_REQUEST,
        );
      },
    };
    super(options);
  }
}
