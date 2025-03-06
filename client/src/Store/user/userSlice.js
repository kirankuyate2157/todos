import { fetchUsers } from "@/components/Auth/utils/authApi";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchCustomersData = createAsyncThunk(
  "user/fetchCustomersData",
  async ({ page = 1, limit = 30, search = "" }) => {
    const params = { page, limit, search };
    const response = await fetchUsers(params);
    return { ...response.data, params };
  }
);
const initialState = {
  user: null,
  users: {
    users: [],
    status: "idle",
    error: null,
    page: 1,
    limit: 20,
    total_pages: 0
  },
  recentParams: {
    search: "",
    status: "",
    page: 1,
    limit: 30,
  },
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {
      const { user } = action.payload;
      state.user = user;
    },
    logout: (state) => {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomersData.pending, (state) => {
        state.users.status = "loading";
        state.users.error = null;
      })
      .addCase(fetchCustomersData.fulfilled, (state, action) => {
        const { page } = action.meta.arg;

        const list =
          state.recentParams?.page < action?.payload?.page
            ? [...state.users.users, ...(action?.payload?.users || [])]
            : [...(action?.payload?.users || [])];

        state.users.status = "succeeded";
        state.customers = list || [];
        state.page = action?.payload?.page || 1;
        state.total_pages = action?.payload?.total_pages || 1;
        state.recentParams = action?.payload?.params;
      })
      .addCase(fetchCustomersData.rejected, (state, action) => {
        state.users.status = "failed";
        state.users.error = action.payload || "Failed to fetch users.";
      });
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
