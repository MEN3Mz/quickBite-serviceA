import { StatusCodes } from "http-status-codes";
import { validateBody } from "../../../common/validation/validate.ts";
import {
  restaurantService,
  RestaurantService,
} from "../service/restaurant.service.ts";
import { NextFunction, Request, Response } from "express";
import {
  CreateRestaurantDTO,
  UpdateRestaurantDTO,
  UpdateRestaurantStatusDTO,
} from "../dto/restaurant.dto.ts";
import { AtLeastOneUpdateMustBeProvidedError } from "../errors.ts";
import { LoginDTO } from "../../auth/dto/auth.dto.ts";
import { SystemRole } from "../../user/enums.ts";
import { UnAuthorizedError } from "../../branch/errors.ts";

export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const restaurant = await this.restaurantService.getById(
        Number(req.params.id),
      );
      return res.status(StatusCodes.OK).json(restaurant);
    } catch (err) {
      next(err);
    }
  };
  getAll = async (req: Request, res: Response, next: NextFunction) => {
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
      const updatedRestaurant = await this.restaurantService.update(
        Number(req.params.id),
        data,
        req.user!.userId,
        req.user?.role as SystemRole,
      );
      return res.status(StatusCodes.OK).json(updatedRestaurant);
    } catch (err) {
      next(err);
    }
  };
  createRestaurantWithOwner = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userRole = req.user?.role!;
      const data: CreateRestaurantDTO = await validateBody(
        CreateRestaurantDTO,
        req.body,
      );
      const result = await this.restaurantService.createWithOwner(
        data,
        userRole as SystemRole,
      );
      res.status(201).json({ message: "Restaurant created", ...result });
    } catch (err) {
      next(err);
    }
  };
  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await validateBody(UpdateRestaurantDTO, req.body);
      const result = await this.restaurantService.update(
        Number(req.params.id),
        data,
        Number(req.user?.userId!),
        req.user?.role! as SystemRole,
      );
      res
        .status(200)
        .json({ message: "Restaurant updated", restaurant: result });
    } catch (err) {
      next(err);
    }
  };

  updateStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await validateBody(UpdateRestaurantStatusDTO, req.body);
      const result = await this.restaurantService.updateStatus(
        Number(req.params.id),
        req.user?.role! as SystemRole,
        data,
      );
      res.status(200).json({
        message: "Status updated",
        restaurant: { id: result.id, status: result.status },
      });
    } catch (err) {
      next(err);
    }
  };
}

export const restaurantController = new RestaurantController(restaurantService);
