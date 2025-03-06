import axios from "axios";


export const registerUser = async (userData) => {
    try {
        const response = await axios.post('/users/register', userData);
        return response.data;
    } catch (error) {
        throw error.response.data.message || 'Error registering user';
    }
};
export const registerMember = async (userData) => {
    try {
        const response = await axios.post('/users/register-member', userData);
        return response.data;
    } catch (error) {
        throw error.response.data.message || 'Error registering user';
    }
};

export const loginUser = async (userData) => {
    try {
        const response = await axios.post('/users/login', userData);
        return response.data;
    } catch (error) {
        console.log(error.response.data.message);
        throw error?.response?.data?.message || 'Error logging in user';
    }
};

export const currentUser = async () => {
    try {
        const response = await axios.get('/users/get-current-user');
        return response.data.data;
    } catch (error) {
        throw error.response.data.message || 'Error registering user';
    }
};

export const logOutUser = async () => {
    try {
        const response = await axios.post('/users/logout');
        return response.data;
    } catch (error) {
        throw error.response.data.message || 'Error registering user';
    }
};

export const fetchUsers = async ({ search = "", page = 1, limit = 10 }) => {
    try {
        console.log("st 1.")
        const params = { page, limit };
        if (search.trim()) {
            params.search = search;
        }
        console.log("st 2")
        const response = await axios.get("/users/search", {
            params,
        });
        console.log("🔥🔥🔥✨ : res : ", response.data)
        return response?.data ||[];
    } catch (error) {
        throw error?.response?.data?.message || "Error fetching users";
    }
};


export const fetchUserById = async ({ id }) => {
    try {
        const response = await axios.get(`/users/id/${id}`,
        );
        return response.data;
    } catch (error) {
        throw error?.response?.data?.message || "User not found";
    }
};