import jwt, { type SignOptions } from "jsonwebtoken";
import { env } from "../../../common/config/env.ts";
import bcrypt from "bcrypt";

export interface JwtPayload {
  email: string;
  role: string;
  userId: number;
}

export function createAccessToken(payload: JwtPayload): string {
  const options: SignOptions = {
    expiresIn: env.jwt.accessTokenExpiration as SignOptions["expiresIn"],
  };

  return jwt.sign(payload, env.jwt.accessSecret, options);
}
export function createRefreshToken(payload: JwtPayload): string {
  const options: SignOptions = {
    expiresIn: env.jwt.refreshTokenExpiration as SignOptions["expiresIn"],
  };

  return jwt.sign(payload, env.jwt.refreshSecret, options);
}

export function verifyAccessToken(token: string): JwtPayload {
  return jwt.verify(token, env.jwt.accessSecret) as JwtPayload;
}
export function verifyRefreshToken(token: string): JwtPayload {
  return jwt.verify(token, env.jwt.refreshSecret) as JwtPayload;
}
