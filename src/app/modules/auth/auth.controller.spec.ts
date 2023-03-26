import { AuthController } from './auth.controller';
import { Test } from '@nestjs/testing';
import { SignupRequest } from './dto/signup.dto';
import { AuthService } from './auth.service';
import request from 'supertest';
import { INestApplication, UnauthorizedException } from '@nestjs/common';
import { UserAlreadyExists } from '@modules/users/errors';
import { LoginRequest } from './dto/login.dto';
import { PasswordConfirmationInvalid } from './errors';

describe('AuthController', () => {
  let app: INestApplication;
  let sut: AuthController;
  const authServiceStub = {
    signup: jest.fn().mockResolvedValue({
      id: 'any_id',
      name: 'any_name',
      email: 'any_email@mail.com',
    }),
    login: jest.fn().mockResolvedValue({
      accessToken: 'any_token',
    }),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: authServiceStub,
        },
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    sut = moduleRef.get<AuthController>(AuthController);
    await app.init();
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  describe('signup', () => {
    it('should return a SignupResponse if success', async () => {
      const body: SignupRequest = {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      };

      const response = await sut.signup(body);

      expect(response).toEqual({
        id: 'any_id',
        name: 'any_name',
        email: 'any_email@mail.com',
      });
    });

    it('should call AuthService.signup with correct values', async () => {
      const signupSpy = jest.spyOn(authServiceStub, 'signup');
      const body: SignupRequest = {
        name: 'any_name',
        email: 'any_email@mial.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      };

      await sut.signup(body);

      expect(signupSpy).toHaveBeenCalledWith(body);
    });

    it('should throw if AuthService.signup throws', async () => {
      const body: SignupRequest = {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      };

      authServiceStub.signup.mockRejectedValueOnce(new Error());

      const promise = sut.signup(body);

      await expect(promise).rejects.toThrow();
    });

    it('should return 201 if success', async () => {
      const body: SignupRequest = {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      };

      await request(app.getHttpServer())
        .post('/auth/signup')
        .send(body)
        .expect(201);
    });

    it('should return 400 if password confirmation is different of provided password', async () => {
      const body: SignupRequest = {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'different_password',
      };

      jest
        .spyOn(authServiceStub, 'signup')
        .mockRejectedValueOnce(new PasswordConfirmationInvalid());

      await request(app.getHttpServer())
        .post('/auth/signup')
        .send(body)
        .expect(400);
    });

    it('should return 400 if user with provided email already exists', async () => {
      const body: SignupRequest = {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      };

      jest
        .spyOn(authServiceStub, 'signup')
        .mockRejectedValueOnce(new UserAlreadyExists());

      await request(app.getHttpServer())
        .post('/auth/signup')
        .send(body)
        .expect(400);
    });
  });

  describe('login', () => {
    it('should return a LoginResponse if success', async () => {
      const body: LoginRequest = {
        email: 'any_email@mail.com',
        password: 'any_password',
      };

      const response = await sut.login(body);

      expect(response).toEqual({
        accessToken: 'any_token',
      });
    });

    it('should call AuthService.login with correct values', async () => {
      const loginSpy = jest.spyOn(authServiceStub, 'login');
      const body: LoginRequest = {
        email: 'any_email@mail.com',
        password: 'any_password',
      };

      await sut.login(body);

      expect(loginSpy).toHaveBeenCalledWith(body);
    });

    it('should throw if AuthService.login throws', async () => {
      const body: LoginRequest = {
        email: 'any_email@mail.com',
        password: 'any_password',
      };

      authServiceStub.login.mockRejectedValueOnce(new Error());

      const promise = sut.login(body);

      await expect(promise).rejects.toThrow();
    });

    it('should return 201 if success', async () => {
      const body: LoginRequest = {
        email: 'any_email@mail.com',
        password: 'any_password',
      };

      await request(app.getHttpServer())
        .post('/auth/login')
        .send(body)
        .expect(201);
    });

    it('should return 401 if provided credentials are invalid', async () => {
      const body: LoginRequest = {
        email: 'any_email@mail.com',
        password: 'any_password',
      };

      jest
        .spyOn(authServiceStub, 'login')
        .mockRejectedValueOnce(new UnauthorizedException());

      await request(app.getHttpServer())
        .post('/auth/login')
        .send(body)
        .expect(401);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
