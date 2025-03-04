import mongoose from 'mongoose'

const tagSchema = new mongoose.Schema({
    name: { type: String, unique: true, required: true },
}, { timestamps: true });

export const Tag = mongoose.model("Tag", tagSchema);
