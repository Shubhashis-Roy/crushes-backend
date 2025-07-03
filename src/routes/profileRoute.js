const express = require("express");
const { userAuth } = require("../middlewares/auth");
const {
  getUserProfile,
  updateProfile,
  updateProfilePhoto,
} = require("../controller/profileController");

const { initializeApp } = require("firebase/app");
const { firebaseConfig } = require("../firebsae/firebase");
const multer = require("multer");
const {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} = require("firebase/storage");
const { giveCurrentDateTime } = require("../utils/currentDateTime");

const profileRouter = express.Router();

//Profile
profileRouter.get("/profile/view", userAuth, getUserProfile);

//Edit profile
profileRouter.patch("/profile/edit", userAuth, updateProfile);

//Add proflie
profileRouter.post("/profile/editPhoto", userAuth, updateProfilePhoto);

// Test upload photo in firebase
initializeApp(firebaseConfig);
const storage = getStorage();
const upload = multer({ storage: multer.memoryStorage() });

profileRouter.post(
  "/test-edit",
  upload.single("filename"),
  async (req, res) => {
    try {
      const dateTime = giveCurrentDateTime();

      const storageRef = ref(
        storage,
        `files/${req.file.originalname + "       " + dateTime}`
      );

      // Create file metadata including the content type
      const metadata = {
        contentType: req.file.mimetype,
      };

      // Upload the file in the bucket storage
      const snapshot = await uploadBytesResumable(
        storageRef,
        req.file.buffer,
        metadata
      );
      //by using uploadBytesResumable we can control the progress of uploading like pause, resume, cancel

      // Grab the public url
      const downloadURL = await getDownloadURL(snapshot.ref);

      return res.send({
        message: "file uploaded to firebase storage",
        name: req.file.originalname,
        type: req.file.mimetype,
        downloadURL: downloadURL,
      });
    } catch (error) {
      return res.status(400).send(error.message);
    }
  }
);

module.exports = profileRouter;
