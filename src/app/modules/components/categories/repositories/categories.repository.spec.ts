import { PrismaService } from '@app/database/prisma.service';
import { Test } from '@nestjs/testing';
import { CategoryAlreadyExists } from '../errors';
import { CategoriesRepository } from './categories.repository';

describe('CategoriesRepository', () => {
  const prismaServiceStub = {
    category: {
      findUnique: jest.fn().mockResolvedValue(false),
      create: jest.fn().mockResolvedValue({ id: 'any_id' }),
      findMany: jest.fn(),
    },
  };
  let sut: CategoriesRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        CategoriesRepository,
        {
          provide: PrismaService,
          useValue: prismaServiceStub,
        },
      ],
    }).compile();

    sut = moduleRef.get<CategoriesRepository>(CategoriesRepository);
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  describe('create', () => {
    it('should return a CreateCategoryResponse if success', async () => {
      const category = await sut.create({
        name: 'any_name',
      });

      expect(category).toEqual({
        id: 'any_id',
      });
    });

    it('should throw if category already exists', async () => {
      prismaServiceStub.category.findUnique.mockResolvedValue(true);

      const promise = sut.create({
        name: 'any_name',
      });

      await expect(promise).rejects.toThrow(new CategoryAlreadyExists());
    });
  });

  describe('findListByIds', () => {
    it('should return a FindCategoryResponse list if success', async () => {
      prismaServiceStub.category.findMany.mockResolvedValue([
        {
          id: 'any_id',
          name: 'any_name',
        },
      ]);

      const categories = await sut.findListByIds(['any_id']);

      expect(categories).toEqual([
        {
          id: 'any_id',
          name: 'any_name',
        },
      ]);
    });

    it('should return an empty list if no categories are found', async () => {
      prismaServiceStub.category.findMany.mockResolvedValue([]);

      const categories = await sut.findListByIds(['any_id']);

      expect(categories).toEqual([]);
    });

    it('should return an empty list if no ids are provided', async () => {
      const categories = await sut.findListByIds([]);
      expect(categories).toEqual([]);
    });
  });

  describe('findAll', () => {
    it('should return a FindCategoryResponse list if success', async () => {
      prismaServiceStub.category.findMany.mockResolvedValue([
        {
          id: 'any_id',
          name: 'any_name',
        },
      ]);

      const categories = await sut.findAll();

      expect(categories).toEqual([
        {
          id: 'any_id',
          name: 'any_name',
        },
      ]);
    });

    it('should return an empty list if no categories are found', async () => {
      prismaServiceStub.category.findMany.mockResolvedValue([]);

      const categories = await sut.findAll();

      expect(categories).toEqual([]);
    });
  });
});
