import { Router } from "express";

import { restaurantController } from "../controller/restaurant.controller.ts";
import { authenticate } from "../../../common/auth/guard.ts";

export const restaurantRouter = Router();

restaurantRouter.post(
  "/",
  authenticate,
  restaurantController.createRestaurantWithOwner,
);

restaurantRouter
  .get("/", authenticate, restaurantController.getAll)
  .get("/:id", authenticate, restaurantController.getById);

restaurantRouter
  .patch("/:id", authenticate, restaurantController.updateRestaurant)
  .patch("/:id/status", authenticate, restaurantController.updateStatus);
