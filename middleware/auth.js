const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.header("x-auth-token");
  console.log(token)
  if (!token) {
    console.log('authdddscc')
    return res.status(401).send({ error: "Access denied. No token provided." });
  }
  try {
    const payload = jwt.verify(token, "jwtPrivateKey");
    req.user = payload;
    next();
  } catch (err) {
    res.status(400).send({ error: "Invalid token." });
  }
};
