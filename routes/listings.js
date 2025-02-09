const express = require("express");
const router = express.Router();
const Joi = require("joi");
const multer = require("multer");
const store = require("../store/listings");
const categoriesStore = require("../store/categories");
const validateWith = require("../middleware/validation");
const auth = require("../middleware/auth");
const imageResize = require("../middleware/imageResize");
const delay = require("../middleware/delay");
const listingMapper = require("../mappers/listings");
const config = require("config");
const object = require("joi/lib/types/object");
const Listings = require("../models/listings");
const Users = require("../models/users");

const upload = multer({
  dest: "uploads/",
  limits: { fieldSize: 25 * 1024 * 1024 },
});

const schema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().allow(""),
  price: Joi.number().required().min(1),
  categoryId: Joi.number().required().min(1),
  location: Joi.object({
    latitude: Joi.number().required(),
    longitude: Joi.number().required(),
  }).optional(),
});

const validateCategoryId = (req, res, next) => {
  if (!categoriesStore.getCategory(parseInt(req.body.categoryId)))
    return res.status(400).send({ error: "Invalid categoryId." });

  next();
};

router.get("/", async (req, res) => {
  let next = parseInt(req.query.next);
  const count = await Listings.find({}).countDocuments().lean();
  const docPerPage = 4;
  const numberOfPage =Math.ceil(count / docPerPage);

  // if (next + 1 > numberOfPage ) return res.status(200).send({});
  const listings = await Listings.find({})
    .populate("userId")
    .skip((next-1) * docPerPage)
    .limit(docPerPage)
    .lean();

  const resources = listings.map(listingMapper);
  const result = {
    resources, nextPage: numberOfPage <= next ? null : next + 1
  }

  console.log(resources);
  console.log(result);
  console.log(req.query);
  
  res.status(200).send(result);
});

router.post(
  "/",
  [
    // Order of these middleware matters.
    // "upload" should come before other "validate" because we have to handle
    // multi-part form data. Once the upload middleware from multer applied,
    // request.body will be populated and we can validate it. This means
    // if the request is invalid, we'll end up with one or more image files
    // stored in the uploads folder. We'll need to clean up this folder
    // using a separate process.
    // auth,
    upload.array("images", config.get("maxImageCount")),
    validateWith(schema),
    validateCategoryId,
    imageResize,
  ],
  auth,
  async (req, res) => {
    const listing = {
      title: req.body.title,
      price: parseFloat(req.body.price),
      categoryId: parseInt(req.body.categoryId),
      description: req.body.description,
    };

    listing.images = req.files.map((fileName) => fileName.filename);
    if (req.body.location) listing.location = JSON.parse(req.body.location);
    const userId = req.user.userId;
    if (req.user) listing.userId = userId;
    const newListing = await Listings.create(listing);
    const savedListing = await newListing.save();
    const userListings = await Listings.find({ userId });

    const updateUserlistings = await Users.findByIdAndUpdate(userId, {
      userListings: userListings.length,
    });

    res.status(201).send(savedListing);
  }
);

module.exports = router;
