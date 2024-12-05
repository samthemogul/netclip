import { Request, Response, NextFunction } from "express";
import UserService from "../services";

const userService = new UserService();

class UserController {
  async getUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const { error, data } = await userService.fetchUser(userId);
      if (error) {
        next(error);
      } else {
        res.status(200).json({ success: true, data });
      }
    } catch (error) {
      next(error);
    }
  }
  async getStreak(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.userId;
      const { data, error } = await userService.getStreak(userId);
      if (error) {
        next(error);
      } else {
        res.status(200).json({ success: true, data });
      }
    } catch (error) {
      next(error);
    }
  }
  async updateLastWatch(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.params.userId;
      const { data, error } = await userService.updateLastWatch(userId);
        if (error) {
            next(error);
        } else {
            res.status(200).json({ success: true, data });
        }
    } catch (error) {
      next(error);
    }
  }
}

export default UserController;
