import { ApiProperty } from '@nestjs/swagger';
import { generateUUID, UUID_VERSION } from '@utils/uuid.utils';
import { IsNotEmpty, IsNumber, IsString, IsUrl, IsUUID } from 'class-validator';

export class CreateComponentRequest {
  @ApiProperty({
    description: 'Title of the component',
    example: 'Component 1',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Description of the component',
    example: 'Component description',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Array of component categories id',
    example: [generateUUID(), generateUUID()],
  })
  @IsNotEmpty()
  @IsUUID(UUID_VERSION, { each: true })
  categories: string[];

  @ApiProperty({
    description: 'URL thumbnail of the component',
    example: 'https://collection.com.br',
  })
  @IsNotEmpty()
  @IsUrl()
  urlThumbnail: string;

  @ApiProperty({ description: 'Price of the component', example: 1000 })
  @IsNotEmpty()
  @IsNumber()
  price: number;
}

export class CreateComponentResponse {
  @ApiProperty({ description: 'ID of the component', example: generateUUID() })
  id: string;
}
