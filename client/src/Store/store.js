// src/store/store.js
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice.js";
import todosReducer from "./todos/todosSlice.js";
const store = configureStore({
  reducer: {
    user: userReducer,
    todos:todosReducer,
  },
});

export default store;
