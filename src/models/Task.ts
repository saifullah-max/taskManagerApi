import mongoose, { Document, Schema } from "mongoose";

enum Status {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
}

interface taskInterface {
  user: mongoose.Schema.Types.ObjectId;
  title: string;
  description: string;
  status: Status;
  dueDate: Date;
  createdAt: Date;
}

const taskSchema = new Schema<taskInterface>({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: Object.values(Status),
    default: Status.PENDING,
  },
  dueDate: {
    type: Date,
    default: () => new Date(Date.now() + 24 * 60 * 60 * 1000),
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<taskInterface>("task", taskSchema, "task");
