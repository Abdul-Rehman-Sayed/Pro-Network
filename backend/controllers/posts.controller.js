import User from "./../models/user.model.js";
import Post from "./../models/posts.model.js";
import Comment from "./../models/comments.model.js";

export const activeCheck = async (req, res) => {
  return res.status(200).json({ message: "Running" });
};

export const createPost = async (req, res) => {
  const { token } = req.body;

  try {
    const user = await User.findOne({ token: token });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const post = new Post({
      userId: user._id,
      body: req.body.body,
      media: req.file != undefined ? req.file.filename : "",
      fileType: req.file != undefined ? req.file.mimetype.split("/")[1] : "",
    });

    await post.save();
    return res.status(200).json({ message: "Post created" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate(
      "userId",
      "name username email profilePic",
    );
    return res.json({ posts });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deletePost = async (req, res) => {
  const { token, post_id } = req.body;

  try {
    const user = await User.findOne({ token: token }).select("_id");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const post = await Post.findOne({ _id: post_id });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.userId.toString() !== user._id.toString()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    await Post.deletePost({ _id: post_id });

    return res.json({ message: "Post deleted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const commentPost = async (req, res) => {
  const { token, post_id, commentBody } = req.body;

  try {
    const user = await User.findOne({ token: token }).select("_id");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const post = await Post.findOne({ _id: post_id });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    const comment = new Comment({
      userId: user._id,
      postId: post_id,
      body: commentBody,
    });
    await comment.save();
    return res.status(200).json({ message: "Comment added" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getCommentsByPost = async (req, res) => {
  const { post_id } = req.body;
  try {
    const post = await Post.findOne({ _id: post_id });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    return res.status(200).json({ comments: post.comments });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteCommentOfUser = async (req, res) => {
  const { token, comment_id } = req.body;
  try {
    const user = await User.findOne({ token: token }).select("_id");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const comment = await Comment.findOne({ _id: comment_id });
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    if (comment.userId.toString() !== user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete comment" });
    }
    await Comment.deleteOne({ _id: comment_id });
    return res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const incrementLikes = async (req, res) => {
  const { post_id } = req.body;
  try {
    const post = await Post.findOne({ _id: post_id });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    post.likes += 1;
    await post.save();
    return res.status(200).json({ message: "Post liked" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
