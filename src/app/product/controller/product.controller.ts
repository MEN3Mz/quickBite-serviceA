import { StatusCodes } from "http-status-codes";
import { ProductService, productService } from "../service/product.service.ts";
import { NextFunction, Request, Response } from "express";
import { SystemRole } from "../../user/enums.ts";
import { CreateProductDTO, UpdateProductDTO } from "../dto/product.dto.ts";
import { validateBody } from "../../../common/validation/validate.ts";

export class ProductController {
  constructor(private readonly productService: ProductService) {}

  findRestaurantCategories = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const result = await this.productService.findCategoriesByRestaurant(
        Number(req.params.restaurantId),
      );
      return res.status(StatusCodes.OK).json(result);
    } catch (err) {
      next(err);
    }
  };
  findProductsByBranch = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const result = await this.productService.getByBranch(
        Number(req.params.branchId),
      );
      res.status(StatusCodes.OK).json(result);
    } catch (err) {
      next(err);
    }
  };
  findByRestaurant = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const results = await this.productService.getByRestaurant(
        Number(req.params.restaurantId),
        req.user?.userId!,
        req.user?.role! as SystemRole,
      );
      res.status(200).json({ data: results });
    } catch (err) {
      next(err);
    }
  };
  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await validateBody(CreateProductDTO, req.body);
      const product = await this.productService.createProduct(
        req.user?.userId!,

        req.user?.role! as SystemRole,
        Number(req.params.restaurantId),
        data,
      );
      res.status(201).json({ message: "Product created", product });
    } catch (err) {
      next(err);
    }
  };
  findById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const product = await this.productService.findById(Number(req.params.id));
      res.status(200).json(product);
    } catch (err) {
      next(err);
    }
  };
  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await validateBody(UpdateProductDTO, req.body);
      const branchId = req.query.branchId
        ? Number(req.query.branchId)
        : undefined;
      const result = await this.productService.updateProduct(
        data,
        Number(req.params.id),
        req.user?.userId!,
        req.user?.role! as SystemRole,

        branchId,
      );
      res.status(200).json({ message: "Product updated", ...result });
    } catch (err) {
      next(err);
    }
  };
  getCategoriesByRestaurant = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const data = await this.productService.getByRestaurant(
        Number(req.params.restaurantId),
        req.user!.userId,
        req.user!.role as SystemRole,
      );
      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  };
}
export const productController = new ProductController(productService);
