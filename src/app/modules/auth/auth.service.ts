import { UserRole } from '@modules/users/enums/user-role.enum';
import { UsersRepository } from '@modules/users/repositories/users.repository';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { compareHash, hash } from '@utils/hash.utils';
import { LoginRequest, LoginResponse } from './dto/login.dto';
import { SignupRequest, SignupResponse } from './dto/signup.dto';
import { PasswordConfirmationInvalid } from './errors';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
  ) {}

  async signup(data: SignupRequest): Promise<SignupResponse> {
    const { email, name, password, passwordConfirmation } = data;

    if (password !== passwordConfirmation)
      throw new PasswordConfirmationInvalid();

    const hashedPassword = hash(password, 10);

    const user = await this.usersRepository.create({
      email,
      name,
      password: hashedPassword,
      role: UserRole.PRO,
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }

  async login({ email, password }: LoginRequest): Promise<LoginResponse> {
    const user = await this.usersRepository.findByEmail(email, true);

    if (!user) throw new UnauthorizedException();

    const passwordMatch = compareHash(password, user.password);
    if (!passwordMatch) throw new UnauthorizedException();

    return {
      accessToken: this.jwtService.sign({ id: user.id }),
    };
  }
}
