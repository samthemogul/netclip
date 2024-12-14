import express, { Response, NextFunction } from "express";
import JwtService from "../../../utils/middlewares/authenticators/jwt";
import AuthController from "./controllers";
import { RequestWithUser } from "../../../types";
import { AuthError } from "../../../libs/handlers/error";
import { User } from "../../../types";

const router = express.Router();
const authController = new AuthController();
const jwtService = new JwtService();

// OAuth Routes
router.get("/google", authController.googleSignIn);
router.get(
  "/google/callback",
  authController.googleCallback,
  jwtService.grantToken,
  jwtService.isLoggedIn,
  (req: RequestWithUser, res, next) => {
    try {
      const user = req.user as User;
      const token = res.locals.token;
      if (!user) {
        throw new AuthError("Unable to login user because user doesn't exist");
      }
      if (!token) {
        throw new AuthError("Unable to login user because token doesn't exist");
      }
      res.cookie("auth_token", token, {
        httpOnly: true,
        secure: false,
        maxAge: 24 * 60 * 60 * 1000, // 1 day expiration
      });
      res.redirect(`https://netclip.onrender.com/?userId=${user.id}&token=${encodeURIComponent(JSON.stringify(token))}`)
    } catch (error) {
      next(error);
    }
  }
);

// Logout
router.get(
  "/logout",
  authController.logout,
  jwtService.invalidateToken,
  (req, res) => {
    res.status(200).json({
      status: "success",
      message: "User logged out successfully",
    });
  }
);

export default router;
