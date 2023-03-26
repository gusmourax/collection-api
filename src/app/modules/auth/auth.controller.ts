import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginRequest, LoginResponse } from './dto/login.dto';
import { SignupRequest, SignupResponse } from './dto/signup.dto';

@ApiTags('Authentication')
@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'Create a new user',
    description: 'Create a new PRO user account',
  })
  @ApiCreatedResponse({ description: 'User created', type: SignupResponse })
  @ApiBadRequestResponse({ description: 'User already exists' })
  @ApiBadRequestResponse({ description: 'Invalid password confirmation' })
  @Post('/signup')
  async signup(@Body() body: SignupRequest): Promise<SignupResponse> {
    const { email, name, password, passwordConfirmation } = body;

    return this.authService.signup({
      email,
      name,
      password,
      passwordConfirmation,
    });
  }

  @ApiOperation({
    summary: 'Login',
    description: 'Login with email and password',
  })
  @ApiCreatedResponse({ description: 'User logged in', type: LoginResponse })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @Post('/login')
  async login(@Body() body: LoginRequest): Promise<LoginResponse> {
    const { email, password } = body;

    return this.authService.login({ email, password });
  }
}
