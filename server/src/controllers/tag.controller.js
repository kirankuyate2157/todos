import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Tag } from "../models/tag.model.js";

/*
- get by page & limit list
- return tag list
 */
const getAllTags = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, search = "" } = req.query;
    const query = {};

    if (search.trim()) {
        query.name = { $regex: search, $options: "i" };
    }

    const tags = await Tag.find(query)
        .skip((page - 1) * limit)
        .limit(parseInt(limit));

    const totalTags = await Tag.countDocuments(query);

    return res.status(200).json(new ApiResponse(200, { page, tags, total_pages: totalTags / limit }, "Tags fetched successfully ✅"));
});


/*
- get tag by specific id
- check if not exist throw error else return
*/

const getTagById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const tag = await Tag.findById(id);

    if (!tag) {
        throw new ApiError(404, "Tag not found 🫠");
    }

    return res.status(200).json(new ApiResponse(200, tag, "Tag fetched successfully ✅"));
});


/*
- check validation
-  check if earlier exist if yea then return that existing  tag
-  else create new
*/

const createTag = asyncHandler(async (req, res) => {
    const { name } = req.body;
    if (!name || name.trim() === "") {
        throw new ApiError(400, "Tag name is required 🫠");
    }

    const existingTag = await Tag.findOne({ name });
    if (existingTag) {
        res.status(200).json(new ApiResponse(200, tag = existingTag, "Tag existing tag used successfully ✅"));
        // throw new ApiError(409, "Tag already exists 🫠");
    }

    const tag = await Tag.create({ name });
    return res.status(201).json(new ApiResponse(201, tag, "Tag created successfully ✅"));
});

const updateTag = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    if (!id || id.trim() === "") {
        throw new ApiError(400, "Tag id name is required 🫠");
    }

    if (!name || name.trim() === "") {
        throw new ApiError(400, "Tag name is required 🫠");
    }

    const tag = await Tag.findByIdAndUpdate(id, { name }, { new: true });
    if (!tag) {
        throw new ApiError(404, "Tag not found 🫠");
    }

    return res.status(200).json(new ApiResponse(200, tag, "Tag updated successfully ✅"));
});

/*
check first is that tag us used todo if then do not delete list demo from that todo
*/

const deleteTag = asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Check if the tag is used in any Todo
    const isTagUsed = await Todo.findOne({ tags: id });

    if (isTagUsed) {
        throw new ApiError(400, "Tag is associated with existing Todos and cannot be deleted 🫠");
    }

    const tag = await Tag.findByIdAndDelete(id);

    if (!tag) {
        throw new ApiError(404, "Tag not found 🫠");
    }

    return res.status(200).json(new ApiResponse(200, {}, "Tag deleted successfully ✅"));
});


export { getAllTags, getTagById, createTag, updateTag, deleteTag };
