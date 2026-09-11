import { AppError } from "../../common/error/AppError.ts";
import { StatusCodes } from "http-status-codes";

export const AddressNotFoundError = new AppError(
  "address does not exist",
  StatusCodes.NOT_FOUND,
);
export const InvalidAddressError = new AppError(
  "Address is Invalid",
  StatusCodes.BAD_REQUEST,
);
