import RefreshToken from "../models/RefreshToken";
import User from "../models/User";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { userRTokenCreds } from "../validations/user.validations";

export const refreshTOkenController = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    const parsedData = userRTokenCreds.parse(req.body);
    const { name, email } = parsedData;

    const isTokenExist = await RefreshToken.findOne({ token: refreshToken });

    const JWT_REFRESHTOKEN = String(process.env.JWT_REFRESHTOKEN);
    const JWT_SECRET = process.env.JWT_SECRET;

    if (
      isTokenExist?.token === null ||
      isTokenExist?.token === undefined ||
      JWT_SECRET === undefined ||
      (name && email === null) ||
      (name && email === undefined)
    ) {
      res
        .status(400)
        .json({ success: false, message: "Please login again", redirect: "/" });
    } else {
      const verifyToken = jwt.verify(isTokenExist?.token, JWT_REFRESHTOKEN);
      if (verifyToken) {
        const token = jwt.sign({ name, email }, JWT_SECRET as string, {
          expiresIn: "1h",
        });
        res
          .status(200)
          .json({ succss: true, message: "Access token updated!", token });
      }
    }
  } catch (error) {
    console.log("Server error while sending access token", error);
  }
};
