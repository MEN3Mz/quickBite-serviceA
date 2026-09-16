import { Router } from "express";
import { productController } from "../controller/product.controller.ts";
import { authenticate } from "../../../common/auth/guard.ts";

export const productRouter = Router();

productRouter
  .get(
    "/restaurants/:restaurantId/categories",
    productController.findRestaurantCategories,
  )
  .get("/products/:id", productController.findById)
  .get(
    "/restaurants/:restaurantId/products",
    authenticate,
    productController.findByRestaurant,
  )
  .get("/branches/:branchId/products", productController.findProductsByBranch);

productRouter.post(
  "/restaurants/:restaurantId/products",
  authenticate,
  productController.create,
);

productRouter.patch("/products/:id", authenticate, productController.update);
