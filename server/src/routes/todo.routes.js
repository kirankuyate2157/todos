import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getTodos, getTodoById, createTodo, updateTodo, deleteTodo } from "../controllers/todo.controller.js";

const router = Router();

router.route("/")
    .get(verifyJWT, getTodos)
    .post(verifyJWT, createTodo);

router.route("/:id")
    .get( getTodoById)
    .patch(verifyJWT, updateTodo)
    .delete(verifyJWT, deleteTodo);

export default router;
