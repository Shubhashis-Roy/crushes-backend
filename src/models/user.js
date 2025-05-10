const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      // minLength: 5,
      // maxLength: 25,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      unique: true,
      lowercase: true,
      required: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email Id: " + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Enter a strong: " + value);
        }
      },
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      enum: {
        values: ["male", "female", "other"],
        message: `{VALUE} not a valid gender type!!`,
      },
      // validate(value) {
      //   if (!["male", "female", "others"].includes(value))
      //     throw new Error("Gender data is not valid!");
      // },
    },
    photoUrl: {
      type: String,
      default:
        "https://img.lovepik.com/png/20231128/man-wearing-jacket-hoodie-in-anonymous-hacker-theme-login-access_718571_wh1200.png",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid photo URL: " + value);
        }
      },
    },
    about: {
      type: String,
      default: "This is a default about of user",
    },
    skills: {
      type: [String],
      default: "default - JS",
    },
  },
  { timestamps: true }
);

// compound index to fast the query
// make gender as index
userSchema.index({ firstName: 1 });

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign(
    {
      _id: user._id,
    },
    "devtinder$123",
    { expiresIn: "1d" }
  );

  return token;
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const passwordHash = user.password;
  const isPasswordValid = await bcrypt.compare(
    passwordInputByUser,
    passwordHash
  );

  return isPasswordValid;
};

// const User = mongoose.model("User", userSchema);
module.exports = mongoose.model("User", userSchema);
