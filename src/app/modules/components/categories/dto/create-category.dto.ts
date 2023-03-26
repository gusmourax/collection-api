import { ApiProperty } from '@nestjs/swagger';
import { generateUUID } from '@utils/uuid.utils';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoryRequest {
  @ApiProperty({ description: 'Category name', example: 'Category' })
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class CreateCategoryResponse {
  @ApiProperty({ description: 'Category id', example: generateUUID() })
  id: string;
}
