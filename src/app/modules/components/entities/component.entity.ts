import { ApiProperty } from '@nestjs/swagger';
import { Category } from '../categories/entities/category.entity';

export class Component {
  @ApiProperty({ description: 'Component id' })
  id: string;

  @ApiProperty({ description: 'Component title' })
  title: string;

  @ApiProperty({ description: 'Component description' })
  description: string;

  @ApiProperty({ description: 'Component price' })
  price: number;

  @ApiProperty({ description: 'Component url thumbnail' })
  urlThumbnail: string;

  @ApiProperty({ description: 'Component categories', type: [Category] })
  categories: Category[];
}
