import { AuthService } from "../service/auth.service.ts";
import { NextFunction, Request, Response } from "express";
import {
  ForgetPasswordDTO,
  LoginDTO,
  RegisterDTO,
  ResetPasswordDTO,
} from "../dto/auth.dto.ts";
import { validateBody } from "../../../common/validation/validate.ts";
import { StatusCodes } from "http-status-codes";
import { env } from "../../../common/config/env.ts";
import { time } from "../../../common/time.ts";
import { AuthResult } from "../../../common/types/auth.types.ts";
import { authService } from "../service/auth.service.ts";

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  private setAuthCookies(res: Response, result: AuthResult): void {
    const isProduction = env.NODE.nodeENV === "production";

    res.cookie("access_token", result.accessToken, {
      httpOnly: true,
      secure: isProduction,
      maxAge: time(1, "h"),
    });

    res.cookie("refresh_token", result.refreshToken, {
      httpOnly: true,
      secure: isProduction,
      maxAge: time(7, "d"),
      path: "/api/auth/refresh",
    });
  }

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data: RegisterDTO = await validateBody(RegisterDTO, req.body);

      const result = await this.authService.registerUser(data);
      this.setAuthCookies(res, result);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };
  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data: LoginDTO = await validateBody(LoginDTO, req.body);
      const result = await this.authService.loginUser(data);
      this.setAuthCookies(res, result);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };
  forgetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await validateBody(ForgetPasswordDTO, req.body);
      const result = await this.authService.forgetPassword(data);
      res.status(StatusCodes.OK).json(result);
    } catch (error) {
      next(error);
    }
  };
  resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await validateBody(ResetPasswordDTO, req.body);
      const result = await this.authService.resetPassword(data);
      res.status(StatusCodes.OK).json({
        message: "password reset successfully. please login again",
      });
    } catch (error) {
      next(error);
    }
  };
  refresh = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.cookies?.refresh_token;
      if (!token)
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ message: "Unauthorized" });
      const result = await this.authService.refresh(token);

      this.setAuthCookies(res, result);
      return res.status(StatusCodes.OK).json({
        message: "Token refreshed successfully",
      });
    } catch (error) {
      next(error);
    }
  };
}
export const authController = new AuthController(authService);
