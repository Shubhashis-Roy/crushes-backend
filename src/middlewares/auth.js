const jwt = require("jsonwebtoken");
const User = require("../models/user");

async function userAuth(req, res, next) {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).send("Please Login!!!");
    }

    const decodedTokenObj = await jwt.verify(token, "devtinder$123");

    const { _id } = decodedTokenObj;

    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User not found");
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(400).send(`Auth middleware Error: ${error.message}`);
  }
}

module.exports = {
  userAuth,
};
