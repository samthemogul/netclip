import express, { Response, NextFunction } from "express";
import JwtService from "../../../utils/middlewares/authenticators/jwt";
import AuthController from "./controllers";
import { RequestWithUser } from "../../../types";
import { AuthError } from "../../../libs/handlers/error";

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
      const user = req.user;
      if (!user) {
        throw new AuthError("Unable to login user because user doesn't exist");
      }
      res.status(200).json({
        status: "success",
        data: user,
        messsage: "User authentication successful",
      });
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
