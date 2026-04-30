import { Body, Controller, Get, Param, Post, UseGuards, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { PatientsService } from './patients.service';
import { SetRoles } from '../auth/auth.metadata';
import { AuthGuard } from '../auth/auth.guard';

@ApiTags('patients')
@Controller('patients')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class PatientsController {
  constructor(private patientsService: PatientsService) {}

  @Get()
  @SetRoles('DOKTER', 'PERAWAT', 'BIDAN', 'AHLI_GIZI', 'APOTEKER', 'FISIOTERAPIS', 'ADMIN')
  @ApiOkResponse({
    description: 'List of patients based on role',
    type: [Object],
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async getAllPatients(@Request() req: any) {
    const user = req.user;
    return this.patientsService.getAllPatients(user);
  }

  @Get(':id')
  @SetRoles('DOKTER', 'PERAWAT', 'BIDAN', 'AHLI_GIZI', 'APOTEKER', 'FISIOTERAPIS', 'ADMIN')
  @ApiOkResponse({
    description: 'Patient details',
    type: Object,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async getPatient(@Param('id') id: string, @Request() req: any) {
    const user = req.user;
    return this.patientsService.getPatient(id, user);
  }

  @Post()
  @SetRoles('PERAWAT', 'BIDAN', 'ADMIN')
  @ApiCreatedResponse({
    description: 'Patient created successfully',
    type: Object,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async createPatient(@Body() createPatientDto: any, @Request() req: any) {
    const user = req.user;
    return this.patientsService.createPatient(createPatientDto, user);
  }
}