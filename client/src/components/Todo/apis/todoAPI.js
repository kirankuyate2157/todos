import axios from "axios";

export const createTodo = async (todoData) => {
    try {
        const response = await axios.post('/todo', todoData);
        return response.data;
    } catch (error) {
        throw error?.response?.data?.message || 'Error creating todo';
    }
};

export const getTodos = async ({
    page = 1,
    limit = 10,
    order = "desc",
    tags,
    search = "",
    mentionedUsers,
    all = false,
} = {}) => {
    try {
        const params = {
            page,
            limit,
            order,
            search,
            ...(tags ? { tags: tags.join(",") } : {}),
            ...(mentionedUsers ? { mentionedUsers: mentionedUsers.join(",") } : {}),
            ...(all !== undefined ? { all } : {}),
        };

        const response = await axios.get("/todo", { params });
        return response.data;
    } catch (error) {
        throw error?.response?.data?.message || "Error fetching todos";
    }
};

export const getTodos2 = async () => {
    try {
        const response = await axios.get('/todo');
        return response.data;
    } catch (error) {
        throw error?.response?.data?.message || 'Error fetching todos';
    }
};

export const getTodoById = async (id) => {
    try {
        const response = await axios.get(`/todo/${id}`);
        return response.data;
    } catch (error) {
        throw error?.response?.data?.message || 'Error fetching todo details';
    }
};

export const updateTodo = async (id, todoData) => {
    try {
        const response = await axios.patch(`/todo/${id}`, todoData);
        return response.data;
    } catch (error) {
        throw error?.response?.data?.message || 'Error updating todo';
    }
};

export const deleteTodo = async (id) => {
    try {
        const response = await axios.delete(`/todo/${id}`);
        return response.data;
    } catch (error) {
        throw error?.response?.data?.message || 'Error deleting todo';
    }
};
