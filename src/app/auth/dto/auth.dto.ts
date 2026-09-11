//structural validation >0 email

import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  Length,
  MaxLength,
  MinLength,
  ValidateNested,
} from "class-validator";
import { SystemRole } from "../../user/enums.ts";
import { Type } from "class-transformer";

//bussiness validation acc exists or not

export class RegisterDTO {
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

  @IsEnum(SystemRole, {
    message:
      "Role must be one of the following: customer, restaurant_user, delivery_agent",
  })
  role!: SystemRole;

  @IsOptional()
  @ValidateNested()
  @Type(() => RegisterRestaurantDTO)
  restaurant?: RegisterRestaurantDTO;
}
export class LoginDTO {
  @IsEmail()
  email!: string;
  @IsString()
  @IsNotEmpty({ message: "Password must not be empty" })
  password!: string;
}

export class ForgetPasswordDTO {
  @IsEmail()
  email!: string;
}

export class ResetPasswordDTO {
  @IsEmail()
  email!: string;

  @IsString()
  @Length(6)
  otp!: string;

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
  newPassword!: string;
}

export class RegisterRestaurantDTO {
  @IsString()
  @MinLength(1)
  name!: string;

  @IsOptional()
  @IsString()
  logoUrl?: string;

  @IsString()
  @MinLength(1)
  primaryCountry!: string;
}
