import mongoose from 'mongoose'

const todoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    image: { type: String },
    priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
    isCompleted: { type: Boolean, default: false },

    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    mentionedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    notes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Note" }],
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tag" }],
}, { timestamps: true });

export const Todo = mongoose.model("Todo", todoSchema);