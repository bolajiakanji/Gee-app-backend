const express = require("express");
const router = express.Router();
const Users = require("../models/users");
const Joi = require("joi");
const validateWith = require("../middleware/validation");
const Comments = require("../models/comments");
const Listings = require("../models/listings");
const auth = require("../middleware/auth");



const schema = Joi.object({
    
  comment: Joi.string().required(),
    
});
  
router.get("/:listingId", auth, async(req, res) => {
    const comments = await Comments.find({ listingId: req.params.listingId })
    if (!comments) return res.status(404).send();
  console.log(comments)
  console.log('comments')
  res.status(200).send(comments);
  
})
  
router.post("/:listingId", [auth, validateWith(schema)], async (req, res) => {
    console.log('comment')
    const comment = {
        userId: req.user._id,
        listingId: req.params.listingId,
        comment: req.body.comment
    }
    const listing = await Listings.findById(req.params.listingId)
    if (!listing) return res.status(404).send({error: 'listing not found'})
    await Comments.create(comment)
    const comments = await Comments.find({ listingId: req.params.listingId })

  console.log(comments)
  console.log('commenteee')
  res.status(200).send(comments);
  
})

module.exports = router;

  
  


