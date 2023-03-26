import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginRequest {
  @ApiProperty({ description: 'User email' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'User password' })
  @IsNotEmpty()
  @IsString()
  password: string;
}

export class LoginResponse {
  @ApiProperty({ description: 'User JWT' })
  accessToken: string;
}
