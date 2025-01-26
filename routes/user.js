const express = require("express");
const router = express.Router();

const usersStore = require("../store/users");
const listingsStore = require("../store/listings");
const auth = require("../middleware/auth");

router.get("/:id",  (req, res) => {
  console.log('bhere')
  const userId = parseInt(req.params.id);
  const user = usersStore.getUserById(userId);
  if (!user) return res.status(404).send();

  const listings = listingsStore.filterListings(
    listing => listing.userId === userId
  );
console.log({
  id: user.id,
  name: user.name,
  email: user.email,
  listings: listings.length
})
  res.send({
    id: user.id,
    name: user.name,
    email: user.email,
    listings: listings.length
  });
});

module.exports = router;
