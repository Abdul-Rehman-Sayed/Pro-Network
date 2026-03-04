import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducer/authReducer";
import postReducer from "./reducer/postReducer";

// *** Steps for State Management
// * 1. Submit Action
// * 2. Action is handled by Reducer
// * 3. Reducer updates the state
// * 4. Updated state is reflected in the UI

export const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postReducer,
  },
});
