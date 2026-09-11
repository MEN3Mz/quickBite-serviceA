import { AppError } from "../error/AppError.ts";
import { StatusCodes } from "http-status-codes";

export const NotAuthenticatedError = new AppError(
  "user does not exist",
  StatusCodes.FORBIDDEN,
);
