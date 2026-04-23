import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

/**
 * Login DTO
 */
export class LoginDto {
  @ApiProperty()
  @IsString({ message: 'Must be a valid username' })
  username: string;

  @ApiProperty()
  @IsString({ message: 'Must be a string' })
  password: string;
}
