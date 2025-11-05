import User from '@/models/user.model';
// import { IUser } from '@/types/models/user';
import { IUser } from '@/types/models/user';
// import { validateEditProfileData } from '../utils/validation';
import { Request, Response } from 'express';

export interface AuthenticatedRequest extends Request {
  user?: IUser;
}

export interface IUpdateProfilePayload {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string; // "03/02/2003"
  city?: string;
  gender?: string;
  interest?: string;
  profession?: string;
  organization?: string;
  education?: string;
  bio?: string;
  lookingFor?: string;
  preferredAge?: {
    min: number;
    max: number;
  };
  preferredDistance?: number;
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

// Update user profile
const updateProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: 'User is not logged in' });
    }

    // const allowedKeys: (keyof IUpdateProfilePayload)[] = [
    //   'firstName',
    //   'lastName',
    //   'dateOfBirth',
    //   'city',
    //   'gender',
    //   'interest',
    //   'profession',
    //   'organization',
    //   'education',
    //   'bio',
    //   'lookingFor',
    //   'preferredAge',
    //   'preferredDistance',
    // ];

    const filteredData: Partial<IUpdateProfilePayload> = {};

    // Object.entries(req.body).forEach(([key, value]) => {
    //   const typedKey = key as keyof IUpdateProfilePayload;

    //   if (
    //     allowedKeys.includes(key as keyof IUpdateProfilePayload) &&
    //     value !== undefined &&
    //     value !== null &&
    //     value !== ''
    //   ) {
    //     filteredData[typedKey] = value as IUpdateProfilePayload[typeof typedKey];
    //   }
    // });

    if (Object.keys(filteredData).length === 0) {
      return res.status(400).json({ message: 'No valid fields to update' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { $set: filteredData },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({
      message: 'Profile updated successfully!',
      data: updatedUser,
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
