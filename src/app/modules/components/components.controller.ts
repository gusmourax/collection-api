import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ComponentsService } from './components.service';
import {
  CreateComponentRequest,
  CreateComponentResponse,
} from './dto/create-component.dto';
import { HasAuthorization } from '@modules/auth/decorators/authorization.decorator';
import { UserRole } from '@modules/users/enums/user-role.enum';
import {
  FindAllComponentsRequest,
  FindAllComponentsResponse,
} from './dto/find-component.dto';
import {
  CreateCategoryRequest,
  CreateCategoryResponse,
} from './categories/dto/create-category.dto';
import { FindCategoryResponse } from './categories/dto/find-category.dto';

@ApiTags('Components')
@Controller('/components')
export class ComponentsController {
  constructor(private readonly componentsService: ComponentsService) {}

  @ApiOperation({
    summary: 'Create a new component',
    description: 'Create a new component',
  })
  @ApiCreatedResponse({
    description: 'Component created',
    type: CreateComponentResponse,
  })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @ApiForbiddenResponse({ description: 'User does not have authorization' })
  @ApiBadRequestResponse({ description: 'Category does not exists' })
  @ApiBearerAuth()
  @HasAuthorization(UserRole.ADMIN)
  @Post('/')
  async create(
    @Body() body: CreateComponentRequest,
  ): Promise<CreateComponentResponse> {
    const { categories, description, price, title, urlThumbnail } = body;

    return this.componentsService.create({
      categories,
      description,
      price,
      title,
      urlThumbnail,
    });
  }

  @ApiOperation({
    summary: 'Find all components paginated',
    description: 'Find all components paginated',
  })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @ApiOkResponse({ description: 'Ok', type: FindAllComponentsResponse })
  @ApiBearerAuth()
  @HasAuthorization(UserRole.ADMIN, UserRole.PRO)
  @Get('/')
  async findAll(
    @Query() query: FindAllComponentsRequest,
  ): Promise<FindAllComponentsResponse> {
    const { limit, page, title } = query;

    return this.componentsService.findAll({
      limit,
      page,
      title,
    });
  }

  @ApiOperation({
    summary: 'Create a new component category',
    description: 'Create a new component category',
  })
  @ApiCreatedResponse({
    description: 'Category created',
    type: CreateCategoryResponse,
  })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @ApiForbiddenResponse({ description: 'User does not have authorization' })
  @ApiBadRequestResponse({ description: 'Category already exists' })
  @ApiBearerAuth()
  @HasAuthorization(UserRole.ADMIN)
  @Post('/categories')
  async createCategory(
    @Body() body: CreateCategoryRequest,
  ): Promise<CreateCategoryResponse> {
    const { name } = body;

    return this.componentsService.createCategory({ name });
  }

  @ApiOperation({
    summary: 'Find all component categories',
    description: 'Find all component categories',
  })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @ApiForbiddenResponse({ description: 'User does not have authorization' })
  @ApiOkResponse({ description: 'Ok', type: [FindCategoryResponse] })
  @ApiBearerAuth()
  @HasAuthorization(UserRole.ADMIN)
  @Get('/categories')
  async findAllCategories(): Promise<FindCategoryResponse[]> {
    return this.componentsService.findAllCategories();
  }
}
