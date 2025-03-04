import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Todo } from "../models/todo.model.js";
import mongoose from "mongoose";

/*
- add filters
- sort by created in desc
- validate ids as well
*/

const getTodos = asyncHandler(async (req, res) => {
    const {
        page = 1,
        limit = 10,
        sortBy = "createdAt",
        order = "desc",
        tags,
        mentionedUsers,
        all,
    } = req.query;

    const userId = req.user._id;
    let filter = {};

    if (!all) {
        filter.user = userId;
    }

    if (tags) {
        const tagIds = tags.split(",").filter(id => mongoose.isValidObjectId(id)).map(id => new mongoose.Types.ObjectId(id));
        if (tagIds.length) {
            filter.tags = { $in: tagIds };
        }
    }

    if (mentionedUsers) {
        const userIds = mentionedUsers.split(",").filter(id => mongoose.isValidObjectId(id)).map(id => new mongoose.Types.ObjectId(id));
        if (userIds.length) {
            filter.mentionedUsers = { $in: userIds };
        }
    }

    const pageNum = isNaN(parseInt(page, 10)) ? 1 : Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));

    const todos = await Todo.find(filter)
        .populate("tags mentionedUsers notes")
        .sort({ [sortBy]: order === "desc" ? -1 : 1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum);

    return res.status(200).json(new ApiResponse(200, todos, "Todos fetched successfully ✅"));
});


const getTodoById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const todo = await Todo.findById(id).populate("tags notes mentionedUsers");
    if (!todo) {
        throw new ApiError(404, "Todo not found 🫠");
    }
    return res.status(200).json(new ApiResponse(200, todo, "Todo fetched successfully ✅"));
});

const createTodo = asyncHandler(async (req, res) => {
    const { title, description, tags, notes, mentionedUsers } = req.body;
    if (!title) {
        throw new ApiError(400, "Title is required 🫠");
    }

    const newTodo = await Todo.create({
        title,
        description,
        tags,
        notes,
        mentionedUsers,
        user: req.user._id,
    });
    return res.status(201).json(new ApiResponse(201, newTodo, "Todo created successfully ✅"));
});

const updateTodo = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updatedTodo = await Todo.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedTodo) {
        throw new ApiError(404, "Todo not found 🫠");
    }
    return res.status(200).json(new ApiResponse(200, updatedTodo, "Todo updated successfully ✅"));
});

/*
- check todo exist
- check owner of todo and can be delete only
*/

const deleteTodo = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user._id;  // Logged-in user ID

    const todo = await Todo.findById(id);
    if (!todo) {
        throw new ApiError(404, "Todo not found 🫠");
    }

    if (todo.user.toString() !== userId.toString()) {
        throw new ApiError(403, "You are not authorized to delete this todo 🫠");
    }

    await todo.deleteOne();

    return res.status(200).json(new ApiResponse(200, null, "Todo deleted successfully ✅"));
});


export { getTodos, getTodoById, createTodo, updateTodo, deleteTodo };
