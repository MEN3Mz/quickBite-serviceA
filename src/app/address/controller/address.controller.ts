import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { validateBody } from "../../../common/validation/validate.ts";
import { AddressDTO } from "../dto/address.dto.ts";
import { UpdateAddressDTO } from "../dto/update-address.dto.ts";
import { addressService, AddressService } from "../service/address.service.ts";

export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const addresses = await this.addressService.getAllCustomerAddresses(
        req.user!.userId,
      );
      return res.status(StatusCodes.OK).json(addresses);
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const address = await this.addressService.getById(
        Number(req.params.id),
        req.user!.userId,
      );
      return res.status(StatusCodes.OK).json(address);
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data: AddressDTO = await validateBody(AddressDTO, req.body);
      const address = await this.addressService.addCustomerAddress(
        req.user!.userId,
        data,
      );
      return res.status(StatusCodes.CREATED).json(address);
    } catch (error) {
      next(error);
    }
  };
  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data: UpdateAddressDTO = await validateBody(
        UpdateAddressDTO,
        req.body,
      );
      const address = await this.addressService.updateAddress(
        req.user!.userId,
        Number(req.params.id),
        data,
      );

      return res.status(StatusCodes.OK).json(address);
    } catch (error) {
      next(error);
    }
  };
  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const address = await this.addressService.deleteAddress(
        req.user!.userId,
        Number(req.params.id),
      );

      return res.status(StatusCodes.OK).json(address);
    } catch (error) {
      next(error);
    }
  };
}

export const addressController = new AddressController(addressService);
