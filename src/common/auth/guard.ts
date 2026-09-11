import { NextFunction, Request, Response } from "express";
import { NotAuthenticatedError } from "./errors.ts";
import {
  verifyAccessToken,
  verifyRefreshToken,
} from "../../app/auth/utils/jwt.ts";

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies.access_token;
  if (!token) throw NotAuthenticatedError;

  const payload = verifyAccessToken(token);
  req.user = payload;
  next();
}
