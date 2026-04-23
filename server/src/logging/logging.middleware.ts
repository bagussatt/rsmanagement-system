import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  logger = new Logger(LoggingMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    const start = process.hrtime();

    res.on('finish', () => {
      const duration = process.hrtime(start);
      const elapsedSeconds = duration[0] + duration[1] / 1e9;
      const elapsedMilliseconds = Math.round(elapsedSeconds * 1000);

      if (res.statusCode >= 500) {
        return this.logger.error(
          `${req.method} ${res.statusCode} ${elapsedMilliseconds}ms ${req.url}  - ReqBody: ${JSON.stringify(req.body)}`,
        );
      }

      this.logger.log(
        `${req.method} ${res.statusCode} ${elapsedMilliseconds}ms ${req.url} `,
      );

      if (elapsedMilliseconds > 2000) {
        this.logger.warn(
          `${req.method} ${res.statusCode} ${elapsedMilliseconds}ms ${req.url}  - ReqBody: ${JSON.stringify(req.body)}`,
        );
      }
    });

    next();
  }
}
