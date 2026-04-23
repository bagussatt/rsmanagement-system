import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { LoggingModule } from './logging/logging.module';

@Module({
  imports: [
    ...(process.env.NODE_ENV === 'production'
      ? [
          ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', 'public'),
          }),
        ]
      : []),
    AuthModule,
    CommonModule,
    LoggingModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
