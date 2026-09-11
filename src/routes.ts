//common ->app ->routes

import { Router } from "express";
import { healthRouter } from "./app/health/health.routes.ts";
import { authRouter } from "./app/auth/routes/auth.routes.ts";
import { userRouter } from "./app/user/routes/user.routes.ts";
import { addressRouter } from "./app/address/routes/address.routes.ts";
import { restaurantRouter } from "./app/restaurants/routes/restaurant.routes.ts";

export const routes = Router();

//routes.use("/user",userRoutes)
routes
  .use("/health", healthRouter)
  .use("/auth", authRouter)
  .use("/user", userRouter)
  .use("/addresses", addressRouter)
  .use("/restaurants", restaurantRouter);
