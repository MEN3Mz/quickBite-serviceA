import { AppError } from "../../common/error/AppError.ts";
import { StatusCodes } from "http-status-codes";

export const UserNotFoundError = new AppError(
  "user does not exist",
  StatusCodes.NOT_FOUND,
);
