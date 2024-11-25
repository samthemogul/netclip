import jwt from "jsonwebtoken";
import { IUser } from "./user";
import { TopMovie } from "./movie";

declare global {
  namespace NodeJs {
    interface ProcessEnv {
      NODE_ENV: "development" | "production";
    }
  }
}

// Express
import { Request, Response, NextFunction } from "express";

interface User {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  photoUrl: string;
}

export interface RequestWithUser extends Request {
  user?: User | string | jwt.JwtPayload;
  fieldValidationError?: string;
}

export type ControllerFunction = (
  req: RequestWithUser,
  res: Response,
  next?: NextFunction
) => Promise<void> | void;

export interface IResponseBody {
  message: string;
  success: boolean;
  data?: any;
}

export interface ProviderResponse {
  error: Error | null;
  data: any;
}

export { IUser, User };
