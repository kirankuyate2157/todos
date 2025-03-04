import express from "express";
import { getNotes, getNoteById, createNote, updateNote, deleteNote } from "../controllers/note.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", verifyJWT, getNotes);
router.get("/:id", verifyJWT, getNoteById);

router.post("/", verifyJWT, createNote);
router.put("/:id", verifyJWT, updateNote);

router.delete("/:id", verifyJWT, deleteNote);

export default router;
