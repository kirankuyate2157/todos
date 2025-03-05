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
