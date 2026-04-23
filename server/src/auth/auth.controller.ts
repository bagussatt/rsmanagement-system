import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { ReqUser } from 'src/interface/request';
import { Public, SetRoles } from './auth.metadata';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   *  User login
   *
   * @param signInDto - The login credentials
   */
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

  /**
   *  Refresh access token
   */
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

  /**
   *  Get user profile
   */
  @Get('me')
  @ApiBearerAuth()
  @SetRoles(Role.ADMIN)
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
}
