import { Test } from '@nestjs/testing';
import {
  CategoryAlreadyExists,
  CategoryDoesNotExists,
} from './categories/errors';
import { ComponentsController } from './components.controller';
import { ComponentsService } from './components.service';
import { CreateComponentRequest } from './dto/create-component.dto';
import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@modules/auth/guards/roles.guard';
import request from 'supertest';
import {
  ForbiddenException,
  INestApplication,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateCategoryRequest } from './categories/dto/create-category.dto';

describe('ComponentsController', () => {
  let app: INestApplication;
  const componentsServiceStub = {
    create: jest.fn().mockResolvedValue({ id: 'any_id' }),
    findAll: jest.fn().mockResolvedValue({
      data: [],
      limit: 10,
      page: 1,
      total: 0,
    }),
    createCategory: jest.fn().mockResolvedValue({ id: 'any_id' }),
    findAllCategories: jest.fn().mockResolvedValue([]),
  };
  const jwtAuthGuardStub = {
    canActivate: jest.fn().mockReturnValue(true),
  };
  const rolesGuardStub = {
    canActivate: jest.fn().mockReturnValue(true),
  };
  let sut: ComponentsController;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [ComponentsController],
      providers: [
        {
          provide: ComponentsService,
          useValue: componentsServiceStub,
        },
        {
          provide: JwtAuthGuard,
          useValue: {},
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(jwtAuthGuardStub)
      .overrideGuard(RolesGuard)
      .useValue(rolesGuardStub)
      .compile();

    sut = moduleRef.get<ComponentsController>(ComponentsController);
    app = moduleRef.createNestApplication();
    await app.init();
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  describe('create', () => {
    it('should return a CreateComponentResponse if success', async () => {
      const body: CreateComponentRequest = {
        title: 'any_title',
        description: 'any_description',
        price: 10,
        urlThumbnail: 'any_url_thumbnail',
        categories: ['any_category'],
      };

      const response = await sut.create(body);

      expect(response).toEqual({
        id: 'any_id',
      });
    });

    it('should call componentsService.create with correct params', async () => {
      const body: CreateComponentRequest = {
        title: 'any_title',
        description: 'any_description',
        price: 10,
        urlThumbnail: 'any_url_thumbnail',
        categories: ['any_category'],
      };

      await sut.create(body);

      expect(componentsServiceStub.create).toHaveBeenCalledWith(body);
    });

    it('should throw if componentsService.create throws', async () => {
      const body: CreateComponentRequest = {
        title: 'any_title',
        description: 'any_description',
        price: 10,
        urlThumbnail: 'any_url_thumbnail',
        categories: ['any_category'],
      };

      componentsServiceStub.create.mockRejectedValueOnce(new Error());

      const promise = sut.create(body);

      await expect(promise).rejects.toThrow();
    });

    it('should return 404 if some category does not exists', async () => {
      const body: CreateComponentRequest = {
        title: 'any_title',
        description: 'any_description',
        price: 10,
        urlThumbnail: 'any_url_thumbnail',
        categories: ['any_category'],
      };

      componentsServiceStub.create.mockRejectedValueOnce(
        new CategoryDoesNotExists(),
      );

      await request(app.getHttpServer())
        .post('/components')
        .send(body)
        .expect(404);
    });

    it('should return 401 if user is not authenticated', async () => {
      const body: CreateComponentRequest = {
        title: 'any_title',
        description: 'any_description',
        price: 10,
        urlThumbnail: 'any_url_thumbnail',
        categories: ['any_category'],
      };

      jwtAuthGuardStub.canActivate.mockRejectedValueOnce(
        new UnauthorizedException(),
      );

      await request(app.getHttpServer())
        .post('/components')
        .send(body)
        .expect(401);
    });

    it('should return 403 if user is not admin', async () => {
      const body: CreateComponentRequest = {
        title: 'any_title',
        description: 'any_description',
        price: 10,
        urlThumbnail: 'any_url_thumbnail',
        categories: ['any_category'],
      };

      rolesGuardStub.canActivate.mockRejectedValueOnce(
        new ForbiddenException(),
      );

      await request(app.getHttpServer())
        .post('/components')
        .send(body)
        .expect(403);
    });
  });

  describe('findAll', () => {
    it('should return a FindAllComponentsResponse if success', async () => {
      const componentsPaginated = {
        data: [
          {
            id: 'any_id',
            title: 'any_title',
            description: 'any_description',
            price: 10,
            urlThumbnail: 'any_url_thumbnail',
            categories: [
              {
                id: 'any_id',
                name: 'any_name',
              },
            ],
          },
        ],
        limit: 10,
        page: 1,
        total: 1,
      };

      componentsServiceStub.findAll.mockResolvedValueOnce(componentsPaginated);

      const response = await sut.findAll({
        limit: 10,
        page: 1,
      });

      expect(response).toEqual(componentsPaginated);
    });

    it('should call componentsService.findAll with correct params', async () => {
      const query = {
        limit: 10,
        page: 1,
        title: 'any_title',
      };

      await sut.findAll(query);

      expect(componentsServiceStub.findAll).toHaveBeenCalledWith(query);
    });

    it('should throw if componentsService.findAll throws', async () => {
      componentsServiceStub.findAll.mockRejectedValueOnce(new Error());

      const promise = sut.findAll({});

      await expect(promise).rejects.toThrow();
    });

    it('should return 200 if success', async () => {
      await request(app.getHttpServer()).get('/components').expect(200);
    });

    it('should return 401 if user is not authenticated', async () => {
      jwtAuthGuardStub.canActivate.mockRejectedValueOnce(
        new UnauthorizedException(),
      );

      await request(app.getHttpServer()).get('/components').expect(401);
    });
  });

  describe('createCategory', () => {
    it('should return a CreateCategoryResponse if success', async () => {
      const body: CreateCategoryRequest = {
        name: 'any_name',
      };

      const response = await sut.createCategory(body);

      expect(response).toEqual({
        id: 'any_id',
      });
    });

    it('should call componentsService.createCategory with correct params', async () => {
      const body: CreateCategoryRequest = {
        name: 'any_name',
      };

      await sut.createCategory(body);

      expect(componentsServiceStub.createCategory).toHaveBeenCalledWith(body);
    });

    it('should throw if componentsService.createCategory throws', async () => {
      const body: CreateCategoryRequest = {
        name: 'any_name',
      };

      componentsServiceStub.createCategory.mockRejectedValueOnce(new Error());

      const promise = sut.createCategory(body);

      await expect(promise).rejects.toThrow();
    });

    it('should return 401 if user is not authenticated', async () => {
      const body: CreateCategoryRequest = {
        name: 'any_name',
      };

      jwtAuthGuardStub.canActivate.mockRejectedValueOnce(
        new UnauthorizedException(),
      );

      await request(app.getHttpServer())
        .post('/components/categories')
        .send(body)
        .expect(401);
    });

    it('should return 403 if user is not admin', async () => {
      const body: CreateCategoryRequest = {
        name: 'any_name',
      };

      rolesGuardStub.canActivate.mockRejectedValueOnce(
        new ForbiddenException(),
      );

      await request(app.getHttpServer())
        .post('/components/categories')
        .send(body)
        .expect(403);
    });

    it('should return 400 if category already exists', async () => {
      const body: CreateCategoryRequest = {
        name: 'any_name',
      };

      componentsServiceStub.createCategory.mockRejectedValueOnce(
        new CategoryAlreadyExists(),
      );

      await request(app.getHttpServer())
        .post('/components/categories')
        .send(body)
        .expect(400);
    });
  });

  describe('findAllCategories', () => {
    it('should return a FindAllCategoriesResponse if success', async () => {
      const categories = [
        {
          id: 'any_id',
          name: 'any_name',
        },
      ];

      componentsServiceStub.findAllCategories.mockResolvedValueOnce(categories);

      const response = await sut.findAllCategories();

      expect(response).toEqual(categories);
    });

    it('should throw if componentsService.findAllCategories throws', async () => {
      componentsServiceStub.findAllCategories.mockRejectedValueOnce(
        new Error(),
      );

      const promise = sut.findAllCategories();

      await expect(promise).rejects.toThrow();
    });

    it('should return 200 if success', async () => {
      await request(app.getHttpServer())
        .get('/components/categories')
        .expect(200);
    });

    it('should return 403 if user is not admin', async () => {
      rolesGuardStub.canActivate.mockRejectedValueOnce(
        new ForbiddenException(),
      );

      await request(app.getHttpServer())
        .get('/components/categories')
        .expect(403);
    });

    it('should return 401 if user is not authenticated', async () => {
      jwtAuthGuardStub.canActivate.mockRejectedValueOnce(
        new UnauthorizedException(),
      );

      await request(app.getHttpServer())
        .get('/components/categories')
        .expect(401);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
