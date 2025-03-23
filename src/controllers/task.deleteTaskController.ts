import { Request, RequestHandler, Response } from "express";
import { taskSchema } from "../validations/user.validations";
import User from "../models/User";
import Task from "../models/Task";

interface taskRequestBody {
  taskId: string;
}

export const deleteTaskController: RequestHandler<
  { taskId: string },
  {},
  taskRequestBody
> = async (req, res) => {
  try {
    const { taskId } = req.params;

    if (!taskId) {
      res.status(400).json({ success: false, message: "Task ID is required" });
      return;
    }

    const task = await Task.findByIdAndDelete(taskId);
    res
      .status(200)
      .json({ success: true, message: "Task deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server failed while Deleting the task",
    });
    return;
  }
};
