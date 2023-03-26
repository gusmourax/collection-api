import {
  FindAllComponentsRequest,
  FindAllComponentsResponse,
} from '@modules/components/dto/find-component.dto';
import {
  CreateComponentRequest,
  CreateComponentResponse,
} from '../dto/create-component.dto';

export interface IComponentsRepository {
  create(data: CreateComponentRequest): Promise<CreateComponentResponse>;
  findAll(data: FindAllComponentsRequest): Promise<FindAllComponentsResponse>;
}
