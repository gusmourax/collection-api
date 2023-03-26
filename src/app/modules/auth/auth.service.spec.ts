import { UserRole } from '@modules/users/enums/user-role.enum';
import { UserAlreadyExists } from '@modules/users/errors';
import { UsersRepository } from '@modules/users/repositories/users.repository';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { LoginResponse } from './dto/login.dto';
import { SignupResponse } from './dto/signup.dto';
import { PasswordConfirmationInvalid } from './errors';
import * as hashUtils from '@utils/hash.utils';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let sut: AuthService;
  const usersRepositoryStub = {
    create: jest.fn().mockResolvedValue({
      id: 'any_id',
      name: 'any_name',
      email: 'any_email@mail.com',
      role: UserRole.PRO,
    }),
    findByEmail: jest.fn().mockResolvedValue({
      id: 'any_id',
      name: 'any_name',
      email: 'any_email@mail.com',
      role: UserRole.PRO,
    }),
  };
  const jwtServiceStub = {
    sign: jest.fn().mockReturnValue('any_token'),
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersRepository,
          useValue: usersRepositoryStub,
        },
        {
          provide: JwtService,
          useValue: jwtServiceStub,
        },
      ],
    }).compile();

    sut = moduleRef.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  describe('signup', () => {
    it('should throw if user already exists', async () => {
      jest
        .spyOn(usersRepositoryStub, 'create')
        .mockRejectedValueOnce(new UserAlreadyExists());

      const promise = sut.signup({
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      });

      expect(promise).rejects.toThrow(new UserAlreadyExists());
    });

    it('should throw if password confirmation is invalid', async () => {
      const promise = sut.signup({
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'invalid_password',
      });

      expect(promise).rejects.toThrow(new PasswordConfirmationInvalid());
    });

    it('should return a SignupResponse if success', async () => {
      const response = await sut.signup({
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      });

      expect(response).toEqual({
        id: 'any_id',
        name: 'any_name',
        email: 'any_email@mail.com',
        role: UserRole.PRO,
      } as SignupResponse);
    });

    it('should call UsersRepository.create with correct values', async () => {
      const createSpy = jest.spyOn(usersRepositoryStub, 'create');

      await sut.signup({
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      });

      expect(createSpy).toHaveBeenCalledWith({
        name: 'any_name',
        email: 'any_email@mail.com',
        password: expect.not.stringMatching('any_password'),
        role: UserRole.PRO,
      });
    });
  });

  describe('login', () => {
    it('should return a LoginResponse if success', async () => {
      const user = {
        id: 'any_id',
        name: 'any_name',
        email: 'any_email@mail.com',
        role: UserRole.PRO,
        password: 'hashed_password',
      };

      jest
        .spyOn(usersRepositoryStub, 'findByEmail')
        .mockResolvedValueOnce(user);

      jest.spyOn(hashUtils, 'compareHash').mockReturnValue(true);

      const response = await sut.login({
        email: 'any_email@mail.com',
        password: 'any_password',
      });

      expect(response).toEqual({
        accessToken: 'any_token',
      } as LoginResponse);
    });

    it('should call UsersRepository.findByEmail with correct values', async () => {
      const findByEmailSpy = jest.spyOn(usersRepositoryStub, 'findByEmail');

      await sut.login({
        email: 'any_email@mail.com',
        password: 'any_password',
      });

      expect(findByEmailSpy).toHaveBeenCalledWith('any_email@mail.com', true);
    });

    it('should call hashUtils.compareHash with correct values', async () => {
      const user = {
        id: 'any_id',
        name: 'any_name',
        email: 'any_email@mail.com',
        role: UserRole.PRO,
        password: 'hashed_password',
      };

      jest
        .spyOn(usersRepositoryStub, 'findByEmail')
        .mockResolvedValueOnce(user);

      const compareHashSpy = jest.spyOn(hashUtils, 'compareHash');

      await sut.login({
        email: user.email,
        password: 'any_password',
      });

      expect(compareHashSpy).toHaveBeenCalledWith(
        'any_password',
        user.password,
      );
    });

    it('should call JwtService.sign with correct values', async () => {
      const user = {
        id: 'any_id',
        name: 'any_name',
        email: 'any_email@mail.com',
        role: UserRole.PRO,
        password: 'hashed_password',
      };

      jest
        .spyOn(usersRepositoryStub, 'findByEmail')
        .mockResolvedValueOnce(user);

      jest.spyOn(hashUtils, 'compareHash').mockReturnValue(true);

      const signSpy = jest.spyOn(jwtServiceStub, 'sign');

      await sut.login({
        email: user.email,
        password: 'any_password',
      });

      expect(signSpy).toHaveBeenCalledWith({
        id: user.id,
      });
    });

    it('should throw if user not found', async () => {
      jest
        .spyOn(usersRepositoryStub, 'findByEmail')
        .mockResolvedValueOnce(null);

      const promise = sut.login({
        email: 'any_email@mail.com',
        password: 'any_password',
      });

      expect(promise).rejects.toThrow(new UnauthorizedException());
    });

    it('should throw if password is invalid', async () => {
      const user = {
        id: 'any_id',
        name: 'any_name',
        email: 'any_email@mail.com',
        role: UserRole.PRO,
        password: 'hashed_password',
      };

      jest
        .spyOn(usersRepositoryStub, 'findByEmail')
        .mockResolvedValueOnce(user);

      jest.spyOn(hashUtils, 'compareHash').mockReturnValue(false);

      const promise = sut.login({
        email: user.email,
        password: 'any_password',
      });

      expect(promise).rejects.toThrow(new UnauthorizedException());
    });
  });
});
