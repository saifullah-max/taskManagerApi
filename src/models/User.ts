import mongoose, { Document, Schema } from "mongoose";

export enum userGender {
  male = "MALE",
  female = "FEMALE",
}

export enum userRole {
  user = "USER",
  admin = "ADMIN",
}

export interface userInterface extends Document {
  name: string;
  email: string;
  password: string;
  gender: userGender;
  role: userRole;
  refreshToken: string;
}

const userSchema = new Schema<userInterface>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: Object.values(userGender),
    },
    role: {
      type: String,
      enum: Object.values(userRole),
      default: userRole.user,
    },
    refreshToken: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model<userInterface>("user", userSchema, "user");
