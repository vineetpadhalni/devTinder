const jwt = require("jsonwebtoken");
const User = require("../model/user");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Invalid Token");
    }
    // console.log(token)
    const decodeObj = await jwt.verify(token, "DEv@tinder!!@#");
    const { _id } = decodeObj;
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("user not found");
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(400).send("ERROR3" + err.message);
  }
};

module.exports = {
  userAuth,
};
