import express from "express";
import { errorHandler } from "./middlewares/errorHandler.js";
import cookieParser from "cookie-parser"
const app = express();
import cors from "cors";

app.use(express.json({ limit: "16kb" })); //json upload limit to save server from crash..
app.use(express.urlencoded({ extended: true, limit: "16kb" })); //url data understanding
app.use(cookieParser()); // for cookies set & clear & get 

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
//routes
//routes import
import userRouter from "./routes/user.routes.js";
import todoRouter from "./routes/todo.routes.js";
import tagRouter from "./routes/tag.routes.js";
import noteRouter from "./routes/note.routes.js";
import healthCheckRouter from "./routes/healthcheck.routes.js";


//routes declaration
app.use("/api/v1/healthcheck", healthCheckRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/todo", todoRouter);
app.use("/api/v1/tags", tagRouter);
app.use("/api/v1/notes", noteRouter);
app.get("/", (req, res) => {
  res.send("hey Server started now testing .... 🍻⏳");
});

app.use(errorHandler)
export { app };
