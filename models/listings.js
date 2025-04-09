const mongoose = require("mongoose");

const listingsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      maxLength: 255,
      minlength: 2,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      maxlength: 1000,
      minlength: 2,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 1,
    },

    categoryId: {
      type: Number,
      required: true,

      min: 1,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    images: {
      type: [String],
      required: true,
    },

    likes: [String],

    comments: {
      type: Number,
      default: 0
  }
  },

  { timestamps: true }
);

const Listings = mongoose.model("Listing", listingsSchema);

module.exports = Listings;
