const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Listings = require("../models/listings");

router.get("/:id",auth,  async (req, res) => {
  console.log('lets go')
  const userId = req.params.id;
 
    const userListings = await Listings.find({ userId })

  if (userListings.length < 1) return res.status(404).send([])
    console.log('userListings21')
  console.log(userListings)
  console.log(userId)
  console.log('you say waiting')
  res.status(200).send(userListings);
});

module.exports = router;
