import { Request, Response, NextFunction } from "express";
import AuthService from "../services";
import axios from "axios";
import { ClientError, ServerError } from "../../../../libs/handlers/error";


const authService = new AuthService();

class AuthController {
  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      req.session.destroy((err) => {
        if (err) {
          throw new ClientError(
            "Unable to logout user: Session destruction error"
          );
        }
      });
      next();
    } catch (error) {
      next(error);
    }
  }

  async googleSignIn(req: Request, res: Response, next: NextFunction) {
    try {
      const googleAuthURL = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.GOOGLE_CALLBACK_URL}&scope=openid%20profile%20email`;
      res.redirect(googleAuthURL);
    } catch (error) {
      next(error);
    }
  }

  async googleCallback(req: Request, res: Response, next: NextFunction) {
    const code = req.query.code as string;
    if (!code)
      res.status(401).json({
        message:
          "Unable to retrieve callback code from Google Provider, please try again.",
      });
    try {
      const { data } = await axios({
        method: "post",
        url: "https://oauth2.googleapis.com/token",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        data: new URLSearchParams({
          code,
          client_id: process.env.GOOGLE_CLIENT_ID!,
          client_secret: process.env.GOOGLE_CLIENT_SECRET!,
          redirect_uri: process.env.GOOGLE_CALLBACK_URL!,
          grant_type: "authorization_code",
        }),
      });

      const idToken = data.id_token as string;
      if (!idToken) {
        res.status(401).json({
          message:
            "Unable to retrieve authentication token from Google Provider, please try again.",
        });
      }
      const user = await authService.verifyGoogleToken(idToken);
      if (user.error) {
        throw user.error;
      }
      const existingUser = await authService.loginWithGoogle(user.data.email);
      if (existingUser.error) {
        if (existingUser.error.message === "User does not exist") {
          const newUser = await authService.register({
            email: user.data.email,
            firstname: user.data.firstname,
            lastname: user.data.lastname,
            photoUrl: user.data.photoUrl
          });
          if (newUser.error) {
            throw newUser.error;
          }
          req["user"] = newUser.data;
          next();
        } else {
          throw existingUser.error;
        }
      }
      req["user"] = existingUser.data;
      next();
    } catch (error) {
      next(error);
    }
  }


}

export default AuthController;
