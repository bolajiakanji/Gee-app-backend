const mongoose = require("mongoose");

const listingsSchema = new mongoose.Schema({
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

  category: {
    type: Number,
    required: true,
    min: 1,
    max: 9,
  },

  images: {
    type: [String],
    required: true,
    },
  
    created_at: {
        type: Date,
        default: Date.now
  }
});

const Listings = mongoose.model("Listing", listingsSchema);

module.exports = Listings;
