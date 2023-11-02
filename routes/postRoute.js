const express = require("express");
const router = express.Router();
const {
  createPost,
  showPost,
  showSinglePost,
  deletePost,
  updatePost,
  addComment,
  addLike,
  removeLike,
  fetchPostByKategori,
} = require("../controllers/postController");
const { isAuthenticated, isAdmin } = require("../middleware/auth");
const Post = require("../models/postModel");
const cors = require("cors");

// adoptcat routes for the post
router.post("/post/create", isAuthenticated, isAdmin, createPost);
router.get("/post/show", showPost);
router.get("/post/:id", showSinglePost);
router.delete("/delete/post/:id", isAuthenticated, isAdmin, deletePost);
router.put("/update/post/:id", isAuthenticated, isAdmin, updatePost);
router.put("/comment/post/:id", isAuthenticated, addComment);
router.put("/addlike/post/:id", isAuthenticated, addLike);
router.put("/removelike/post/:id", isAuthenticated, removeLike);
// new route for selecting post by kategori
router.get("/bykategori/:kategoriId", fetchPostByKategori);

module.exports = router;
