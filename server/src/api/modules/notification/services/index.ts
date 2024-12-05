import { Queue, Worker } from "bullmq";
import dotenv from "dotenv";
dotenv.config();
import logger from "../../../../libs/loggers/winston";
import { redisService } from "../../../../utils/caches/redis";
import { io } from "../../../../app";
import MovieService from "../../movies/services";

export const redisConnection = {
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_SECRET,
  tls: { rejectUnauthorized: false },
};
const movieService = new MovieService();

dotenv.config();

class NotificationService {
  private notificationQueue: Queue;

  constructor() {
    this.notificationQueue = new Queue("notifications", {
      connection: redisConnection,
    });
    this.initializeNotificationWorker();
  }

  async sendNotification(
    notificationTitle: string,
    notificationSubtitle: string,
    notificationBody: string,
    userId: string
  ) {
    try {
      const notificationPayload = {
        userId,
        title: notificationTitle,
        subtitle: notificationSubtitle,
        body: notificationBody,
      };

      io.to(userId).emit("notification", notificationPayload);

      logger.info("Notification sent successfully:", notificationPayload);
    } catch (error) {
      throw new Error("Failed to send notification");
    }
  }

  private async initializeNotificationWorker() {
    new Worker(
      "notifications",
      async (job) => {
        const {
          userId,
          notificationTitle,
          notificationSubtitle,
          notificationBody,
        } = job.data;
        try {
          await this.sendNotification(
            notificationTitle,
            notificationSubtitle,
            notificationBody,
            userId
          );
        } catch (error) {
          console.error("Failed to send notification:", error);
          logger.error("Failed to send notification:", error);
        }
      },
      {
        connection: redisConnection,
      }
    );
  }

  async addNotificationJob(
    userId: string,
    notificationTitle: string,
    notificationSubtitle: string,
    notificationBody: string,
    delay: number
  ) {
    try {
      await this.notificationQueue.add(
        "send-notification",
        {
          userId,
          notificationTitle,
          notificationSubtitle,
          notificationBody,
        },
        { delay }
      );
    } catch (error) {
      throw new Error("Failed to add notification job");
    }
  }

  async setMovieReminder(
    userId: string,
    imdbId: string,
    reminderTime: number
  ) {
    try {
      const reminderTimeInMs = reminderTime * 60 * 1000;
      const { data, error } = await movieService.getMovie(imdbId);
      if (error) {
        throw error;
      }
      if (!data) {
        throw new Error("Movie not found");
      }
      const movie = data;
      const notificationTitle = `Reminder: ${movie.title}`;
      const notificationSubtitle = `Starting in ${reminderTime} minutes`;
      const notificationBody = `Don't forget to watch ${movie.title}!`;
      await this.addNotificationJob(
        userId,
        notificationTitle,
        notificationSubtitle,
        notificationBody,
        reminderTimeInMs
      );
      
    } catch (error) {
      throw new Error("Failed to set movie reminder");
    }
  }
}

export default NotificationService;
