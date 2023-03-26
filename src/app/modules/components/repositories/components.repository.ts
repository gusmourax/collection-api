import {
  CreateComponentRequest,
  CreateComponentResponse,
} from '@modules/components/dto/create-component.dto';
import {
  FindAllComponentsRequest,
  FindAllComponentsResponse,
} from '@modules/components/dto/find-component.dto';
import { Injectable } from '@nestjs/common';
import { generateUUID } from '@utils/uuid.utils';
import { PrismaService } from 'app/database/prisma.service';
import { IComponentsRepository } from './components-repository.interface';

@Injectable()
export class ComponentsRepository implements IComponentsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    data: FindAllComponentsRequest,
  ): Promise<FindAllComponentsResponse> {
    const page = data.page || 1;
    const limit = data.limit || 10;

    const [components, count] = await Promise.all([
      this.prisma.component.findMany({
        where: {
          ...(data.title && {
            title: { contains: data.title, mode: 'insensitive' },
          }),
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { title: 'asc' },
        include: { categories: true },
      }),
      this.prisma.component.count({
        where: {
          ...(data.title && {
            title: { contains: data.title, mode: 'insensitive' },
          }),
        },
      }),
    ]);

    return {
      data: components.map((component) => ({
        id: component.id,
        title: component.title,
        description: component.description,
        price: component.price,
        urlThumbnail: component.urlThumbnail,
        categories: component.categories.map((category) => ({
          id: category.id,
          name: category.name,
        })),
      })),
      limit,
      page,
      total: count,
    };
  }

  async create(data: CreateComponentRequest): Promise<CreateComponentResponse> {
    const component = await this.prisma.component.create({
      data: {
        id: generateUUID(),
        urlThumbnail: data.urlThumbnail,
        title: data.title,
        description: data.description,
        price: data.price,
        categories: {
          connect: data.categories.map((id) => ({ id })),
        },
      },
    });

    return {
      id: component.id,
    };
  }
}
