import { User } from '@modules/users/entities/user.entity';
import { UserRole } from '@modules/users/enums/user-role.enum';
import { generateUUID } from '@utils/uuid.utils';

export const usersSeed: User[] = [
  {
    id: generateUUID(),
    email: 'admin@collection.com.br',
    name: 'Collection Admin',
    password: 'admin',
    role: UserRole.ADMIN,
  },
  {
    id: generateUUID(),
    email: 'pro@collection.com.br',
    name: 'Collection Pro',
    password: 'userpro',
    role: UserRole.PRO,
  },
];
