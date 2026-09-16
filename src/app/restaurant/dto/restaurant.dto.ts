import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsStrongPassword,
  IsUrl,
  MaxLength,
  MinLength,
  ValidateNested,
} from "class-validator";
import { RestaurantStatus } from "../enums.ts";
import { SystemRole } from "../../user/enums.ts";
import { Type } from "class-transformer";

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

  @ValidateNested()
  @Type(() => CreateRestaurantOwnerDTO)
  owner!: CreateRestaurantOwnerDTO;
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

export class CreateRestaurantOwnerDTO {
  @IsEmail()
  email!: string;

  @MinLength(10, {
    message: "Phone number must be at least 10 characters long",
  })
  @MaxLength(11, { message: "Phone number must be at most 11 characters long" })
  phoneNumber!: string;

  @IsString()
  @MinLength(3, { message: "Name must be at least 3 characters long" })
  name!: string;

  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    {
      message:
        "Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one symbol",
    },
  )
  password!: string;

  role!: SystemRole.RESTAURANT_USER;
}

export class UpdateRestaurantStatusDTO {
  @IsEnum(RestaurantStatus)
  status!: RestaurantStatus;
}
