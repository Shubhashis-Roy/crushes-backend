const express = require("express");
const { userAuth } = require("../middlewares/auth");
const {
  getUserProfile,
  updateProfile,
} = require("../controller/profileController");

const profileRouter = express.Router();

// Profile
profileRouter.get("/profile/view", userAuth, getUserProfile);

// Edit profile
profileRouter.patch("/profile/edit", userAuth, updateProfile);

module.exports = profileRouter;
