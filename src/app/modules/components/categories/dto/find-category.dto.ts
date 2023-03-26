import { ApiProperty } from '@nestjs/swagger';
import { generateUUID } from '@utils/uuid.utils';

export class FindCategoryResponse {
  @ApiProperty({ description: 'Category id', example: generateUUID() })
  id: string;

  @ApiProperty({ description: 'Category name', example: 'CATEGORY' })
  name: string;
}
