import { Request, Response, NextFunction } from "express";
import NotificationService from "../services";

const notificationService = new NotificationService();

class NotificationsController {
  async setMovieReminder(req: Request, res: Response, next: NextFunction) {
    try {
      const { imdbId } = req.params;
      const { userId, time } = req.body;
      await notificationService.setMovieReminder(userId, imdbId, time);
      res
        .status(200)
        .json({ success: true, message: "Movie reminder set successfully" });
    } catch (error) {
      next(error);
    }
  }
}

export default NotificationsController;
