import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags, ApiQuery } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { ReqUser } from 'src/interface/request';
import { Public, SetRoles } from './auth.metadata';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login';
import { RegisterDto } from './dto/register.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOkResponse({
    description: 'Access Token Response',
    schema: {
      type: 'object',
      properties: {
        access_token: { type: 'string' },
      },
    },
  })
  signIn(@Body() signInDto: LoginDto) {
    return this.authService.signIn(signInDto.username, signInDto.password);
  }
  @Public()
  @Post('register')
  @ApiCreatedResponse({
    description: 'User successfully registered',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        username: { type: 'string' },
        role: { type: 'string' },
        specialization: { type: 'string' },
        sip: { type: 'string' },
        phone: { type: 'string' },
      },
    },
  })
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }
  @Public()
  @Post('refresh')
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Access Token Response',
    schema: {
      type: 'object',
      properties: {
        access_token: { type: 'string' },
      },
    },
  })
  async refreshToken(@Request() req: ReqUser) {
    return this.authService.refresh(req.user.sub);
  }


  @Get('me')
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'User Profile',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        username: { type: 'string' },
        role: { type: 'string' },
      },
    },
  })
  async getProfile(@Request() req: ReqUser) {
    return req.user;
  }

  @Get('users')
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Get users by role',
    type: [Object],
  })
  @ApiQuery({ name: 'role', required: false, enum: ['DOKTER', 'PERAWAT', 'BIDAN', 'AHLI_GIZI', 'APOTEKER', 'FISIOTERAPIS', 'ADMIN'] })
  async getUsersByRole(@Query('role') role?: string) {
    return this.authService.getUsersByRole(role);
  }
}