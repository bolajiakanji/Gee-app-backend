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
  price: Joi.number().required().min(100),
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
  let queryObject = req.query
  console.log(req.query)
  let page = parseInt(queryObject.page);
queryObject = queryObject.category == '0' ? {...queryObject, category: ''} : {...queryObject}
  let category =   queryObject.category ? parseInt(queryObject.category) : undefined;
  console.log('category34')
  console.log(category)
  let date = queryObject.date ? { $lte: queryObject.date } : undefined
  console.log('date')
  console.log(date)
  const count = await Listings.find({
     categoryId: category,
     createdAt: date
  })
    .countDocuments()
    .lean();
  const docPerPage = 10;
  const numberOfPage =Math.ceil(count / docPerPage);

  // if (page + 1 > numberOfPage ) return res.status(200).send({});
  const listings = await Listings.find({
    categoryId: category,
     createdAt: date
  })
    .populate("userId")
    .sort({createdAt: -1})
    .skip((page-1) * docPerPage)
    .limit(docPerPage)
    .lean();

  const resources = listings.map(listingMapper);
  const result = {
    resources:listings, nextPage: numberOfPage <= page ? null : page + 1
  }

  
  //console.log(result.resources[0].images);
  console.log('resultimages');
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
    const userId = req.user._id;
    console.log('userid')
    console.log(userId)
    const listing = {
      title: req.body.title,
      price: parseFloat(req.body.price),
      categoryId: parseInt(req.body.categoryId),
      description: req.body.description,
      userId
    };

    listing.images = req.images.map((fileName) => fileName);
    if (req.body.location) listing.location = JSON.parse(req.body.location);
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
