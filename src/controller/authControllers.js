const validator = require("validator");
const bcrypt = require("bcrypt");
const { validateSignUpData } = require("../utils/validation");
const User = require("../models/user");
const Chat = require("../models/chat");
const ConnectionRequest = require("../models/connectionRequest");

const register = async (req, res) => {
  // Encryt the password
  try {
    const { password, firstName, lastName, city, emailId } = req.body;

    const alreadyPresentUser = await User.findOne({ emailId });

    if (alreadyPresentUser) {
      return res
        .status(409)
        .json({ message: "Email already exists", alreadyPresentUser });
    }

    // Validation of data
    validateSignUpData(req);

    // Encryt the password
    const passwordHash = await bcrypt.hash(password, 10);

    // Creating a new instance of the User model
    const user = new User({
      firstName,
      lastName,
      city,
      emailId,
      password: passwordHash,
    });

    const savedUser = await user.save();
    // Create a JWT token
    const token = await savedUser.getJWT();

    // Add the token to cookie & send the res back to the user
    res.cookie("token", token, {
      expires: new Date(Date.now() + 2 * 3600000),
    });

    res
      .status(200)
      .send({ message: "User Added Successfully!", data: savedUser });
  } catch (err) {
    // if (err.code === 11000) {
    //   res.status(400).send("Email already exists");
    // } else {
    //   res.status(400).send(`Signup Error: ${err.message}`);
    // }
    res.status(400).send(`Signup Error: ${err.message}`);
  }
};

const login = async (req, res) => {
  try {
    const { emailId, password } = req.body;

    if (!validator.isEmail(emailId)) {
      // throw new Error("Email Id not valid!");
      throw new Error("Invalid credentials!");
    }

    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Email Id is not present!");
    }

    const isPasswordValid = await user.validatePassword(password);

    if (isPasswordValid) {
      // Create a JWT token
      const token = await user.getJWT();

      // Add the token to cookie & send the res back to the user
      res.cookie("token", token, {
        expires: new Date(Date.now() + 2 * 3600000),
      });

      res.send(user);
    } else {
      throw new Error("Password is not correct");
    }
  } catch (error) {
    res.status(400).send(`login api Error: ${error.message}`);
  }
};

const logout = async (_, res) => {
  res
    .cookie("token", null, {
      expires: new Date(Date.now()),
    })
    .send("Logout Successful!!");
};

const deleteUser = async (req, res) => {
  const userId = req.user._id;

  try {
    const deleteUser = await User.findByIdAndDelete(userId);

    if (!deleteUser) {
      return res.status(404).json({ message: "User not found" });
    }

    await ConnectionRequest.findOneAndDelete({
      $or: [{ fromUserId: userId }, { toUserId: userId }],
    });

    await Chat.deleteMany({ "messages.senderId": userId });

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { register, login, logout, deleteUser };
