import { ServerError } from "../../../../libs/handlers/error";
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
}

export default UserService;
