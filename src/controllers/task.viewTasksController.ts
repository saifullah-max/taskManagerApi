import { Request, RequestHandler, Response } from "express";
import User from "../models/User";
import Task from "../models/Task";
import { validateDueDate } from "../validations/user.validations";
import { AuthRequest } from "../middlewares/AuthMiddleware";

interface taskRequestBody {
  email: string;
}

export const viewTasksController: RequestHandler<
  {},
  {},
  taskRequestBody,
  {
    status?: string;
    dueDate?: string;
    priority?: string;
    CreatedAt?: string;
    limit?: string;
  }
> = async (req: AuthRequest, res) => {
  try {
    const { email } = req.body;
    console.log("Req body", req.body);
    console.log("Req user", req.user?.userId);
    const { status, dueDate, priority, CreatedAt, limit = 5 } = req.query;

    // Validate dueDate only if it's provided
    let validDueDate: string | null = null;
    if (dueDate !== undefined) {
      validDueDate = validateDueDate(dueDate as string) ?? null;
      if (!validDueDate) {
        res.status(400).json({ message: "Invalid date format" });
        return;
      }
    }

    // Check user existence
    const user = await User.findById(req.user?.userId);
    if (!user) {
      console.log("User not found for email:", email);
      res
        .status(401)
        .json({ success: false, message: "Please login/signup first" });
      return;
    }

    if (user.role === "ADMIN") {
      const allUsers = await Task.find()
        .lean()
        .sort({ createdAt: -1 })
        .limit(Number(limit));
      res.status(200).json({ message: "All tasks fetched!", allUsers });
      return;
    }

    let query: any = { user: req.user?.userId };
    if (validDueDate) {
      const parsedDate = new Date(`${validDueDate}T00:00:00.000Z`);
      console.log("Parsed DueDate: ", parsedDate.toISOString());

      if (isNaN(parsedDate.getTime())) {
        res.status(400).json({ message: "Invalid date value" });
        return;
      }

      query.dueDate = {
        $gte: new Date(parsedDate.setUTCHours(0, 0, 0, 0)),
        $lte: new Date(parsedDate.setUTCHours(23, 59, 59, 999)),
      };
    }

    if (
      typeof CreatedAt === "string" &&
      !isNaN(new Date(CreatedAt).getTime())
    ) {
      query.createdAt = { $lt: new Date(CreatedAt) };
    }

    // If status provided, add to query
    if (typeof status === "string") {
      query.status = status.toUpperCase();
    }

    console.log("Final MongoDB Query:", JSON.stringify(query, null, 2));

    const tasksExist = await Task.findOne({ userId: req.user?.userId });
    console.log("Tasks exist for user:", tasksExist);

    const userId = req.user!.userId;
    let tasks = await Task.find({ ...query, user: userId })
      .lean()
      .sort({ createdAt: -1 })
      .limit(Number(limit));

    console.log("userId", userId);
    const newCursor =
      tasks.length > 0 ? tasks[tasks.length - 1].createdAt : null;

    const applyPriority = tasks.map((task) => {
      const taskDueDate = new Date(task.dueDate);
      const now = new Date();

      const timeRem = taskDueDate.getTime() - now.getTime();
      let computedPriority: string = "LOW";

      if (taskDueDate < now) {
        computedPriority = "HIGH";
      } else if (
        taskDueDate.getTime() - now.getTime() <=
        3 * 24 * 60 * 60 * 1000
      ) {
        computedPriority = "MEDIUM";
      }

      return { ...task, priority: computedPriority };
    });

    let taskWithPriority = applyPriority;

    let prioritySort = { HIGH: 1, MEDIUM: 2, LOW: 3 };

    if (priority) {
      console.log(
        "Before sorting:",
        taskWithPriority.map((t) => t.priority)
      );
      taskWithPriority = taskWithPriority.sort(
        (a, b) =>
          (prioritySort[b.priority as keyof typeof prioritySort] ?? 999) -
          (prioritySort[a.priority as keyof typeof prioritySort] ?? 999)
      );

      if (typeof priority === "string") {
        if (
          taskWithPriority.some(
            (task) => task.priority === priority.toUpperCase()
          )
        ) {
          taskWithPriority = taskWithPriority.filter(
            (task) => task.priority === priority.toUpperCase()
          );
        }
      }
    }
    res.status(200).json({
      success: true,
      message: "Tasks fetched",
      taskWithPriority,
      nextCursor: newCursor,
    });
    return;
  } catch (error) {
    console.error("Error while fetching tasks:", error);
    res.status(500).json({ success: false, message: "Failed to fetch tasks" });
    return;
  }
};
