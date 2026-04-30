import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { LoggingModule } from './logging/logging.module';
import { PatientsModule } from './patients/patients.module';
import { CpptModule } from './cppt/cppt.module';
import { MedicalResumeModule } from './medical-resume/medical-resume.module';
import { InitialAssessmentModule } from './initial-assessment/initial-assessment.module';

@Module({
  imports: [
    ...(process.env.NODE_ENV === 'production'
      ? [
          ServeStatic.forRoot({
            rootPath: join(__dirname, '..', 'public'),
          }),
        ]
      : []),
    AuthModule,
    CommonModule,
    LoggingModule,
    PatientsModule,
    CpptModule,
    MedicalResumeModule,
    InitialAssessmentModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
