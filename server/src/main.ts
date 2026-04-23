import 'dotenv/config';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ProxyMiddleware } from './common/proxy.middleware';
import { useSwagger } from './swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  if (process.env.NODE_ENV === 'development') {
    const proxy = new ProxyMiddleware();
    app.use(proxy.use.bind(proxy));
    useSwagger(app);
  }

  await app.listen(3000);
}
bootstrap();
