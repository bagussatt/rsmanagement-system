import { Module } from '@nestjs/common';
import { MedicalResumeController } from './medical-resume.controller';
import { MedicalResumeService } from './medical-resume.service';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [CommonModule],
  controllers: [MedicalResumeController],
  providers: [MedicalResumeService],
  exports: [MedicalResumeService],
})
export class MedicalResumeModule {}
