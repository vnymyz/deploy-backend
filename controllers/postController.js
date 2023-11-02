const cloudinary = require("../utils/cloudinary");
const Post = require("../models/postModel");
const Kategori = require("../models/kategoriModel");
const ErrorResponse = require("../utils/errorResponse");
const main = require("../app");

// everytime you make an exports you have to import in postRoute
// create post with the controller name
exports.createPost = async (req, res, next) => {
  const { title, content, postedBy, image, kategoriId, likes, comments } =
    req.body;

  try {
    const kategori = await Kategori.findById(kategoriId);
    if (!kategori) {
      return res.status(400).json({
        success: false,
        error: "Kategori not found",
      });
    }
  } catch (error) {
    next(error);
  }

  try {
    // upload image in cloudinary
    const result = await cloudinary.uploader.upload(image, {
      folder: "posts",
      width: 1200,
      crop: "scale",
    });

    const post = await Post.create({
      title,
      content,
      postedBy: req.user._id,
      image: {
        public_id: result.public_id,
        url: result.secure_url,
      },
      kategoriId,
    });

    res.status(201).json({
      success: true,
      post,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// show all the post
exports.showPost = async (req, res, next) => {
  try {
    // show post and sort by last created
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("postedBy", "name");
    res.status(201).json({
      success: true,
      posts,
    });
  } catch (error) {
    next(error);
  }
};

// show single post
exports.showSinglePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).populate(
      "comments.postedBy",
      "name"
    );
    res.status(200).json({
      success: true,
      post,
    });
  } catch (error) {
    next(error);
  }
};

// delete post
exports.deletePost = async (req, res, next) => {
  const currentPost = await Post.findById(req.params.id);

  //   delete post image in cloudinary
  const ImgId = currentPost.image.public_id;
  if (ImgId) {
    await cloudinary.uploader.destroy(ImgId);
  }

  try {
    const post = await Post.findByIdAndRemove(req.params.id);
    res.status(200).json({
      success: true,
      message: "Data telah dihapus !",
    });
  } catch (error) {
    next(error);
  }
};

// update or edit post
exports.updatePost = async (req, res, next) => {
  try {
    const { title, content, image, kategoriId } = req.body;
    const currentPost = await Post.findById(req.params.id);

    // build object data
    const data = {
      title: title || currentPost.title,
      content: content || currentPost.content,
      image: image || currentPost.image,
      kategoriId: kategoriId || currentPost.kategoriId,
    };

    // modify post image conditionally
    if (req.body.image !== "") {
      const ImgId = currentPost.image.public_id;
      if (ImgId) {
        await cloudinary.uploader.destroy(ImgId);
      }

      //   if you want to upload a new image
      const newImage = await cloudinary.uploader.upload(req.body.image, {
        folder: "posts",
        width: 1200,
        crop: "scale",
      });

      data.image = {
        public_id: newImage.public_id,
        url: newImage.secure_url,
      };
    }

    const postUpdate = await Post.findByIdAndUpdate(req.params.id, data, {
      new: true,
    });

    res.status(200).json({
      success: true,
      postUpdate,
    });
  } catch (error) {
    next(error);
  }
};

// add comment
exports.addComment = async (req, res, next) => {
  const { comment } = req.body;
  try {
    const postComment = await Post.findByIdAndUpdate(
      req.params.id,
      {
        $push: { comments: { text: comment, postedBy: req.user._id } },
      },
      { new: true }
    );
    const post = await Post.findById(postComment._id).populate(
      "comments.postedBy",
      "name email"
    );
    res.status(200).json({
      success: true,
      post,
    });
  } catch (error) {
    next(error);
  }
};

// add likes
// addtoset is the same as push but it will only add with unique id
exports.addLike = async (req, res, next) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      {
        $addToSet: { likes: req.user._id },
      },
      { new: true }
    );

    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("postedBy", "name");
    main.io.emit("add-like", posts);

    res.status(200).json({
      success: true,
      post,
      posts,
    });
  } catch (error) {
    next(error);
  }
};

// remove likes
exports.removeLike = async (req, res, next) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      {
        $pull: { likes: req.user._id },
      },
      { new: true }
    );

    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("postedBy", "name");
    main.io.emit("remove-like", posts);

    res.status(200).json({
      success: true,
      post,
    });
  } catch (error) {
    next(error);
  }
};

// adding new function to select post by kategori
exports.fetchPostByKategori = async (req, res, next) => {
  const kategoriId = req.params.kategoriId;

  try {
    const posts = await Post.find({ kategoriId })
      .sort({ createdAt: -1 })
      .populate("postedBy", "name");

    res.status(200).json({
      success: true,
      posts,
    });
  } catch (error) {
    next(error);
  }
};
