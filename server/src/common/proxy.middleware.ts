import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, RequestHandler, Response } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

@Injectable()
export class ProxyMiddleware implements NestMiddleware {
  proxy: RequestHandler | null = null;
  logger: Logger = new Logger(ProxyMiddleware.name);
  constructor() {
    if (process.env.NODE_ENV === 'development') {
      this.proxy = createProxyMiddleware({
        target: 'http://localhost:3001',
        changeOrigin: true,
        ws: true,
      });
    }
  }

  async use(req: Request, res: Response, next: NextFunction) {
    if (!!this.proxy && !req.originalUrl.startsWith('/api')) {
      this.logger.verbose('Proxy: ' + req.originalUrl);
      this.proxy(req, res, next);
      return;
    }
    next();
  }
}
