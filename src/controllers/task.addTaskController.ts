import { Request, RequestHandler, Response } from "express";
import { taskSchema, validateDueDate } from "../validations/user.validations";
import User, { userInterface } from "../models/User";
import Task from "../models/Task";
import { AuthRequest } from "../middlewares/AuthMiddleware";

interface taskRequestBody {
  title: String;
  description: String;
  status?: "PENDING" | "COMPLETED";
  dueDate?: string;
  email: String;
}

export const addTaskController: RequestHandler<
  {},
  {},
  taskRequestBody
> = async (req: AuthRequest, res) => {
  try {
    const parsedData = taskSchema.parse(req.body);
    const { title, description, status, email, dueDate } = parsedData;

    let validDueDate = dueDate ? validateDueDate(dueDate) : null;

    if (!validDueDate) {
      validDueDate = new Date(Date.now() + 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0];
    }

    if (!title || !description) {
      res.status(400).json({
        success: false,
        message: "Kindly enter status and description",
      });
      return;
    }

    const idFromToken = req.user?.userId;
    if (!idFromToken) {
      res.status(401).json({ success: false, message: "Unauthorized user" });
    }
    const user: userInterface | null = await User.findById(idFromToken).lean();
    const userId = user?._id;

    if (!user) {
      res.status(401).json({
        success: false,
        message: "Please Sign-up first",
        redirect: "/signup",
      });
      return;
    }
    if (user.email !== email) {
      res.status(403).json({
        success: false,
        message: "Unauthorized! Cannot create task for another user",
      });
      return;
    }
    const task = await Task.create({
      title,
      description,
      status: status || "PENDING",
      dueDate: new Date(validDueDate),
      user: userId,
    });
    res.status(200).json({ success: true, message: "Task added successfully" });
    return;
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Server failed while adding the task" });
    return;
  }
};
