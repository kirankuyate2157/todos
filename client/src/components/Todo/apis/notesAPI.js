import axios from "axios";

const API_URL = "/notes"; // Base API URL for notes

export const fetchNotes = async ({ page = 1, limit = 10, tags, mentionedUsers, todo, all = false, user_id = "" }) => {
    try {
        const params = { page, limit, all };
        if (user_id) params.user_id = user_id;
        if (tags) params.tags = tags;
        if (mentionedUsers) params.mentionedUsers = mentionedUsers;
        if (todo) params.todo = todo;

        const response = await axios.get(API_URL, { params, withCredentials: true });
        return response.data;
    } catch (error) {
        throw error?.response?.data?.message || "Error fetching notes";
    }
};


export const fetchNoteById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        throw error?.response?.data?.message || "Error fetching note";
    }
};

export const createNote = async (noteData) => {
    try {
        const response = await axios.post(API_URL, noteData);
        return response.data;
    } catch (error) {
        throw error?.response?.data?.message || "Error creating note";
    }
};


export const updateNote = async (id, updatedData) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, updatedData);
        return response.data;
    } catch (error) {
        throw error?.response?.data?.message || "Error updating note";
    }
};


export const deleteNote = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        throw error?.response?.data?.message || "Error deleting note";
    }
};
