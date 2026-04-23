import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { HashService } from './hash.service';
import { PrismaService } from './prisma.service';
import { ProxyMiddleware } from './proxy.middleware';
import { BodyValidatorPipe } from './validator.pipe';

@Global()
@Module({
  imports: [
    JwtModule.register({
      secret: HashService.getSecret(),
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [
    PrismaService,
    HashService,
    { provide: APP_PIPE, useClass: BodyValidatorPipe },
  ],
  exports: [PrismaService, HashService, JwtModule],
})
export class CommonModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ProxyMiddleware).forRoutes('*');
  }
}
