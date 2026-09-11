import { IsBoolean, IsIn, IsNumber, IsOptional, IsString } from "class-validator";

export class AddressDTO {
  @IsString()
  label!: string;
  @IsString()
  country!: string;
  @IsString()
  city!: string;
  @IsString()
  street!: string;
  @IsString()
  building!: string;
  @IsString()
  apartment!: string;
  @IsString()
  @IsIn(["home", "work", "other"])
  type!: string;

  @IsNumber()
  lat!: number;

  @IsNumber()
  lng!: number;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}
