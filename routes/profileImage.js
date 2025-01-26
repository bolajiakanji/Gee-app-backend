const express = require("express");
const router = express.Router();
const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");
const { dirname } = require("path/posix");
const config = require("config");
const { getUsers, getUserById } = require("../store/users");

const upload = multer({
  dest: "uploads/",
  limits: { fieldSize: 25 * 1024 * 1024 },
});

const outputFolder = "public/assets";

const resizePromise = async (imageFile, email) => {
  const my = await sharp(imageFile)
    .resize(1000)
    .jpeg({ quality: 50 })
    .toFile(path.resolve(outputFolder,  "mail.jpg"));
    fs.unlinkSync(imageFile);

  console.log(my)
};

router.post("/:id", upload.single("profileImage"), (req, res) => {
  const userId = parseInt(req.params.id);
  const user = getUserById(userId);

  if (!user) return res.status(404).send();

  const email = user.email;

  resizePromise(req.file.path, email);
  const filePath = config.get("assetsBaseUrl") + '/' + "mail.jpg";
  let users = getUsers();
  const newUsers = users.map((user) => {
    if (user.id === userId) {
      return {
        ...user,
        imageurl: filePath,
      };
    }
    return { ...user };
  });
  users = newUsers;

  res.status(200).send({ uri: filePath });
});

module.exports = router;
