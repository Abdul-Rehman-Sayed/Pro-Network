import { clientServer } from "@/config";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getAllPosts = createAsyncThunk(
  "posts/getAllPosts",
  async (_, thunkAPI) => {
    try {
      const response = await clientServer.get("/posts");
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const createPost = createAsyncThunk(
  "posts/createPost",
  async (userData, thunkAPI) => {
    const { file, body } = userData;
    try {
      const formData = new FormData();
      formData.append("token", localStorage.getItem("token"));
      formData.append("body", body);
      formData.append("media", file);
      const response = await clientServer.post("/post", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.status === 200) {
        return thunkAPI.fulfillWithValue("Post Uploaded");
      } else {
        return thunkAPI.rejectWithValue("Failed to upload post");
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const deletePost = createAsyncThunk(
  "posts/deletePost",
  async (postId, thunkAPI) => {
    try {
      const response = await clientServer.post("/delete_post", {
        token: localStorage.getItem("token"),
        post_id: postId,
      });
      return thunkAPI.fulfillWithValue("Post Deleted");
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const incrementPostLike = createAsyncThunk(
  "post/incrementLike",
  async ({ post_id }, thunkAPI) => {
    try {
      const response = await clientServer.post("/increment_post_like", {
        post_id,
      });
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const getAllComments = createAsyncThunk(
  "post/getAllComments",
  async (postData, thunkAPI) => {
    try {
      const response = await clientServer.get("/get_comments", {
        params: {
          post_id: postData.post_id,
        },
      });

      return thunkAPI.fulfillWithValue({
        comments: response.data,
        post_id: postData.post_id,
      });
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const postComment = createAsyncThunk(
  "post/postComment",
  async (commentData, thunkAPI) => {
    try {
      const response = await clientServer.post("/comment", {
        token: localStorage.getItem("token"),
        post_id: commentData.post_id,
        commentBody: commentData.body,
      });
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);
