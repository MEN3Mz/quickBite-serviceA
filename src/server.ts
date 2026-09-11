import http from "http";
import express from "express";
import "reflect-metadata";
import { createApp } from "./app.ts";
import { env } from "./common/config/env.ts";
import { db } from "./common/db/knex.ts";
const app = createApp();
const server = http.createServer(app);

server.listen(env.port, () => {
  console.log(`Server is running on port ${env.port}`);
});

async function shutdown() {
  server.close(async () => {
    console.log("Server closed");
    await db.destroy();
    process.exit(0);
  });
}

process.on("SIGINT", shutdown); // CTRL+C if rescived signal to terminate the process, it will call the shutdown function to close the server and destroy the database connection.
process.on("SIGTERM", shutdown); //DOCKER  if rescived signal to terminate the process, it will call the shutdown function to close the server and destroy the database connection.
