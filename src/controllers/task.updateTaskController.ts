import { Request, RequestHandler, Response } from "express";
import { taskSchema } from "../validations/user.validations";
import User from "../models/User";
import Task from "../models/Task";

interface taskRequestBody {
  title: String;
  description: String;
  status: String;
  dueDate: Number;
  email: String;
}

export const updateTaskController: RequestHandler<
  { taskId: string },
  {},
  taskRequestBody
> = async (req, res) => {
  try {
    const { taskId } = req.params;
    const parsedData = taskSchema.parse(req.body);
    const { title, description, status, dueDate, email } = parsedData;

    if (!title || !description) {
      res.status(400).json({
        success: false,
        message: "Kindly enter status and description",
      });
      return;
    }
    const user = await User.findOne({ email });
    const userId = user?._id;

    if (!user) {
      res.status(401).json({
        success: false,
        message: "Please Sign-up first",
        redirect: "/signup",
      });
      return;
    }

    const task = await Task.findOneAndUpdate(
      { _id: taskId },
      {
        $set: {
          title,
          description,
          status,
          dueDate,
          user: userId,
        },
      },
      { new: true }
    );
    res
      .status(200)
      .json({ success: true, message: "Task updated successfully" });
    return;
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        success: false,
        message: "Server failed while updating the task",
      });
    return;
  }
};
