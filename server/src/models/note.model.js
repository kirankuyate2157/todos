import mongoose from 'mongoose'

const noteSchema = new mongoose.Schema({
    todo: { type: mongoose.Schema.Types.ObjectId, ref: "Todo", required: true },
    content: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    mentionedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tag" }],
}, { timestamps: true });

export const Note = mongoose.model("Note", noteSchema);