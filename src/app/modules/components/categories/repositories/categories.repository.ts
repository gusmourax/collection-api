import {
  CreateCategoryRequest,
  CreateCategoryResponse,
} from '@modules/components/categories/dto/create-category.dto';
import { FindCategoryResponse } from '@modules/components/categories/dto/find-category.dto';
import { PrismaClient } from '@prisma/client';
import { generateUUID } from '@utils/uuid.utils';
import { CategoryAlreadyExists } from '../errors';
import { ICategoriesRepository } from './categories-repository.interface';

export class CategoriesRepository implements ICategoriesRepository {
  private readonly prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async create(data: CreateCategoryRequest): Promise<CreateCategoryResponse> {
    const categoryAlreadyExists = await this.prisma.category.findUnique({
      where: {
        name: data.name,
      },
    });

    if (categoryAlreadyExists) throw new CategoryAlreadyExists();

    const category = await this.prisma.category.create({
      data: {
        id: generateUUID(),
        name: data.name,
      },
    });

    return {
      id: category.id,
    };
  }

  async findListByIds(ids: string[]): Promise<FindCategoryResponse[]> {
    const categories = await this.prisma.category.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    return categories.map((category) => ({
      id: category.id,
      name: category.name,
    }));
  }

  async findAll(): Promise<FindCategoryResponse[]> {
    const categories = await this.prisma.category.findMany();

    return categories.map((category) => ({
      id: category.id,
      name: category.name,
    }));
  }
}
