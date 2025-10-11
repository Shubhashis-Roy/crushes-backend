import { validateEditProfileData } from '../utils/validation';
// import User from "../models/user.js";
import { Request, Response } from 'express';
import { IUser } from '../models/user.model';

export interface AuthenticatedRequest extends Request {
  user?: IUser;
}

const getUserProfile = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    res.status(400).send(`profile api Error: ${message}`);
  }
};

const updateProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error('Invalid edit request');
    }

    const user = req.user;
    if (!user) {
      res.status(401).json({ message: 'User is not logged in' });
      return;
    }

    Object.assign(user, req.body);

    await user.save();

    res.json({
      message: `${user.firstName}, profile updated successfully!`,
      data: user,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    res.status(400).send(`profileUpdate API error: ${message}`);
  }
};

// // Edit and update profile photo
// const updateProfilePhoto = async (req, res) => {
//   const userId = req.user._id;
//   const images = req.body.images;
//   try {
//     if (!images.length) {
//       return res.status(400).json({ message: "Image is required" });
//     } else if (images.length > 3) {
//       return res.status(400).json({ message: "Add image limit 3." });
//     }

//     const user = await User.findById({ _id: userId }).select("photoUrl");

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const currentPhotos = user.photoUrl;

//     const updatedPhotos = images.map((img, index) => {
//       return img ?? currentPhotos[index];
//     });

//     if (images.length < currentPhotos.length) {
//       updatedPhotos.length = images.length;
//     }

//     user.photoUrl = updatedPhotos;
//     await user.save();

//     res.status(200).json({
//       message: "Profile photos updated successfully",
//       photoUrl: user.photoUrl,
//     });
//   } catch (error) {
//     res.status(400).send(`profilePhotoUpdate api Error: ${error.message}`);
//   }
// };

export { getUserProfile, updateProfile };
