const express = require("express");
const router = express.Router();
const Users = require("../models/users");
const Joi = require("joi");
const validateWith = require("../middleware/validation");
const auth = require("../middleware/auth");

const schema = Joi.object({
    heading: Joi.string().required().allow('').max(255),
    contactInfo: Joi.string().required().min(1).max(255),
})
router.put("/", [auth, validateWith(schema)], async (req, res) => {
    console.log('auth2')

    console.log('likes')
    
        
        
            console.log('saved user')
            const newUserInfo  = await Users.findByIdAndUpdate(req.user._id, { $push: { contacts: req.body} },
                { returnDocument: 'after', lean: true })
            console.log(newUserInfo)
            console.log('not here3')

            
            return res.status(200).send(newUserInfo);
          
        
    
    
        
            
    

})    



module.exports = router;
