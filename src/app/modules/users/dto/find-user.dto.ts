import { UserRole } from '../enums/user-role.enum';

export class FindByIdUserResponse {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export class FindByEmailResponse {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  password?: string;
}
