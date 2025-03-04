import express from "express";

const app = express();


app.use(express.json({ limit: "16kb" })); //json upload limit to save server from crash..
app.use(express.urlencoded({ extended: true, limit: "16kb" })); //url data understanding

//routes
//routes import
// import userRouter from "./routes/user.routes.js";
import healthCheckRouter from "./routes/healthcheck.routes.js";

//routes declaration
app.use("/api/v1/healthcheck", healthCheckRouter);
// app.use("/api/v1/users", userRouter);

app.get("/", (req, res) => {
  res.send("hey Server started now testing .... 🍻⏳");
});

export { app };
