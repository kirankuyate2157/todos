import { getTodos } from "@/components/Todo/apis/todoAPI";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


export const fetchTodos = createAsyncThunk(
    "todos/fetchTodos",
    async ({ page = 1, search="",limit = 10, sortBy = "createdAt", order = "desc", tags, mentionedUsers, all } = {}, { rejectWithValue }) => {
        try {
            const params = {
                page,
                limit,
                sortBy,
                order,
                search,
                ...(tags ? { tags: tags.join(",") } : {}), // Convert array to comma-separated string
                ...(mentionedUsers ? { mentionedUsers: mentionedUsers.join(",") } : {}),
                ...(all !== undefined ? { all } : {}),
            };

            const response = await getTodos(params);
            return { ...response.data, params };
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

const initialState = {
    todos: [],
    status: "idle", // "idle" | "loading" | "succeeded" | "failed"
    error: null,
    page: 1,
    totalPages: 1,
    filters: {
        order: "desc",
        tags: [],
        owner: null,
        mentionedUsers: [],
        search:"",
        all: false,
        limit: 10,
    },
};

const todosSlice = createSlice({
    name: "todos",
    initialState,
    reducers: {
        setTodoFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        resetTodoFilters: (state) => {
            state.filters = initialState.filters;
        },
        setPage: (state, page) => {
            state.page = page;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTodos.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(fetchTodos.fulfilled, (state, action) => {


                const list = state.filters?.page < action?.payload?.page
                    ? [...state.todos, ...(action?.payload?.todos || [])]
                    : [...(action?.payload?.todos || [])];

                state.status = "succeeded";
                state.todos = list || [];
                state.page = action.payload.page || 1;
                state.totalPages = action.payload.total_pages || 1;
                state.filters = action?.payload?.params;
            })
            .addCase(fetchTodos.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            });
    },
});

export const { setTodoFilters, resetTodoFilters } = todosSlice.actions;
export default todosSlice.reducer;
