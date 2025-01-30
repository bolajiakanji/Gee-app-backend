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
  const listings = await Listings.find();

  const resources = listings.map(listingMapper);
  console.log(resources);
  res.status(201).send(resources);
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

  async (req, res) => {
    const listing = {
      title: req.body.title,
      price: parseFloat(req.body.price),
      categoryId: parseInt(req.body.categoryId),
      description: req.body.description,
    };
    console.log(req.files);
    listing.images = req.files.map((fileName) => ({
      fileName: fileName.filename,
    }));
    if (req.body.location) listing.location = JSON.parse(req.body.location);
    if (req.user) listing.userId = req.user.userId;
    const newListing = await Listings.create(listing);
    const savedListing = newListing.save();
    store.addListing(listing);
    console.log(savedListing);

    res.status(201).send(savedListing);
  }
);

module.exports = router;
