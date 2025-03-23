import mongoose, { Document, Schema } from "mongoose";

interface RTokenInterface {
  user: mongoose.Schema.Types.ObjectId;
  token: string;
  expiry: string;
}

const RTokenSchema = new Schema<RTokenInterface>({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  expiry: {
    type: String,
    required: true,
    default: "7d",
  },
});

export default mongoose.model<RTokenInterface>(
  "refreshToken",
  RTokenSchema,
  "refreshToken"
);
