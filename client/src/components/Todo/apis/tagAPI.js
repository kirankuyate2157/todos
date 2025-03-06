import axios from "axios";

export const getAllTags = async (search = "", page = 1, limit = 10) => {
    try {
        let url = `/tags/?page=${page}&limit=${limit}`;

        if (search.trim()) {
            url += `&search=${encodeURIComponent(search)}`;
        }
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        throw error?.response?.data?.message || "Error fetching tags";
    }
};


export const getTagById = async (id) => {
    try {
        const response = await axios.get(`/tags/${id}`);
        return response.data;
    } catch (error) {
        throw error?.response?.data?.message || "Error fetching tag details";
    }
};

export const createTag = async (tagData) => {
    try {
        const response = await axios.post("/tags/", tagData);
        return response.data;
    } catch (error) {
        throw error?.response?.data?.message || "Error creating tag";
    }
};

export const updateTag = async (id, tagData) => {
    try {
        const response = await axios.put(`/tags/${id}`, tagData);
        return response.data;
    } catch (error) {
        throw error?.response?.data?.message || "Error updating tag";
    }
};

export const deleteTag = async (id) => {
    try {
        const response = await axios.delete(`/tags/${id}`);
        return response.data;
    } catch (error) {
        throw error?.response?.data?.message || "Error deleting tag";
    }
};
