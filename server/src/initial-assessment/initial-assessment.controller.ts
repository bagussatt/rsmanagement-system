import { Body, Controller, Get, Param, Patch, Post, UseGuards, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { InitialAssessmentService } from './initial-assessment.service';
import { SetRoles } from '../auth/auth.metadata';
import { AuthGuard } from '../auth/auth.guard';

@ApiTags('initial-assessment')
@Controller('initial-assessment')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class InitialAssessmentController {
  constructor(private initialAssessmentService: InitialAssessmentService) {}

  @Post('patient/:patientId')
  @SetRoles('PERAWAT', 'BIDAN')
  @ApiCreatedResponse({
    description: 'Initial assessment created successfully',
    type: Object,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async createInitialAssessment(
    @Param('patientId') patientId: string,
    @Body() assessmentData: any,
    @Request() req: any
  ) {
    const nurseId = req.user?.sub || req.user?.id;
    return this.initialAssessmentService.createInitialAssessment(patientId, assessmentData, nurseId);
  }

  @Get('patient/:patientId')
  @SetRoles('DOKTER', 'PERAWAT', 'BIDAN', 'AHLI_GIZI', 'APOTEKER', 'FISIOTERAPIS', 'ADMIN')
  @ApiOkResponse({
    description: 'Patient initial assessment details',
    type: Object,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async getPatientAssessment(@Param('patientId') patientId: string) {
    return this.initialAssessmentService.getPatientAssessment(patientId);
  }

  @Get('nurse/:nurseId')
  @SetRoles('PERAWAT', 'BIDAN', 'ADMIN')
  @ApiOkResponse({
    description: 'List of assessments by nurse',
    type: [Object],
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async getAssessmentsByNurse(@Param('nurseId') nurseId: string) {
    return this.initialAssessmentService.getAssessmentsByNurse(nurseId);
  }

  @Patch('patient/:patientId/doctor-review')
  @SetRoles('DOKTER', 'ADMIN')
  @ApiCreatedResponse({
    description: 'Doctor review added to assessment',
    type: Object,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async updateAssessmentByDoctor(
    @Param('patientId') patientId: string,
    @Body() doctorData: any,
    @Request() req: any
  ) {
    const doctorId = req.user?.sub || req.user?.id;
    return this.initialAssessmentService.updateAssessmentByDoctor(patientId, doctorData, doctorId);
  }
}
