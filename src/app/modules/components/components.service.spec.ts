import { Test } from '@nestjs/testing';
import { CategoryDoesNotExists } from './categories/errors';
import { CategoriesRepository } from './categories/repositories/categories.repository';
import { ComponentsService } from './components.service';
import { ComponentsRepository } from './repositories/components.repository';

describe('ComponentsService', () => {
  const componentsRepositoryStub = {
    create: jest.fn().mockResolvedValue({ id: 'any_id' }),
    findAll: jest.fn().mockResolvedValue({
      data: [],
      limit: 10,
      page: 1,
      total: 0,
    }),
  };
  const categoriesRepositoryStub = {
    findListByIds: jest.fn().mockResolvedValue([
      {
        id: 'any_id',
        name: 'any_name',
      },
    ]),
    create: jest.fn().mockResolvedValue({ id: 'any_id' }),
    findAll: jest.fn().mockResolvedValue([
      {
        id: 'any_id',
        name: 'any_name',
      },
    ]),
  };
  let sut: ComponentsService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ComponentsService,
        {
          provide: ComponentsRepository,
          useValue: componentsRepositoryStub,
        },
        {
          provide: CategoriesRepository,
          useValue: categoriesRepositoryStub,
        },
      ],
    }).compile();

    sut = moduleRef.get<ComponentsService>(ComponentsService);
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  describe('create', () => {
    it('should return a CreateComponentResponse if success', () => {
      const data = {
        title: 'any_title',
        description: 'any_description',
        categories: ['any_id'],
        urlThumbnail: 'any_url_thumbnail',
        price: 10,
      };

      const result = sut.create(data);

      expect(result).resolves.toEqual({ id: 'any_id' });
    });

    it('should call componentsRepository.create with correct values', () => {
      const data = {
        title: 'any_title',
        description: 'any_description',
        categories: ['any_id'],
        urlThumbnail: 'any_url_thumbnail',
        price: 10,
      };

      sut.create(data);

      expect(componentsRepositoryStub.create).toHaveBeenCalledWith({
        title: data.title,
        description: data.description,
        categories: data.categories,
        urlThumbnail: data.urlThumbnail,
        price: data.price,
      });
    });

    it('should call categoriesRepository.findListByIds with correct values', () => {
      const data = {
        title: 'any_title',
        description: 'any_description',
        categories: ['any_id'],
        urlThumbnail: 'any_url_thumbnail',
        price: 10,
      };

      sut.create(data);

      expect(categoriesRepositoryStub.findListByIds).toHaveBeenCalledWith(
        data.categories,
      );
    });

    it('should throw if some category does not exists', () => {
      const data = {
        title: 'any_title',
        description: 'any_description',
        categories: ['any_id'],
        urlThumbnail: 'any_url_thumbnail',
        price: 10,
      };

      categoriesRepositoryStub.findListByIds.mockResolvedValue([]);

      const promise = sut.create(data);

      expect(promise).rejects.toThrow(new CategoryDoesNotExists());
    });
  });

  describe('findAll', () => {
    it('should call componentsRepository.findAll with correct values', () => {
      const data = {
        limit: 10,
        page: 1,
        title: 'any_title',
      };

      sut.findAll(data);

      expect(componentsRepositoryStub.findAll).toHaveBeenCalledWith({
        limit: data.limit,
        page: data.page,
        title: data.title,
      });
    });

    it('should return a FindAllComponentsResponse if success', () => {
      const data = {
        data: [
          {
            id: 'any_id',
            title: 'any_title',
            description: 'any_description',
            categories: [
              {
                id: 'any_id',
                name: 'any_name',
              },
            ],
            urlThumbnail: 'any_url_thumbnail',
            price: 10,
          },
        ],
        limit: 10,
        page: 1,
        total: 1,
      };

      componentsRepositoryStub.findAll.mockResolvedValue(data);

      const result = sut.findAll({
        limit: 10,
        page: 1,
        title: 'any_title',
      });

      expect(result).resolves.toEqual(data);
    });
  });

  describe('createCategory', () => {
    it('should call componentsRepository.createCategory with uppercase name', async () => {
      await sut.createCategory({
        name: 'any_name',
      });

      expect(categoriesRepositoryStub.create).toHaveBeenCalledWith({
        name: 'any_name'.toUpperCase(),
      });
    });

    it('should return a CreateCategoryResponse if success', async () => {
      const result = await sut.createCategory({
        name: 'any_name',
      });

      expect(result).toEqual({ id: 'any_id' });
    });

    it('should throw if categoriesRepository.create throws', async () => {
      categoriesRepositoryStub.create.mockRejectedValue(new Error());

      const promise = sut.createCategory({
        name: 'any_name',
      });

      expect(promise).rejects.toThrow();
    });
  });

  describe('findAllCategories', () => {
    it('should return a FindCategoryResponse[] if success', async () => {
      const result = await sut.findAllCategories();

      expect(result).toEqual([
        {
          id: 'any_id',
          name: 'any_name',
        },
      ]);
    });

    it('should throw if categoriesRepository.findAll throws', async () => {
      categoriesRepositoryStub.findAll.mockRejectedValue(new Error());

      const promise = sut.findAllCategories();

      expect(promise).rejects.toThrow();
    });
  });
});
