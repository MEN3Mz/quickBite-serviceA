import {
  IsBoolean,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";

export class UpdateAddressDTO {
  @IsString()
  @IsOptional()
  label?: string;
  @IsString()
  @IsOptional()
  country?: string;
  @IsString()
  @IsOptional()
  city?: string;
  @IsString()
  @IsOptional()
  street?: string;
  @IsString()
  @IsOptional()
  building?: string;
  @IsString()
  @IsOptional()
  apartment?: string;
  @IsString()
  @IsOptional()
  @IsIn(["home", "work", "other"])
  type?: string;
  @IsOptional()
  @IsNumber()
  lat?: number;
  @IsOptional()
  @IsNumber()
  lng?: number;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}
