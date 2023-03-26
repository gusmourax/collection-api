import {
  CreateCategoryRequest,
  CreateCategoryResponse,
} from '@modules/components/categories/dto/create-category.dto';
import { FindCategoryResponse } from '@modules/components/categories/dto/find-category.dto';

export interface ICategoriesRepository {
  create(data: CreateCategoryRequest): Promise<CreateCategoryResponse>;
  findListByIds(ids: string[]): Promise<FindCategoryResponse[]>;
}
