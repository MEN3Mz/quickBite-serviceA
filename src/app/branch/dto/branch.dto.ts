import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  Min,
  MinLength,
} from "class-validator";
import { timeStamp } from "node:console";
import { Currency } from "../enums.ts";

export class CreateBranchDTO {
  @IsString() @MinLength(1) addressText!: string; //
  @IsString() @MinLength(1) label!: string; //
  @IsNumber() lat!: number; //
  @IsNumber() lng!: number; //
  @IsString() @MinLength(1) countryCode!: string; //

  @IsString()
  opensAt!: string;
  @IsString()
  closesAt!: string;

  @Min(0)
  deliveryRadius!: number;

  @IsEnum(Currency) currency!: Currency;
}

export class UpdateBranchStatusDTO {
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  comission?: number;
}

export class UpdateBranchDTO {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  label?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  addressText?: string;

  @IsOptional()
  @IsNumber()
  lat?: number;

  @IsOptional()
  @IsNumber()
  lng?: number;

  @IsOptional()
  @IsString()
  opensAt?: string;

  @IsOptional()
  @IsString()
  closesAt?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  deliveryRadius?: number;

  @IsOptional()
  @IsEnum(Currency)
  currency?: Currency;

  @IsOptional()
  @IsBoolean()
  acceptOrders?: boolean;
}
