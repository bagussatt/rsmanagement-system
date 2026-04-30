import { Body, Controller, Get, Param, Post, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { MedicalResumeService } from './medical-resume.service';
import { SetRoles } from '../auth/auth.metadata';
import { AuthGuard } from '../auth/auth.guard';
import { Request } from '@nestjs/common';

@ApiTags('medical-resume')
@Controller('medical-resume')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class MedicalResumeController {
  constructor(private medicalResumeService: MedicalResumeService) {}

  @Post()
  @SetRoles('DOKTER', 'PERAWAT', 'BIDAN')
  @ApiCreatedResponse({
    description: 'Medical resume created successfully',
    type: Object,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async createMedicalResume(@Body() createResumeDto: any, @Request() req: any) {
    return this.medicalResumeService.createMedicalResume(createResumeDto, req.user?.sub || req.user?.id);
  }

  @Get('patient/:patientId')
  @SetRoles('DOKTER', 'PERAWAT', 'BIDAN', 'AHLI_GIZI', 'APOTEKER', 'FISIOTERAPIS', 'ADMIN')
  @ApiOkResponse({
    description: 'List of medical resumes for a patient',
    type: [Object],
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async getPatientResumes(@Param('patientId') patientId: string) {
    return this.medicalResumeService.getPatientResumes(patientId);
  }

  @Get('latest/patient/:patientId')
  @SetRoles('DOKTER', 'PERAWAT', 'BIDAN', 'AHLI_GIZI', 'APOTEKER', 'FISIOTERAPIS', 'ADMIN')
  @ApiOkResponse({
    description: 'Latest medical resume for a patient',
    type: Object,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async getLatestPatientResume(@Param('patientId') patientId: string) {
    return this.medicalResumeService.getLatestPatientResume(patientId);
  }

  @Get(':id')
  @SetRoles('DOKTER', 'PERAWAT', 'BIDAN', 'AHLI_GIZI', 'APOTEKER', 'FISIOTERAPIS', 'ADMIN')
  @ApiOkResponse({
    description: 'Medical resume details',
    type: Object,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async getMedicalResume(@Param('id') id: string) {
    return this.medicalResumeService.getMedicalResume(id);
  }

  @Patch(':id')
  @SetRoles('DOKTER', 'PERAWAT', 'BIDAN')
  @ApiCreatedResponse({
    description: 'Medical resume updated successfully',
    type: Object,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async updateMedicalResume(
    @Param('id') id: string,
    @Body() updateResumeDto: any
  ) {
    return this.medicalResumeService.updateMedicalResume(id, updateResumeDto);
  }
}
