import { Injectable } from '@nestjs/common';
import { generateUUID } from '@utils/uuid.utils';
import { CreateUserRequest, CreateUserResponse } from '../dto/create-user.dto';
import { UserRole } from '../enums/user-role.enum';
import { UserAlreadyExists } from '../errors';
import { IUsersRepository } from './users-repository.interface';
import {
  FindByEmailResponse,
  FindByIdUserResponse,
} from '../dto/find-user.dto';
import { PrismaService } from 'app/database/prisma.service';

@Injectable()
export class UsersRepository implements IUsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateUserRequest): Promise<CreateUserResponse> {
    const userAlreadyExists = await this.prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (userAlreadyExists) throw new UserAlreadyExists();

    const user = await this.prisma.user.create({
      data: {
        id: generateUUID(),
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
      },
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role as UserRole,
    };
  }

  async findById(id: string): Promise<FindByIdUserResponse | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) return null;

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role as UserRole,
    };
  }

  async findByEmail(
    email: string,
    returnPassword = false,
  ): Promise<FindByEmailResponse | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) return null;

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role as UserRole,
      password: returnPassword ? user.password : undefined,
    };
  }
}
