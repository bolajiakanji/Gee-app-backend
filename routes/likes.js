const express = require("express");
const router = express.Router();
const Users = require("../models/users");
const Joi = require("joi");
const validateWith = require("../middleware/validation");
const Comments = require("../models/comments");
const Listings = require("../models/listings");
const auth = require("../middleware/auth");


// router.get("/:listingId", auth, async (req, res) => {
//     const listings = await Listings.find({ listingId: req.params.listingId })
//     if (!listings) return res.status(404).send();
//   console.log(listings.likes)
//   console.log('listingslikes')
//   res.status(200).send(listings.likes);
  
// })

router.put("/:id", auth, async (req, res) => {
    console.log('auth2')

    console.log('likes')
    
    const listing = await Listings.findById(req.body.listingId)
    if (!listing) return res.status(404).send({ error: 'listing not found' })
    const likes = listing.likes
    if (req.params.id == '1') {
        
        
            console.log('commenteee')
            const newListing = await Listings.findByIdAndUpdate(req.body.listingId, { $push: { likes: req.user._id } },
                { returnDocument: 'after', lean: true })
            console.log(listing)
            console.log('not here3')

            
            return res.status(200).send(newListing.likes);
          
        
    }
    
        
            const newListing = await Listings.findByIdAndUpdate(req.body.listingId, { $pull: { likes: req.user._id } },
                { returnDocument: 'after', lean: true })
            console.log('commenteee')
            console.log(listing)

                return res.status(200).send(newListing.likes);
    
    

})    



module.exports = router;

// router.put("/:id", auth, async (req, res) => {
//     console.log('auth2')

//     console.log('likes')
    
//     const listing = await Listings.findById(req.body.listingId)
//     if (!listing) return res.status(404).send({ error: 'listing not found' })
//     const likes = listing.likes
//     if (req.params.id == '1') {
        
//         if (!likes.includes(req.user._id)) {
//             console.log('commenteee')
//             const newListing = await Listings.findByIdAndUpdate(req.body.listingId, { $push: { likes: req.user._id } },
//                 { returnDocument: 'after', lean: true })
//             console.log(listing)
//             console.log('not here3')

            
//             return res.status(200).send(newListing);
//         }    
//         console.log(listing)

//         console.log('not here2')

//         return res.status(400).send({error: 'user already likes the item'})
//     }
    
//         if (likes.includes(req.user._id)) {
//             const newListing = await Listings.findByIdAndUpdate(req.body.listingId, { $pull: { likes: req.user._id } },
//                 { returnDocument: 'after', lean: true })
//             console.log('commenteee')
//             console.log(listing)

//                 return res.status(200).send(newListing.likes);
//     }
//     console.log(listing)

//     console.log('not here')
        
//     return res.status(400).send({ error: 'user did not like the item' })

// })    



// module.exports = router;
