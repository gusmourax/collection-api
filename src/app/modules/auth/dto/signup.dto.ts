import { UserRole } from '@modules/users/enums/user-role.enum';
import { ApiProperty } from '@nestjs/swagger';
import { generateUUID } from '@utils/uuid.utils';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignupRequest {
  @ApiProperty({ description: 'User name', example: 'John Doe' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'User email', example: 'john@collection.com.br' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'User password', example: 'password' })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({
    description: 'User password confirmation',
    example: 'password',
  })
  @IsNotEmpty()
  @IsString()
  passwordConfirmation: string;
}

export class SignupResponse {
  @ApiProperty({ description: 'User id', example: generateUUID() })
  id: string;

  @ApiProperty({ description: 'User name', example: 'John Doe' })
  name: string;

  @ApiProperty({ description: 'User email', example: 'john@collection.com.br' })
  email: string;

  @ApiProperty({
    description: 'User role',
    example: UserRole.PRO,
  })
  role: UserRole;
}
