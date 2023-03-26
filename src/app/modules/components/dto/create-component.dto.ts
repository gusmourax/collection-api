import { ApiProperty } from '@nestjs/swagger';
import { UUID_VERSION } from '@utils/uuid.utils';
import { IsNotEmpty, IsNumber, IsString, IsUrl, IsUUID } from 'class-validator';

export class CreateComponentRequest {
  @ApiProperty({ description: 'Title of the component' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ description: 'Description of the component' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ description: 'Array of component categories id' })
  @IsNotEmpty()
  @IsUUID(UUID_VERSION, { each: true })
  categories: string[];

  @ApiProperty({ description: 'URL thumbnail of the component' })
  @IsNotEmpty()
  @IsUrl()
  urlThumbnail: string;

  @ApiProperty({ description: 'Price of the component' })
  @IsNotEmpty()
  @IsNumber()
  price: number;
}

export class CreateComponentResponse {
  @ApiProperty({ description: 'ID of the component' })
  id: string;
}
