import { StatusCodes } from "http-status-codes";
import { validateBody } from "../../../common/validation/validate.ts";
import {
  restaurantService,
  RestaurantService,
} from "../service/restaurant.service.ts";
import { NextFunction, Request, Response } from "express";
import { UpdateRestaurantDTO } from "../dto/restaurant.dto.ts";
import { AtLeastOneUpdateMustBeProvidedError } from "../errors.ts";

export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  getById = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const restaurant = await this.restaurantService.getById(
        Number(req.params.id),
      );
      return res.status(StatusCodes.OK).json(restaurant);
    } catch (err) {
      next(err);
    }
  };
  getAll = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const restaurants = await this.restaurantService.getAll();
      return res.status(StatusCodes.OK).json(restaurants);
    } catch (err) {
      next(err);
    }
  };
  updateRestaurant = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const data: UpdateRestaurantDTO = await validateBody(
        UpdateRestaurantDTO,
        req.body,
      );
      const hasUpdate =
        data.name !== undefined ||
        data.logoUrl !== undefined ||
        data.primaryCountry !== undefined ||
        data.status !== undefined;

      if (!hasUpdate) {
        throw AtLeastOneUpdateMustBeProvidedError;
      }
      const restaurant = await this.restaurantService.update(
        Number(req.params.id),
        data,
        req.user!.userId,
      );
      return res.status(StatusCodes.OK).json(restaurant);
    } catch (err) {
      next(err);
    }
  };
}

export const restaurantController = new RestaurantController(restaurantService);
