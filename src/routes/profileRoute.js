const express = require("express");
const { userAuth } = require("../middlewares/auth");
const {
  getUserProfile,
  updateProfile,
  updateProfilePhoto,
} = require("../controller/profileController");

const profileRouter = express.Router();

//Profile
profileRouter.get("/profile/view", userAuth, getUserProfile);

//Edit profile
profileRouter.patch("/profile/edit", userAuth, updateProfile);

//Add proflie
profileRouter.post("/profile/editPhoto", userAuth, updateProfilePhoto);

module.exports = profileRouter;
