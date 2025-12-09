import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationDTO {
  @IsNumber()
  @IsPositive()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  limit?: number;
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  offset?: number;
}
