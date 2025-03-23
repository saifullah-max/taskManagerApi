import dotenv from "dotenv";
import express, { Request, Response } from "express";
import { connectToDB } from "./config/DB.config";
import userRouter from "./routes/user.routes";
import taskRouter from "./routes/task.route";
import cors from "cors";
import { errorLogger, httpLogger } from "./middlewares/LoggerMiddleware";

dotenv.config();
const PORT = process.env.PORT;
connectToDB();
const app = express();

app.use(httpLogger);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send("Test route");
});

app.use("/", userRouter);
app.use("/task", taskRouter);

app.use(errorLogger);
app.listen(PORT, () => {
  console.log(`Server started at PORT ${PORT}`);
});
