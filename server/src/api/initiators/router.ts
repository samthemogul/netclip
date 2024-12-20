import express from "express";
import JwtService, { IJwt } from "../../utils/middlewares/authenticators/jwt";
import { ClientError, errorHandler } from "../../libs/handlers/error";
import authRoutes from "../modules/auth/routes"
import userRoutes from "../modules/user/routes"
import movieRoutes from "../modules/movies/routes"
import watchlistRoutes from "../modules/watchlist/routes"
import watchHistoryRoutes from "../modules/watchlist/history.routes"
import notificationRoutes from "../modules/notification/routes"

class Router {
  private app: express.Application;
  private jwtService: IJwt;

  constructor(app: express.Application) {
    this.app = app;
    this.jwtService = new JwtService();
  }
  public configAuthRoutes() {
    this.app.use("/api/auth", authRoutes);
  }
  public configUserRoutes() {
    this.app.use("/api/users", this.jwtService.verifyToken, userRoutes);
  }
  public configMovieRoutes() {
    this.app.use("/api/movies", this.jwtService.verifyToken, movieRoutes);
  }
  public configWatchlistRoutes() {
    this.app.use("/api/watchlist", this.jwtService.verifyToken, watchlistRoutes);
  }
  public configWatchHistoryRoutes() {
    this.app.use("/api/history", this.jwtService.verifyToken, watchHistoryRoutes);
  }
  public configNotificationroutes() {
    this.app.use("/api/notifications", this.jwtService.verifyToken, notificationRoutes);
  }
  public configErrorHandler() {
    this.app.use((req, res, next) => {
      const error = new ClientError("Route not found");
      next(error);
    });
    this.app.use(errorHandler);
  }
}

export default Router;
