import { AuthRequest } from "../middlewares/AuthMiddleware";
import RefreshToken from "../models/RefreshToken";
import { Request, RequestHandler, Response } from "express";

export const logoutController: RequestHandler<{}, {}, {}> = async (
  req: AuthRequest,
  res
) => {
  try {
    const userId = req.user?.userId;

    await RefreshToken.deleteMany({ user: userId });

    res.json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Logout failed", error: error });
  }
};
