import express from "express";
import { addTaskController } from "../controllers/task.addTaskController";
import { authMiddleware } from "../middlewares/AuthMiddleware";
import { viewTasksController } from "../controllers/task.viewTasksController";
import { updateTaskController } from "../controllers/task.updateTaskController";
import { deleteTaskController } from "../controllers/task.deleteTaskController";

const router = express.Router();

router.post("/add", authMiddleware, addTaskController);
router.get("/view", authMiddleware, viewTasksController);
router.patch("/update/:taskId", authMiddleware, updateTaskController);
router.put("/delete/:taskId", authMiddleware, deleteTaskController)
export default router;
