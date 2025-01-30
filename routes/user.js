const express = require("express");
const router = express.Router();

const usersStore = require("../store/users");
const listingsStore = require("../store/listings");
const auth = require("../middleware/auth");
const Users = require("../models/users");
const Listings = require("../models/listings");

router.get("/",auth,  async (req, res) => {
  
  const userId = req.user.userId;
  const user = await Users.findById(userId)
  //const user = usersStore.getUserById(userId);
  if (!user) return res.status(404).send();

  const userListings = await Listings.find({ userId })

  res.send({
    id: user.id,
    name: user.name,
    email: user.email,
    listings: userListings.length
  });
});

module.exports = router;
