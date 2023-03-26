import { PrismaClient } from '@prisma/client';
import { componentSeed, categoriesSeed } from './records';

const prisma = new PrismaClient();

export default async () => {
  const componentsCount = await prisma.component.count();

  if (componentsCount === 0) {
    await prisma.component.create({
      data: {
        ...componentSeed,
        categories: {
          connectOrCreate: categoriesSeed.map((category) => ({
            create: category,
            where: { name: category.name },
          })),
        },
      },
    });
  }

  await prisma.$disconnect();
};
