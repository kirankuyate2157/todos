import { Router } from "express";
import dotenv from "dotenv";
dotenv.config();
import { upload } from "../middlewares/multer.middleware.js";
import { loginUser, registration } from '../controllers/user.controller.js';



const router = Router();

router.route("/register").post(
    upload.fields([
        { name: "avatar", maxCount: 1 },
    ]),
    registration
);

router.route("/login").post(loginUser);

export default router;
