import { StatusCodes } from "http-status-codes";
import { userService, UserService } from "../service/user.service.ts";
import { NextFunction, Request, Response } from "express";
import { UpdateUserDTO } from "../dto/user.dto.ts";
import { validateBody } from "../../../common/validation/validate.ts";

export class UserController {
  constructor(private readonly userService: UserService) {}

  getMe = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.userService.getById(req.user?.userId!);
      return res.status(StatusCodes.OK).json(user);
    } catch (error) {
      next(error);
    }
  };
  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data: UpdateUserDTO = await validateBody(UpdateUserDTO, req.body);
      const user = await this.userService.update(
        req.user!.userId,
        data.name,
        data.phoneNumber,
      );
      res.status(StatusCodes.OK).json(user);
    } catch (error) {
      next(error);
    }
  };
}

export const userController = new UserController(userService);
