import express from "express";
import cors from "cors";
import { rateLimit } from "express-rate-limit";
import cookiepParser from "cookie-parser";
import bodyParser from "body-parser";
import helmet from "helmet";
import dotenv from "dotenv";
import Router from "./router";
import { initializeRedis } from "../../utils/caches/redis";
import logger from "../../libs/loggers/winston";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

// CONFIGURE ENVIRONMENT VARIABLES
dotenv.config();

interface IcorsOptions {
  origin: string;
  credentials: boolean;
  methods: string[];
  allowHeaders: string[];
}

class AppController {
  private app: express.Application;
  private port: string;
  private readonly corsOptions: IcorsOptions;

  constructor(app: express.Application, port: string) {
    this.app = app;
    this.port = port;
    this.corsOptions = {
      origin: "*",
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE"],
      allowHeaders: [
        "Content-Type",
        "Authorization",
        "Access-Control-Allow-Credentials",
      ],
    };
  }

  private configureLimiter() {
    this.app.use(
      rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100,
        message: "Too many requests, please try again later",
        statusCode: 429,
        standardHeaders: true,
        legacyHeaders: false,
      })
    );
  }

  private configureRouting() {
    const appRouter = new Router(this.app);
    appRouter.configAuthRoutes();
    appRouter.configUserRoutes()
    appRouter.configErrorHandler();
  }

  // Setup Express Middlewares
  private enableMiddlewares() {
    this.app.use(helmet());
    this.app.use(
      helmet({
        crossOriginResourcePolicy: false,
      })
    );
    this.configureLimiter();
    this.app.use(cookiepParser());
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(cors(this.corsOptions));
  }

  // Connect to Redis data-store
  private setupRedis() {
    initializeRedis();
  }

  // Initialize Application
  public startApp() {
    try {
      this.enableMiddlewares();
      this.configureRouting();
      this.setupRedis();
      this.app.listen(this.port || 4000, () => {
        logger.info(`NetClip Server listening on the port ${this.port}`);
      });
    } catch (error) {
        logger.error(`Ran into some issues while starting the server: ${error}`)
        process.exit(1)
    }
  }
}

export default AppController;
