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
        priority = [],
        isCompleted = null,
        tags,
        mentionedUsers,
        all,
    } = req.query;
    const search = req.query.search ? req.query.search.trim() : "";
    const userId = req.user._id;
    let filter = {};

    if (!all) {
        filter.user = userId;
    }

    if (priority?.length) {
        const priorityArray = Array.isArray(priority) ? priority : priority.split(",");
        filter.priority = { $in: priorityArray };
    }


    if (isCompleted !== null) {
        filter.isCompleted = isCompleted === "true";
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
    if (search.trim()) {
        filter.$or = [
            { title: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
        ];
    }

    const pageNum = isNaN(parseInt(page, 10)) ? 1 : Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));

    const todos = await Todo.find(filter)
        .populate("tags notes")
        .populate({
            path: "mentionedUsers",
            select: "username fullName _id avatar",
        })
        .sort({ [sortBy]: order === "desc" ? -1 : 1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum);
    const totalTodos = await Todo.countDocuments(filter);

    return res.status(200).json(new ApiResponse(200, { page, todos, total_pages: Math.ceil(totalTodos / limit) }, "Todos fetched successfully ✅"));
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
    let { title, description, tags, mentionedUsers } = req.body;
    if (!title) {
        throw new ApiError(400, "Title is required 🫠");
    }

    if (mentionedUsers) {
        const userIds = mentionedUsers.filter(id => mongoose.isValidObjectId(id)).map(id => new mongoose.Types.ObjectId(id));
        mentionedUsers = userIds;
    }

    const newTodo = await Todo.create({
        title,
        description,
        tags,
        mentionedUsers,
        user: req.user._id,
    });
    return res.status(201).json(new ApiResponse(201, newTodo, "Todo created successfully ✅"));
});


const updateTodo = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user._id;
    const { title, description, priority, isCompleted, tags, mentionedUsers, notes } = req.body;

    if (!mongoose.isValidObjectId(id)) {
        throw new ApiError(400, "Invalid Todo ID provided ");
    }

    const todo = await Todo.findById(id);
    if (!todo) {
        throw new ApiError(404, "Todo not found 🫠");
    }

    if (todo.user.toString() !== userId.toString()) {
        throw new ApiError(403, "You are not authorized to update this todo 🫠");
    }

    const allowedUpdates = {};
    if (title) allowedUpdates.title = title;
    if (description) allowedUpdates.description = description;
    if (priority) allowedUpdates.priority = priority;
    if (typeof isCompleted === "boolean") allowedUpdates.isCompleted = isCompleted;
    if (tags) {
        const tagIds = tags.filter(id => mongoose.isValidObjectId(id)).map(id => new mongoose.Types.ObjectId(id));
        allowedUpdates.tags = tagIds;
    }

    if (mentionedUsers) {
        const userIds = mentionedUsers.filter(id => mongoose.isValidObjectId(id)).map(id => new mongoose.Types.ObjectId(id));
        allowedUpdates.mentionedUsers = userIds;
    }
    if (notes) {
        const noteIds = notes.filter(id => mongoose.isValidObjectId(id)).map(id => new mongoose.Types.ObjectId(id));
        allowedUpdates.notes = noteIds;
    }

    // Update Todo
    const updatedTodo = await Todo.findByIdAndUpdate(id, allowedUpdates, { new: true }).populate("tags notes mentionedUsers");

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
