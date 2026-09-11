// src/app/common/db/knex.ts
import knex from "knex";
import config from "./knexfile.ts";

export const db = knex(config);
export async function pingDB() {
  await db.raw("SELECT 1");
}
