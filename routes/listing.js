const express = require("express");
const router = express.Router();

const store = require("../store/listings");
const auth = require("../middleware/auth");
const listingMapper = require("../mappers/listings");
const Listings = require("../models/listings");

router.get("/:id", auth, async (req, res) => {
 const listing =  Listings.findById(req.params.id)
 // const listing = store.getListing(parseInt(req.params.id));
  if (!listing) return res.status(404).send();
  const resource = listingMapper(listing);
  res.send(resource);
});

module.exports = router;
