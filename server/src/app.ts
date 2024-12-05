import express from "express";
import dotenv from "dotenv";
import AppController from "./api/initiators/appController";
import { Server } from "socket.io";
import logger from "./libs/loggers/winston";

// CONFIGURE ENVIRONMENT VARIABLES
dotenv.config();

// Start Application Servers
export const app = express();

const PORT = process.env.PORT as string;
const appController = new AppController(app, PORT);
const httpServer = appController.startApp();
export const io = new Server(httpServer);
const userSockets = new Map();
io.on("connection", (socket) => {
  const { userId } = socket.handshake.query;
  console.log(userId);

  if (userId) {
    userSockets.set(userId, socket.id);
    socket.join(userId);
    console.log(`User ${userId} connected with socket ID ${socket.id}`);
  }

  socket.on("disconnect", () => {
    console.log(`User ${userId} disconnected`);
    userSockets.delete(userId);
  });
});
