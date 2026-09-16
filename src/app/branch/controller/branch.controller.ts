import { Request, Response, NextFunction } from "express";
import { validateBody } from "../../../common/validation/validate.ts";
import {
  CreateBranchDTO,
  UpdateBranchDTO,
  UpdateBranchStatusDTO,
} from "../dto/branch.dto.ts";
import { branchService, BranchService } from "../service/branch.service.ts";
import { SystemRole } from "../../user/enums.ts";
import { StatusCodes } from "http-status-codes";

export class BranchController {
  constructor(private readonly branchService: BranchService) {}

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await validateBody(CreateBranchDTO, req.body);
      const branch = await this.branchService.createBranch(
        Number(req.params.restaurantId),
        Number(req.user?.userId),
        req.user?.role! as SystemRole,
        data,
      );
      res.status(StatusCodes.CREATED).json({ message: "Branch added", branch });
    } catch (err) {
      next(err);
    }
  };
  findNearby = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const results = await this.branchService.findNearby(
        Number(req.query.lat),
        Number(req.query.lng),
      );
      res.status(StatusCodes.OK).json({ data: results });
    } catch (err) {
      next(err);
    }
  };
  findAllBranches = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const results = await this.branchService.getAllBranches(
        Number(req.params.restaurantId),
      );
      res.status(StatusCodes.OK).json({ results });
    } catch (err) {
      next(err);
    }
  };
  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await validateBody(UpdateBranchDTO, req.body);
      const branch = await this.branchService.update(
        Number(req.params.id),
        req.user?.userId!,
        req.user?.role! as SystemRole,
        data,
      );
      res.status(200).json({ message: "Branch updated", branch });
    } catch (err) {
      next(err);
    }
  };

  updateStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await validateBody(UpdateBranchStatusDTO, req.body);
      const branch = await this.branchService.updateStatus(
        Number(req.params.id),
        req.user?.role! as SystemRole,
        data,
      );
      res.status(200).json({
        message: "Branch status updated",
        branch: {
          id: branch.id,
          isActive: branch.isActive,
          acceptOrders: branch.acceptingOrders,
          comission: branch.comission,
        },
      });
    } catch (err) {
      next(err);
    }
  };
}

export const branchController = new BranchController(branchService);
