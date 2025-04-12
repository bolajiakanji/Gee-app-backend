const express = require("express");
const router = express.Router();
const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");
const config = require("config");
const { getUsers, getUserById } = require("../store/users");
const Users = require("../models/users");
const cloudinary = require("cloudinary").v2;

const upload = multer({
  dest: "uploads/",
  limits: { fieldSize: 25 * 1024 * 1024 },
});
const uploadImage = async (imagePath) => {
  const options = {
    unique_filename: true,
    overwrite: true,
    asset_folder: "items",
    use_asset_folder_as_public_id_prefix: true,
  };

  try {
    // Upload the image
    const result = await cloudinary.uploader.upload(imagePath, options);
    console.log("result");
    console.log("resu");
    console.log(result.public_id);
    console.log(result);

    return result.public_id;
  } catch (error) {
    console.error(error);
  }
};

const getPath = (file) => {
  console.log(file.filename);
  console.log("file.filename");
  const outputFolder = "public/assets";
  const profileImage = path.resolve(
    outputFolder,
    file.filename + "profileImage.webp"
  );

  return profileImage;
};

router.post("/:id", upload.single("profileImage"), async (req, res) => {
  const file = req.file;
  const userId = req.params.id;
  console.log("hereb");
  console.log(userId);
  const user = await Users.findById(userId);

  if (!user) return res.status(404).send();

  const getFile = () => {
    return getPath(file);
  };
  await sharp(file.path).resize(70).webp({ quality: 12 }).toFile(getFile());
  const url = await uploadImage(getFile());

  console.log(url.public_id);

  fs.unlinkSync(req.file.path);
  fs.unlinkSync(getFile());

  const users = await Users.find();
  const newUsers = users.map((user) => {
    if (user.id === userId) {
      return {
        ...user,
        imageurl: url,
      };
    }
    return { ...user };
  });
  users = newUsers;

  res.status(200).send({ uri: uri });
});

module.exports = router;
