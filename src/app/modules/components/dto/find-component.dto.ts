import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Component } from '../entities/component.entity';

export class FindAllComponentsRequest {
  @ApiPropertyOptional({ description: 'Page number', default: 1 })
  @IsNumber()
  @Min(1)
  @IsOptional()
  page?: number;

  @ApiPropertyOptional({ description: 'Limit of items per page', default: 10 })
  @IsNumber()
  @Min(1)
  @IsOptional()
  limit?: number;

  @ApiPropertyOptional({ description: 'Search by title', default: '' })
  @IsOptional()
  @IsString()
  title?: string;
}

export class FindAllComponentsResponse {
  @ApiProperty({ description: 'List of components', type: [Component] })
  data: Component[];

  @ApiProperty({ description: 'Current page number', default: 1 })
  page: number;

  @ApiProperty({ description: 'Limit of items per page', default: 10 })
  limit: number;

  @ApiProperty({ description: 'Total of items' })
  total: number;
}
