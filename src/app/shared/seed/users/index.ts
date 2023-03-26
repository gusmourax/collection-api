import { PrismaClient } from '@prisma/client';
import { hash } from '@utils/hash.utils';
import { usersSeed } from './records';

const prisma = new PrismaClient();

export default async () => {
  const usersCount = await prisma.user.count();

  if (usersCount === 0) {
    await prisma.user.createMany({
      data: usersSeed.map((user) => ({
        ...user,
        password: hash(user.password, 10),
      })),
      skipDuplicates: true,
    });
  }
};
