import { ApiProperty } from '@nestjs/swagger';

export class FindCategoryResponse {
  @ApiProperty({ description: 'Category id' })
  id: string;

  @ApiProperty({ description: 'Category name' })
  name: string;
}
