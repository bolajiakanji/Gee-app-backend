const express = require("express");
const categories = require("./routes/categories");
const listings = require("./routes/listings");
const listing = require("./routes/listing");
const users = require("./routes/users");
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
const Model = require('./models/listings');

mongoose.connect('mongodb://localhost/borjiNew', { ignoreUndefined: true})
  .then(() => console.log('connected to mongoDB...'))
  .catch(err => console.error('Could not connect to mongoDB...', err)) 

// const listin = Model.create({
//   title: 'bolaji',
//   description: 'hdjjkahja',
//   price: 20,
//   category: 5,
//   likes: 0,
//   dislikes: 0

// })
// listin.then((resp)=> resp.save() 
//   .then((list) => console.log(list)))


// Model.findById('6799463d8c49e22734c31e47')
//   .then((lis) => {
//     console.log(lis.createdAt)
//     lis.likes++
//     lis.title = 'lukman'
//     lis.updated_at = Date.now()
//     lis.save().then((res)=> console.log(res))
//   })

// Model.findById('67987aa8ef501ef3904b4a0c').then((res) => console.log(res))
console.log('testing')

app.use(cors())

app.use(express.static("public"));
app.use(express.json());
 app.use(helmet());
app.use(compression());
console.log('here')
app.get('/api/k',(req, res) => {
  res.send('ok')
})
app.use("/api/categories", categories);
app.use("/api/listing", listing);
app.use("/api/listings", listings);
app.use("/api/user", user);
app.use("/api/users", users);
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
