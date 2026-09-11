import { config } from "dotenv";
import { z } from "zod";
import path from "path";

config({ path: path.resolve(import.meta.dirname, "../../../.env") });

const schema = z.object({
  PORT: z.string().default("3000"),
  DB_HOST: z.string().default("localhost"),
  DB_PORT: z.string().default("5432"),
  DB_USER: z.string().default("postgres"),
  DB_PASSWORD: z.string(),
  DB_NAME: z.string(),
  DB_POOL_MAX: z.string().default("10"),
  DB_MIGRATION_DIRECTORY: z.string().default("./src/common/db/migrations"),
  DB_MIGRATION_EXTENSION: z.string().default("ts"),

  ACCESS_TOKEN_SECRET: z.string(),
  ACCESS_TOKEN_EXPIRATION: z.string().default("15m"),
  REFRESH_TOKEN_SECRET: z.string(),
  REFRESH_TOKEN_EXPIRATION: z.string().default("7d"),
  NODE_ENV: z.string().default("development"),
});

const parsed = schema.parse(process.env);

export const env = {
  port: Number(parsed.PORT),
  db: {
    host: parsed.DB_HOST,
    port: Number(parsed.DB_PORT),
    user: parsed.DB_USER,
    password: parsed.DB_PASSWORD,
    name: parsed.DB_NAME,
    poolMax: Number(parsed.DB_POOL_MAX),
    migrationDirectory: path.resolve(
      import.meta.dirname,
      "../../../",
      parsed.DB_MIGRATION_DIRECTORY,
    ),
    migrationExtension: parsed.DB_MIGRATION_EXTENSION,
  },
  jwt: {
    accessSecret: parsed.ACCESS_TOKEN_SECRET,
    accessTokenExpiration: parsed.ACCESS_TOKEN_EXPIRATION,
    refreshSecret: parsed.REFRESH_TOKEN_SECRET,
    refreshTokenExpiration: parsed.REFRESH_TOKEN_EXPIRATION,
  },
  NODE: {
    nodeENV: parsed.NODE_ENV,
  },
};
