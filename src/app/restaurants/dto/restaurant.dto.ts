import {
  IsEnum,
  IsOptional,
  IsString,
  IsUrl,
  MinLength,
} from "class-validator";
import { RestaurantStatus } from "../enums.ts";

export class CreateRestaurantDTO {
  @IsString()
  @MinLength(1)
  name!: string;

  @IsOptional()
  @IsUrl()
  logoUrl?: string;

  @IsString()
  @MinLength(1)
  primaryCountry!: string;
}

export class UpdateRestaurantDTO {
  @IsOptional()
  @IsString()
  @MinLength(1)
  name?: string;
  @MinLength(1)
  @IsOptional()
  @IsUrl()
  logoUrl?: string;
  @IsOptional()
  @IsString()
  @MinLength(1)
  primaryCountry?: string;
  @IsOptional()
  @IsEnum(RestaurantStatus)
  status?: RestaurantStatus;
}
