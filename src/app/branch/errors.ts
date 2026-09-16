import { StatusCodes } from "http-status-codes";
import { AppError } from "../../common/error/AppError.ts";

export const UnAuthorizedError = new AppError(
  "user not authorised",
  StatusCodes.UNAUTHORIZED,
);
export const NoBranchesFoundError = new AppError(
  "No branches were Found",
  StatusCodes.NOT_FOUND,
);
