import { generateUUID } from '@utils/uuid.utils';

export const categoriesSeed = [
  {
    id: generateUUID(),
    name: 'PNEU',
  },
  {
    id: generateUUID(),
    name: 'CARRO',
  },
  {
    id: generateUUID(),
    name: 'LAZER',
  },
];

export const componentSeed = {
  id: generateUUID(),
  title: 'Pneu 225/45R17',
  description: 'Pneu de carro 225/45R17',
  price: 550,
  urlThumbnail: 'https://www.collection.com.br/',
};
