import { ApiProperty } from '@nestjs/swagger';
import { generateUUID } from '@utils/uuid.utils';
import { Category } from '../categories/entities/category.entity';

export class Component {
  @ApiProperty({ description: 'Component id', example: generateUUID() })
  id: string;

  @ApiProperty({ description: 'Component title', example: 'Component title' })
  title: string;

  @ApiProperty({
    description: 'Component description',
    example: 'Component description',
  })
  description: string;

  @ApiProperty({ description: 'Component price', example: 1000 })
  price: number;

  @ApiProperty({
    description: 'Component url thumbnail',
    example: 'https://collection.com.br',
  })
  urlThumbnail: string;

  @ApiProperty({ description: 'Component categories', type: [Category] })
  categories: Category[];
}
