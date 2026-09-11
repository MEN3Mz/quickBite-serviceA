import { Router } from "express";
import { authenticate } from "../../../common/auth/guard.ts";
import { addressController } from "../controller/address.controller.ts";

export const addressRouter = Router();

addressRouter.use(authenticate);
addressRouter.post("/", addressController.create);
addressRouter
  .get("/", addressController.getAll)
  .get("/:id", addressController.getById);
addressRouter.patch("/:id", addressController.update);
addressRouter.delete("/:id", addressController.delete);
