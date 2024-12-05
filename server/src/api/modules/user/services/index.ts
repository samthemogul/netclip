import { ClientError, ServerError } from "../../../../libs/handlers/error";
import logger from "../../../../libs/loggers/winston";
import { ProviderResponse } from "../../../../types";
import UserRepository from "../repository";

const userRepository = new UserRepository();

class UserService {
  async fetchUser(id: string): Promise<ProviderResponse> {
    try {
      let error = null;
      let data = null;
      const user = await userRepository.findById(id);
      if (!user) {
        error = new ServerError("User not found");
        return { error, data };
      } else {
        data = user;
        return { error, data };
      }
    } catch (error) {
      return { error, data: null };
    }
  }

  async getStreak(userId: string) {
    try {
      let data = null;
      let error = null;
      const user = await userRepository.findById(userId);
      if (!user) {
        error = new ClientError("User not found");
        return { data, error };
      }
      const lastWatchDate = new Date(user.lastWatch).getTime();
      const currentDate = new Date().getTime();
      const diff = currentDate - lastWatchDate;
      if (diff > 24 * 60 * 60 * 1000) {
        await userRepository.updateStreak(user.id, 0);
        data = 0;
      } else {
        data = user.streakCount;
      }
      return { data, error };
    } catch (error) {
      logger.error("Failed to get user streak", error);
      return { data: null, error };
    }
  }

  async monitorStreak(userId: string) {
    try {
      const user = await userRepository.findById(userId);
      if (!user) {
        throw new ClientError("User not found");
      }
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);
      yesterday.setHours(0, 0, 0, 0);

      const lastWatchDate = new Date(user.lastWatch);

      if (lastWatchDate.getTime() === yesterday.getTime()) {
        const newStreak = user.streakCount + 1;
        await userRepository.updateStreak(user.id, newStreak);
      } else {
        await userRepository.updateStreak(user.id, 0);
      }
    } catch (error) {
      logger.error("Failed to monitor user streak", error);
    }
  }

  async updateLastWatch(userId: string) {
    try {
      let data = null;
      let error = null;
      const user = await userRepository.findById(userId);
      if (!user) {
        error = new ClientError("User not found");
        return { data, error };
      }
      const updatedUser = await userRepository.updateLastWatch(userId);
      if (!updatedUser) {
        error = new ClientError("Failed to update user last watch date");
      }
      return { data: updatedUser, error: null };
    } catch (error) {
      logger.error("Failed to update last watch date", error);
      return { data: null, error };
    }
  }
}

export default UserService;
