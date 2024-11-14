import UserRepository from "../../user/repository";
import nodemailer from "nodemailer";
import { ClientError } from "../../../../libs/handlers/error";
import { ProviderResponse } from "../../../../types";
import validate from "deep-email-validator";
import { OAuth2Client } from "google-auth-library";
import { redisService } from "../../../../utils/caches/redis";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


const userRepository = new UserRepository();

class AuthService {
  register = async ({
    firstname,
    lastname,
    email,
    photoUrl
  }: {
    firstname: string;
    lastname: string;
    email: string;
    photoUrl?: string;
  }): Promise<ProviderResponse> => {
    try {
      let error = null;
      let data = null;
      const existingUser = await userRepository.findOne({ email });
      if (existingUser) {
        error = new ClientError("User already exists");
      } else {
        const isEmailValid = await validate({ email, validateRegex: true });
        if (!isEmailValid) {
          error = new ClientError("Invalid email address");
        } else {
          const createdUser = await userRepository.createOne({
            firstname,
            lastname,
            email,
            photoUrl
          });
          if (!createdUser) {
            error = new ClientError("User could not be created");
          } else {
            data = {
              id: createdUser.id,
              firstname: createdUser.firstname,
              lastname: createdUser.lastname,
              email: createdUser.email,
              photoUrl: createdUser.photoUrl
            };
          }
        }
      }
      return { error, data };
    } catch (error) {
      return { error, data: null };
    }
  };


  verifyGoogleToken = async (token: string): Promise<ProviderResponse> => {
    let error = null;
    let data = null;
    try {
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      if (!payload) {
        error = new ClientError("Unable to verify google token");
      } else {
        data = {
          firstname: payload.given_name,
          lastname: payload.family_name,
          email: payload.email,
          photoUrl: payload.picture
        };
      }
      return { error, data };
    } catch (error) {
      return { error, data };
    }
  };

  loginWithGoogle = async (email: string): Promise<ProviderResponse> => {
    let error = null;
    let data = null;
    try {
      const user = await userRepository.findOne({ email });
      if (!user) {
        error = new ClientError("User does not exist");
        return { error, data };
      }
      data = {
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        photoUrl: user.photoUrl
      };
      return { error, data };
    } catch (error) {
      return { error, data };
    }
  };

  

}

export default AuthService;
