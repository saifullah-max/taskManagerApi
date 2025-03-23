import { RequestHandler } from "express";
import User from "../models/User";
import { userLoginValidation } from "../validations/user.validations";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

interface loginRequestBody {
  email: string;
  password: string;
}

export const loginController: RequestHandler<{}, {}, loginRequestBody> = async (
  req,
  res
) => {
  try {
    const parsedData = userLoginValidation.parse(req.body);
    const { email, password } = parsedData;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({
        success: false,
        message: "Account not found, Please sign up first!",
        redirect: "/signup",
      });
      return;
    }

    if (!email || !password) {
      res
        .status(400)
        .json({ success: false, message: "Please fill all the fields" });
      return;
    }

    const name = user.name;
    const userId = user._id;
    const JWT_SECRET = process.env.JWT_SECRET as string;
    const JWT_REFRESHTOKEN = process.env.JWT_REFRESHTOKEN;

    const token = jwt.sign({ name, email, userId }, JWT_SECRET, {
      expiresIn: "1hr",
    });

    const refreshToken = jwt.sign(
      { name, email, userId },
      JWT_REFRESHTOKEN as string,
      {
        expiresIn: "7d",
      }
    );

    if (user) {
      const verifyPassword = await bcrypt.compare(password, user.password);
      if (verifyPassword === false) {
        res.status(401).json({
          success: false,
          message: "Incorrect Password, try again with the correct one!",
        });
        return;
      } else {
        res.status(200).json({
          success: true,
          message: "Logged in Successfully",
          redirect: "/",
          token,
          refreshToken,
        });
        return;
      }
    }
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: `Server failed: ${error}` });
  }
};
