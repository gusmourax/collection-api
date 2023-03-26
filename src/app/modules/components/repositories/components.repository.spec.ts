import { PrismaService } from '@app/database/prisma.service';
import { Test } from '@nestjs/testing';
import { ComponentsRepository } from './components.repository';

describe('ComponentsRepository', () => {
  const prismaServiceStub = {
    component: {
      create: jest.fn().mockResolvedValue({
        id: 'any_id',
      }),
      findMany: jest.fn().mockResolvedValue([]),
      count: jest.fn().mockResolvedValue(0),
    },
  };
  let sut: ComponentsRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ComponentsRepository,
        {
          provide: PrismaService,
          useValue: prismaServiceStub,
        },
      ],
    }).compile();

    sut = moduleRef.get<ComponentsRepository>(ComponentsRepository);
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  describe('create', () => {
    it('should return a CreateComponentResponse if success', async () => {
      const component = await sut.create({
        urlThumbnail: 'any_url_thumbnail',
        title: 'any_title',
        description: 'any_description',
        price: 100,
        categories: ['any_category'],
      });

      expect(component).toEqual({
        id: 'any_id',
      });
    });
  });

  describe('findAll', () => {
    it('should return a FindAllComponentsResponse if success', async () => {
      const component = {
        id: 'any_id',
        urlThumbnail: 'any_url_thumbnail',
        title: 'any_title',
        description: 'any_description',
        price: 100,
        categories: [{ id: 'any_id', name: 'any_name' }],
      };

      prismaServiceStub.component.findMany.mockResolvedValue([component]);
      prismaServiceStub.component.count.mockResolvedValue(1);

      const components = await sut.findAll({
        page: 1,
        limit: 10,
        title: 'any_title',
      });

      expect(components).toEqual({
        data: [component],
        limit: 10,
        page: 1,
        total: 1,
      });
    });
  });
});
