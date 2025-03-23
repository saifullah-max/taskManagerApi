import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: { userId: string };
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("Authorization");

  if (!token) {
    res.status(401).json({ success: false, message: "Unauthorized access" });
    return;
  }

  try {
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    req.user = decoded; // Attach user to request
    console.log("Decoded Token:", decoded);

    next(); // Move to the next middleware/controller
  } catch (error) {
    res
      .status(403)
      .json({ success: false, message: "Invalid or expired token" });
    return;
  }
};
