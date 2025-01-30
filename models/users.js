
const mongoose = require("mongoose");

const usersSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      maxlength: 20,
      minlength: 4,
      trim: true,
    },

    name: {
      type: String,
      required: true,
      maxLength: 255,
      minlength: 1,
      trim: true,
    },

    
    nickname: {
      type: String,
      maxLength: 255,
      minlength: 1,
      trim: true,
    },
    image: {
      type: String,
      trim: true,
    },

    phoneNo: {
      type: Number,
    },

    watsapNo: {
      type: String,
      trim: true,
    },
  },

  { timestamps: true }
);

const Users = mongoose.model("User", usersSchema);

module.exports = Users;
