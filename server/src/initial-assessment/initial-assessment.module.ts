import { Module } from '@nestjs/common';
import { InitialAssessmentController } from './initial-assessment.controller';
import { InitialAssessmentService } from './initial-assessment.service';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [CommonModule],
  controllers: [InitialAssessmentController],
  providers: [InitialAssessmentService],
  exports: [InitialAssessmentService],
})
export class InitialAssessmentModule {}
