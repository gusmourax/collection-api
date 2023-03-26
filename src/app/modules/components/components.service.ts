import { Injectable } from '@nestjs/common';
import {
  CreateComponentRequest,
  CreateComponentResponse,
} from './dto/create-component.dto';
import {
  FindAllComponentsRequest,
  FindAllComponentsResponse,
} from './dto/find-component.dto';
import { CategoryDoesNotExists } from './categories/errors';
import { CategoriesRepository } from './categories/repositories/categories.repository';
import { ComponentsRepository } from './repositories/components.repository';
import {
  CreateCategoryRequest,
  CreateCategoryResponse,
} from './categories/dto/create-category.dto';
import { FindCategoryResponse } from './categories/dto/find-category.dto';

@Injectable()
export class ComponentsService {
  constructor(
    private readonly componentsRepository: ComponentsRepository,
    private readonly categoriesRepository: CategoriesRepository,
  ) {}

  async create(data: CreateComponentRequest): Promise<CreateComponentResponse> {
    const categories = await this.categoriesRepository.findListByIds(
      data.categories,
    );

    if (categories.length !== data.categories.length)
      throw new CategoryDoesNotExists();

    const { id } = await this.componentsRepository.create({
      title: data.title,
      description: data.description,
      categories: data.categories,
      urlThumbnail: data.urlThumbnail,
      price: data.price,
    });

    return { id };
  }

  async findAll(
    data: FindAllComponentsRequest,
  ): Promise<FindAllComponentsResponse> {
    const { limit, page, title } = data;

    const result = await this.componentsRepository.findAll({
      limit,
      page,
      title,
    });

    return {
      data: result.data,
      limit: result.limit,
      page: result.page,
      total: result.total,
    };
  }

  async createCategory(
    data: CreateCategoryRequest,
  ): Promise<CreateCategoryResponse> {
    const { id } = await this.categoriesRepository.create({
      name: data.name.toUpperCase(),
    });

    return { id };
  }

  async findAllCategories(): Promise<FindCategoryResponse[]> {
    const categories = await this.categoriesRepository.findAll();

    return categories.map((category) => ({
      id: category.id,
      name: category.name,
    }));
  }
}
