import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Note } from "../models/note.model.js";
import mongoose from "mongoose";

/**
 * Get all notes with optional filters: tags, mentionedUsers, todo, all &  user 
 */
const getNotes = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, tags, mentionedUsers, todo, all = false, user_id="" } = req.query;
    const userId = req.user._id;

    let filter = {};

    if (!all) {
        filter.createdBy = user_id || userId
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

    if (todo && mongoose.isValidObjectId(todo)) {
        filter.todo = new mongoose.Types.ObjectId(todo);
    }

    const notes = await Note.find(filter)
        .populate("todo tags mentionedUsers createdBy")
        .sort({ createdAt: -1 })
        .skip((Math.max(1, parseInt(page, 10)) - 1) * Math.max(1, parseInt(limit, 10)))
        .limit(Math.max(1, parseInt(limit, 10)));

    return res.status(200).json(new ApiResponse(200, notes, "Notes fetched successfully ✅"));
});

/*
 -  Get a single note by ID
 */
const getNoteById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const note = await Note.findById(id).populate("todo tags mentionedUsers createdBy");

    if (!note) {
        throw new ApiError(404, "Note not found 🫠");
    }


    return res.status(200).json(new ApiResponse(200, note, "Note fetched successfully ✅"));
});


// check req validations 

const createNote = asyncHandler(async (req, res) => {
    const { todo, content, tags, mentionedUsers } = req.body;
    if (!content) {
        throw new ApiError(400, "Content is required 🫠");
    }
    if (!todo || !mongoose.isValidObjectId(todo)) {
        throw new ApiError(400, "Valid Todo ID is required 🫠");
    }

    const newNote = await Note.create({
        todo,
        content,
        tags,
        mentionedUsers,
        createdBy: req.user._id,
    });

    return res.status(201).json(new ApiResponse(201, newNote, "Note created successfully ✅"));
});


// - Update a note (only the creator can update)

const updateNote = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const note = await Note.findById(id);

    if (!note) {
        throw new ApiError(404, "Note not found 🫠");
    }

    if (note.createdBy.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to update this note 🚫");
    }

    const updatedNote = await Note.findByIdAndUpdate(id, req.body, { new: true }).populate("todo tags mentionedUsers createdBy");

    return res.status(200).json(new ApiResponse(200, updatedNote, "Note updated successfully ✅"));
});


//  - Delete a note (only the creator can delete)

const deleteNote = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const note = await Note.findById(id);

    if (!note) {
        throw new ApiError(404, "Note not found 🫠");
    }

    if (note.createdBy.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to delete this note 🚫");
    }

    await Note.findByIdAndDelete(id);
    return res.status(200).json(new ApiResponse(200, null, "Note deleted successfully ✅"));
});

export { getNotes, getNoteById, createNote, updateNote, deleteNote };
