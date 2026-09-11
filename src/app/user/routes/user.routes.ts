import { Router } from "express";

import { userController } from "../controller/user.controller.ts";
import { authenticate } from "../../../common/auth/guard.ts";

export const userRouter = Router();

userRouter.get("/me", authenticate, userController.getMe);
userRouter.patch("/me", authenticate, userController.update);
