import { CreateUserRequest, CreateUserResponse } from '../dto/create-user.dto';
import {
  FindByEmailResponse,
  FindByIdUserResponse,
} from '../dto/find-user.dto';

export interface IUsersRepository {
  create(data: CreateUserRequest): Promise<CreateUserResponse>;
  findById(id: string): Promise<FindByIdUserResponse | null>;
  findByEmail(
    email: string,
    returnPassword?: boolean,
  ): Promise<FindByEmailResponse | null>;
}
