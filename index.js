const express = require("express");
const categories = require("./routes/categories");
const listings = require("./routes/listings");
const listing = require("./routes/listing");
const users = require("./routes/users");
const userListings = require("./routes/userListings");
const contacts = require("./routes/contact");
const comments = require("./routes/comments");
const likes = require("./routes/likes");
const user = require("./routes/user");
const auth = require("./routes/auth");
const my = require("./routes/my");
const profileImage = require("./routes/profileImage");
const messages = require("./routes/messages");
const expoPushTokens = require("./routes/expoPushTokens");
const helmet = require("helmet");
const compression = require("compression");
const config = require("config");
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config()

mongoose.connect('mongodb://localhost/borjiNew', { ignoreUndefined: true})
  .then(() => console.log('connected to mongoDB...'))
  .catch(err => console.error('Could not connect to mongoDB...', err)) 

app.use(cors())
app.use(express.static("public"));
app.use(express.json());
app.use(helmet());
app.use(compression());

app.get('/api/ok', (req, res) => {
  res.send('ok')
})

app.use("/api/categories", categories);
app.use("/api/listing", listing);
app.use("/api/listings", listings);
app.use("/api/user", user);
app.use("/api/users", users);
app.use("/api/userListings", userListings);
app.use("/api/contacts", contacts);
app.use("/api/comments", comments);
app.use("/api/likes", likes);
app.use("/api/profileImage", profileImage);
app.use("/api/auth", auth);
app.use("/api/my", my);
app.use("/api/expoPushTokens", expoPushTokens);
app.use("/api/messages", messages);

const port = process.env.PORT || config.get("port");
app.listen(port, function() {
  console.log(`Server started on port ${port}...`);
});
