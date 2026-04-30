import { Body, Controller, Get, Param, Post, UseGuards, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { CpptService } from './cppt.service';
import { SetRoles } from '../auth/auth.metadata';
import { AuthGuard } from '../auth/auth.guard';

@ApiTags('cppt')
@Controller('cppt')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class CpptController {
  constructor(private cpptService: CpptService) {}

  @Post()
  @SetRoles('DOKTER', 'PERAWAT', 'BIDAN')
  @ApiCreatedResponse({
    description: 'CPPT entry created successfully',
    type: Object,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async createCppt(@Body() createCpptDto: any, @Request() req: any) {
    return this.cpptService.createCppt(createCpptDto, req.user?.sub || req.user?.id);
  }

  @Get('patient/:patientId')
  @SetRoles('DOKTER', 'PERAWAT', 'BIDAN', 'AHLI_GIZI', 'APOTEKER', 'FISIOTERAPIS', 'ADMIN')
  @ApiOkResponse({
    description: 'List of CPPT entries for a patient',
    type: [Object],
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async getPatientCppts(@Param('patientId') patientId: string) {
    return this.cpptService.getPatientCppts(patientId);
  }

  @Get(':id')
  @SetRoles('DOKTER', 'PERAWAT', 'BIDAN', 'AHLI_GIZI', 'APOTEKER', 'FISIOTERAPIS', 'ADMIN')
  @ApiOkResponse({
    description: 'CPPT entry details',
    type: Object,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async getCppt(@Param('id') id: string) {
    return this.cpptService.getCppt(id);
  }
}