import { Type } from "class-transformer";
import { IsInt, IsOptional, IsString } from "class-validator";

export class SearchQuery {
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  page?: number;

  @Type(() => Number)
  @IsInt()
  @IsOptional()
  size?: number;

  @IsString()
  @IsOptional()
  search?: string;
}
