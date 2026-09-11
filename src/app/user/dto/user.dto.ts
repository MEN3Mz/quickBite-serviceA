import { IsOptional, MaxLength, MinLength } from "class-validator";

export class UpdateUserDTO {
  @IsOptional()
  @MinLength(10, {
    message: "Phone number must be at least 10 characters long",
  })
  @MaxLength(11, { message: "Phone number must be at most 11 characters long" })
  phoneNumber?: string;
  @IsOptional()
  @MinLength(3, { message: "name must be at least 3 characters long" })
  @MaxLength(255)
  name?: string;
}
