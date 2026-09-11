import { AppError } from "../../common/error/AppError.ts";
import { StatusCodes } from "http-status-codes";

export const RestaurantNotFoundError = new AppError(
  "Restaurant does not exist",
  StatusCodes.NOT_FOUND,
);

export const AtLeastOneUpdateMustBeProvidedError = new AppError(
  "At least one update must be provided",
  StatusCodes.BAD_REQUEST,
);
