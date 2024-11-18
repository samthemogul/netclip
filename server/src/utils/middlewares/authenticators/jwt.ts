import jwt from "jsonwebtoken";
import { Response, NextFunction } from "express";
import { AuthError } from "../../../libs/handlers/error";
import { ControllerFunction, RequestWithUser } from "../../../types";
import { redisService } from "../../caches/redis";

export interface IJwt {
  grantToken: ControllerFunction;
  verifyToken: ControllerFunction;
}

class JwtService implements IJwt {
  // CREATE TOKEN
  public grantToken: ControllerFunction = (req, res, next) => {
    try {
      const user = req.user;
      if (user) {
        const token = jwt.sign({ user: user }, process.env.SESSION_SECRET, { expiresIn: "24h" });
        res.locals.token = token;
        next();
      } else {
        throw new AuthError(
          "Unable to authorize user by JSON token, make sure user is logged in."
        );
      }
    } catch (error) {
      next(error);
    }
  };

  // VERIFY TOKEN
  public verifyToken: ControllerFunction = (
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const token = req.headers.authorization?.split(" ")[1].slice(1, -1);
      if (token) {
        this.checkBlacklist(token).then((tkn) => {
          if (tkn) {
            throw new AuthError("Token is blacklisted");
          } else {
            const decoded = jwt.verify(token, process.env.SESSION_SECRET);
            req.user = decoded;
            next();
          }
        });
      } else {
        throw new AuthError("No token provided");
      }
    } catch (error) {
      next(error);
    }
  };

  // CHECK USER OBJECT IN REQUEST
  public isLoggedIn = (
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (req.user) {
        next();
      } else {
        throw new AuthError("User is not logged in");
      }
    } catch (error) {
      next(error);
    }
  };

  // CHECK TOKEN BLACKLIST
  private checkBlacklist(token: string) {
    const result = redisService.get(token);
    return result;
  }

  //  INVALIDATE TOKEN
  public async invalidateToken(
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        throw new AuthError(
          "Unable to authorize user: User not currently logged in."
        );
      }
      const result = await redisService.set(token, "blacklisted");
      if (result) {
        req.user = null;
        next();
      } else {
        throw new AuthError(
          "Could not log user out: Unable to invalidate token"
        );
      }
    } catch (error) {
      next(error);
    }
  }
}

export default JwtService;
