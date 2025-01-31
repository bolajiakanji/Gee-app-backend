const express = require("express");
const router = express.Router();
const Joi = require("joi");
const usersStore = require("../store/users");
const validateWith = require("../middleware/validation");
const Users = require("../models/users");

const schema =Joi.object ({
  name: Joi.string().required().min(2),
  email: Joi.string().email().required(),
  password: Joi.string().required().min(5),
});

router.post("/", validateWith(schema), async (req, res) => {
  console.log(req.body)
  const { name, email, password } = req.body;
  const users = await Users.findOne({ email: email })
  console.log(users + 'cv')
  if (users)
    return res
      .status(400)
      .send({ error: "A user with the given email already exists." });

  const user = { name, email, password };
  // usersStore.addUser(user);

  const newUser = await Users.create(
    user
  )

  res.status(201).send(newUser);
});

router.get("/", async (req, res) => {
  const users = await Users.find({})
  res.status(201).send(users);
});

module.exports = router;
