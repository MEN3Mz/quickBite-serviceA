import { Router } from "express";
import { authController } from "../controller/auth.controller.ts";

export const authRouter = Router();

authRouter
  .post("/register", authController.register)
  .post("/login", authController.login)
  .post("/forgetPassword", authController.forgetPassword)
  .post("/resetPassword", authController.resetPassword)
  .post("/refresh", authController.refresh);
