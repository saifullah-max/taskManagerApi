import morgan from "morgan";
import logger from "../utils/Logger";
import { Request, Response, NextFunction } from "express";

const stream = { write: (message: string) => logger.info(message.trim()) };

const httpLogger = morgan(
  process.env.NODE_ENV === "production" ? "combined" : "dev",
  { stream }
);

const errorLogger = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error(`[${req.method}] ${req.url} - ${err.message}`);

  res.status(500).json({ success: false, message: "internal server error" });
};

export { httpLogger, errorLogger };
