const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const Sequence = require("./sequenceModel"); // Import the Sequence model

const postSchema = new mongoose.Schema(
  {
    // for the auto-increment
    // displayNumber: {
    //   type: Number, // for keeping the sequential
    // },

    title: {
      type: String,
      required: [true, "Nama judul tidak boleh kosong"],
    },
    content: {
      type: String,
      required: [true, "Deskripsi tidak boleh kosong"],
    },
    postedBy: {
      type: ObjectId,
      ref: "User",
    },
    image: {
      url: String,
      public_id: String,
    },
    likes: [{ type: ObjectId, ref: "User" }],
    comments: [
      {
        text: String,
        created: { type: Date, default: Date.now },
        postedBy: {
          type: ObjectId,
          ref: "User",
        },
      },
    ],
    kategoriId: {
      type: ObjectId,
      ref: "Kategori",
      required: true,
    },
  },
  { timestamps: true }
);

postSchema.pre("save", async function (next) {
  if (!this.displayNumber) {
    try {
      const sequence = await Sequence.findByIdAndUpdate(
        "Post", // Use "Post" as the _id for sequence document
        { $inc: { sequence_value: 1 } },
        { new: true, upsert: true }
      );
      this.displayNumber = sequence.sequence_value;
      next();
    } catch (error) {
      return next(error);
    }
  } else {
    next();
  }
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
