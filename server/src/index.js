import 'module-alias/register.js';
import express from "express";
import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});

import { app } from './app.js';
import connectDB from "./db/mongoDB.js";

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  connectDB();
  console.log(`Server is listening on port http://localhost:${PORT} 🏃🏻💨 🚀`);
});
