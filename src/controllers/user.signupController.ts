import { Request, Response, RequestHandler } from "express";
import User from "../models/User";
import bcrypt from "bcryptjs";
import { userSchmaValidation } from "../validations/user.validations";
import jwt from "jsonwebtoken";
import RefreshToken from "../models/RefreshToken";

interface signupRequestBody {
  name: string;
  email: string;
  password: string;
  gender: string;
}

export const signupController: RequestHandler<
  {},
  {},
  signupRequestBody
> = async (req, res) => {
  try {
    const parsedData = userSchmaValidation.parse(req.body);
    const { name, email, password, gender } = parsedData;

    if (!name || !email || !password || !gender) {
      res.status(400).json({
        success: false,
        message: "Please fill all the required fields",
      });
      return;
    }

    const user = await User.findOne({ email }).select("email");
    if (user) {
      res.status(400).json({
        success: false,
        message: "An account already exists with the provided email address",
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 13);
    const JWT_SECRET = process.env.JWT_SECRET as string;
    const JWT_REFRESHTOKEN = process.env.JWT_REFRESHTOKEN;

    const token = jwt.sign({ name, email }, JWT_SECRET as string, {
      expiresIn: "1h",
    });
    const refreshToken = jwt.sign({ name, email }, JWT_REFRESHTOKEN as string, {
      expiresIn: "7d",
    });

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      gender,
      refreshToken,
    });

    const RToken = RefreshToken.create({
      user: newUser,
      token: refreshToken,
    });

    await newUser.save();
    res.status(200).json({
      token,
      refreshToken,
      success: true,
      message: "User created successfully",
      redirect: "/login",
    });
    return;
  } catch (error) {
    res.status(500).json({ success: false, message: error });
    return;
  }
};
