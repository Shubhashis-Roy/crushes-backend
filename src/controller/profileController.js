const { validateEditProfileData } = require("../utils/validation");
const User = require("../models/user");

const getUserProfile = async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(400).send(`profile api Error: ${error.message}`);
  }
};

const updateProfile = async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      // return res.status(400).send("")
      throw new Error("Invalid edit Request");
    }

    const user = req.user;

    Object.keys(req.body).forEach((key) => (user[key] = req.body[key]));

    await user.save();

    res.json({
      message: `${user.firstName}, Profile update successfully!!`,
      data: user,
    });
  } catch (error) {
    res.status(400).send(`profileUpdate api Error: ${error.message}`);
  }
};

// Edit and update profile photo
const updateProfilePhoto = async (req, res) => {
  const userId = req.user._id;
  const images = req.body.images;
  try {
    if (!images.length) {
      return res.status(400).json({ message: "Image is required" });
    } else if (images.length > 3) {
      return res.status(400).json({ message: "Add image limit 3." });
    }

    const user = await User.findById({ _id: userId }).select("photoUrl");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const currentPhotos = user.photoUrl;

    const updatedPhotos = images.map((img, index) => {
      return img ?? currentPhotos[index];
    });

    if (images.length < currentPhotos.length) {
      updatedPhotos.length = images.length;
    }

    user.photoUrl = updatedPhotos;
    await user.save();

    res.status(200).json({
      message: "Profile photos updated successfully",
      photoUrl: user.photoUrl,
    });
  } catch (error) {
    res.status(400).send(`profilePhotoUpdate api Error: ${error.message}`);
  }
};

module.exports = { getUserProfile, updateProfile, updateProfilePhoto };
