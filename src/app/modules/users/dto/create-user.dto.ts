import { UserRole } from '../enums/user-role.enum';

export class CreateUserRequest {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export class CreateUserResponse {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}
