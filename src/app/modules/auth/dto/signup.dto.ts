import { UserRole } from '@modules/users/enums/user-role.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignupRequest {
  @ApiProperty({ description: 'User name' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'User email' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'User password' })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({ description: 'User password confirmation' })
  @IsNotEmpty()
  @IsString()
  passwordConfirmation: string;
}

export class SignupResponse {
  @ApiProperty({ description: 'User id' })
  id: string;

  @ApiProperty({ description: 'User name' })
  name: string;

  @ApiProperty({ description: 'User email' })
  email: string;

  @ApiProperty({
    description: 'User role',
    enumName: 'UserRole',
    enum: UserRole,
  })
  role: UserRole;
}
