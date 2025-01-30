const express = require("express");
const router = express.Router();
const listingsStore = require("../store/listings");
const auth = require("../middleware/auth");
const listingMapper = require("../mappers/listings");
const Listings = require("../models/listings");

router.get("/listings", auth, async (req, res) => {
   const myListings = await Listings.find({userId: req.user.userId})
  const resources = myListings.map(listingMapper);
  res.send(resources);
});
// router.get("/listings", auth, (req, res) => {
//   const listings = listingsStore.filterListings(
//     listing => listing.userId === req.user.userId
//   );
//   const resources = listings.map(listingMapper);
//   res.send(resources);
// });

module.exports = router;
