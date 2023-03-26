import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginRequest {
  @ApiProperty({
    description: 'User email',
    example: 'admin@collection.com.br',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'User password', example: 'admin' })
  @IsNotEmpty()
  @IsString()
  password: string;
}

export class LoginResponse {
  @ApiProperty({ description: 'User JWT' })
  accessToken: string;
}
