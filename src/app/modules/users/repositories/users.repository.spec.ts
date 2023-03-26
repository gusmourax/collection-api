import { PrismaService } from '@app/database/prisma.service';
import { Test } from '@nestjs/testing';
import { UserRole } from '../enums/user-role.enum';
import { UserAlreadyExists } from '../errors';
import { UsersRepository } from './users.repository';

describe('UsersRepository', () => {
  const prismaServiceStub = {
    user: {
      create: jest.fn().mockResolvedValue({
        id: 'any_id',
        name: 'any_name',
        email: 'any_email@mail.com',
        role: UserRole.PRO,
      }),
      findUnique: jest.fn(),
    },
  };
  let sut: UsersRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UsersRepository,
        {
          provide: PrismaService,
          useValue: prismaServiceStub,
        },
      ],
    }).compile();

    sut = moduleRef.get<UsersRepository>(UsersRepository);
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  describe('create', () => {
    it('should return a CreateUserResponse if success', async () => {
      const user = await sut.create({
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        role: UserRole.PRO,
      });

      expect(user).toEqual({
        id: expect.any(String),
        name: 'any_name',
        email: 'any_email@mail.com',
        role: UserRole.PRO,
      });
    });

    it('should throw if user already exists', async () => {
      prismaServiceStub.user.findUnique.mockResolvedValueOnce(true);

      const promise = sut.create({
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        role: UserRole.PRO,
      });

      await expect(promise).rejects.toThrow(new UserAlreadyExists());
    });
  });

  describe('findById', () => {
    it('should return a FindByIdUserResponse if success', async () => {
      const data = {
        id: 'any_id',
        name: 'any_name',
        email: 'any_email@mail.com',
        role: UserRole.PRO,
      };

      prismaServiceStub.user.findUnique.mockResolvedValueOnce(data);

      const user = await sut.findById('any_id');

      expect(user).toEqual(data);
    });

    it('should return null if user not found', async () => {
      prismaServiceStub.user.findUnique.mockResolvedValueOnce(null);

      const user = await sut.findById('any_id');

      expect(user).toBeNull();
    });
  });

  describe('findByEmail', () => {
    it('should return a FindByEmailResponse without password if success', async () => {
      const data = {
        id: 'any_id',
        name: 'any_name',
        email: 'any_email@mail.com',
        role: UserRole.PRO,
      };

      prismaServiceStub.user.findUnique.mockResolvedValueOnce(data);
      const user = await sut.findByEmail('any_email@mail.com');

      expect(user).toEqual(data);
    });

    it('should return a FindByEmailResponse with password if success', async () => {
      const data = {
        id: 'any_id',
        name: 'any_name',
        email: 'any_email@mail.com',
        role: UserRole.PRO,
        password: 'any_password',
      };

      prismaServiceStub.user.findUnique.mockResolvedValueOnce(data);

      const user = await sut.findByEmail('any_email@mail.com', true);
      expect(user).toEqual(data);
    });

    it('should return null if user not found', async () => {
      prismaServiceStub.user.findUnique.mockResolvedValueOnce(null);

      const user = await sut.findByEmail('any_email@mail.com');

      expect(user).toBeNull();
    });
  });
});
