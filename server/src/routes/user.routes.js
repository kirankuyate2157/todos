import { Router } from "express";
import dotenv from "dotenv";
dotenv.config();
import { upload } from "../middlewares/multer.middleware.js";
import { getCurrentUser, loginUser, logoutUser, registration, updateAccountDetails, updateUserAvatar } from '../controllers/user.controller.js';
import { verifyJWT } from "../middlewares/auth.middleware.js";



const router = Router();

router.route("/register").post(
    upload.fields([
        { name: "avatar", maxCount: 1 },
    ]),
    registration
);

router.route("/login").post(loginUser);
router.route("/get-current-user").get(verifyJWT, getCurrentUser);
router.route("/update-account").patch(verifyJWT, updateAccountDetails);
router.route("/logout").post(verifyJWT,logoutUser);
router
  .route("/avatar")
  .patch(verifyJWT, upload.single("avatar"), updateUserAvatar);

export default router;
