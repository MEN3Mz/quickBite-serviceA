import { AppError } from "../../common/error/AppError.ts";
import { StatusCodes } from "http-status-codes";

export const UserAlreadyExistsError = new AppError(
  "User already exists",
  StatusCodes.BAD_REQUEST,
);

export const CannotRegisterAsAdminError = new AppError(
  "Cannot register as a system admin",
  StatusCodes.FORBIDDEN,
);
export const InvalidCredentialsError = new AppError(
  "Invalid Credentials",
  StatusCodes.UNAUTHORIZED,
);
export const InvalidOTPError = new AppError(
  "Incorrect OTP",
  StatusCodes.UNAUTHORIZED,
);

export const UserNotFoundError = new AppError(
  "user does not exist",
  StatusCodes.NOT_FOUND,
);

export const RestaurantDataRequiredError = new AppError(
  "Restaurant data must be provided",

  StatusCodes.BAD_REQUEST,
);
