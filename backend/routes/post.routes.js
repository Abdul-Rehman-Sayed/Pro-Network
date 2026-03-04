import { Router } from "express";
import {
  activeCheck,
  commentPost,
  createPost,
  deleteCommentOfUser,
  deletePost,
  getAllPosts,
  getCommentsByPost,
  incrementLikes,
} from "../controllers/posts.controller.js";
import multer from "multer";

const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

router.route("/").get(activeCheck);
router.route("/post").post(upload.single("media"), createPost);
router.route("/posts").get(getAllPosts);
router.route("/delete_post").post(deletePost);
router.route("/comment").post(commentPost);
router.route("/get_comments").post(getCommentsByPost);
router.route("/delete_comment").post(deleteCommentOfUser);
router.route("/like_post").post(incrementLikes);

export default router;
