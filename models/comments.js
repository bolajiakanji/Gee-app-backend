const { type } = require("joi/lib/types/object");
const mongoose = require("mongoose");

const commentsSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      required: true,
      maxLength: 16000,

      trim: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    listingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);
const Comments = mongoose.model("Comment", commentsSchema);

module.exports = Comments;

