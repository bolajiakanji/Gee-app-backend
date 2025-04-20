const express = require("express");
const router = express.Router();
const listingsStore = require("../store/listings");
const auth = require("../middleware/auth");
const listingMapper = require("../mappers/listings");
const Listings = require("../models/listings");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");
const config = require("config");
const { getUsers, getUserById } = require("../store/users");
const Users = require("../models/users");

const uploadImage = async (imagePath) => {
  const options = {
    unique_filename: true,
    overwrite: true,
    asset_folder: "profileImage",
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
    file.filename + ".webp"
  );

  return profileImage;
};




router.get("/listings", auth, async (req, res) => {
  const myListings = await Listings.find({ userId: req.user.userId })
  
  const resources = myListings.map(listingMapper);
  res.send(resources);
});

const upload = multer({
  dest: "uploads/",
  limits: { fieldSize: 25 * 1024 * 1024 },
});


// const resizePromise = async (req, time) => {
//   const outputFolder = "public/assets/profileImage/" + req.user.email + time +  '.jpg';
//   //fs.unlinkSync(path.resolve(outputFolder, ".jpg"));
//   const myImage = await sharp(req.file.path)
//     .resize(1000)
//     .jpeg({ quality: 50 })
//     .toFile(path.resolve(outputFolder));
//   fs.unlinkSync(req.file.path);

//   console.log(myImage);
//   console.log(__dirname)
//   console.log('dffff');
//   console.log(path.resolve(outputFolder));
// };

router.post("/profileImage", [auth, upload.single("profileImage")], async (req, res) => {
  const file = req.file;

  console.log(req.user)
  const userId = req.user._id
  const myObject = await Users.findById(userId)

  
  console.log(myObject)
  console.log('hereb')
  // const user = await Users.findById(userId);
  // //const user = getUserById(userId);

  if (!myObject) return res.status(404).send({ error: 'No such user' });

  const getFile = () => {
    return getPath(file);
  };
  await sharp(file.path).resize(500).webp({ quality: 50 }).toFile(getFile());
  const url = await uploadImage(getFile());

  console.log(url.public_id);

  fs.unlinkSync(req.file.path);
  fs.unlinkSync(getFile());


  
  
  const owner = await Users.findByIdAndUpdate(userId, { image: url }, {lean: true, returnDocument: 'after'});
  console.log('filepath')
  // const newUsers = users.map((user) => {
  console.log(url)
  console.log(owner)
  //   if (user.id === userId) {
  //     return {
  //       ...user,
  //       imageurl: filePath,
  //     };
  //   }
  //   return { ...user };
  // });
  // users = newUsers;
  console.log('bhg')
  const token = jwt.sign(
    {...owner},
    "jwtPrivateKey"
  );
  console.log(token)

  res.send(token);
});

// router.get("/listings", auth, (req, res) => {
//   const listings = listingsStore.filterListings(
//     listing => listing.userId === req.user.userId
//   );
//   const resources = listings.map(listingMapper);
//   res.send(resources);
// });

module.exports = router;
