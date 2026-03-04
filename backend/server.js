import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import postRoutes from "./routes/post.routes.js";
import userRoutes from "./routes/user.routes.js";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use(postRoutes);
app.use(userRoutes);
app.use(express.static("uploads"));

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");

    app.listen(8000, () => {
      console.log(`Server running on port 8000`);
    });
  } catch (error) {
    console.log("Error:", error.message);
  }
};

start();
