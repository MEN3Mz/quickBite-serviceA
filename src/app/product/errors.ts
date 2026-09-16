import { AppError } from "../../common/error/AppError.ts";
import { StatusCodes } from "http-status-codes";

export const ProductDoesNotExistError = new AppError(
  "Product does not exist",
  StatusCodes.NOT_FOUND,
);
