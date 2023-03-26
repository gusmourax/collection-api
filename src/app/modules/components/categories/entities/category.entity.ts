import { ApiProperty } from '@nestjs/swagger';
import { generateUUID } from '@utils/uuid.utils';

export class Category {
  @ApiProperty({ description: 'Category id', example: generateUUID() })
  id: string;

  @ApiProperty({ description: 'Category name', example: 'Category name' })
  name: string;
}
