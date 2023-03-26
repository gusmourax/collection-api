import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoryRequest {
  @ApiProperty({ description: 'Category name' })
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class CreateCategoryResponse {
  @ApiProperty({ description: 'Category id' })
  id: string;
}
