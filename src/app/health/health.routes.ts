import { Router } from "express";

import { pingDB } from "../../common/db/knex.ts";

export const healthRouter = Router();

healthRouter.get("/", async (req, res) => {
  try {
    await pingDB();
    res.status(200).json({ status: "ok", message: "Database ping successful" });
  } catch (error) {
    console.error("Database ping failed:", error);
    return res
      .status(500)
      .json({ status: "error", message: "Database ping failed" });
  }
});
