import cloudinary from '@/config/cloudinary';
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

    const allowedKeys: (keyof IUpdateProfilePayload)[] = [
      'firstName',
      'lastName',
      'dateOfBirth',
      'city',
      'gender',
      'interest',
      'profession',
      'organization',
      'education',
      'bio',
      'lookingFor',
      'preferredAge',
      'preferredDistance',
    ];

    const filteredData: Partial<IUpdateProfilePayload> = {};

    Object.entries(req.body).forEach(([key, value]) => {
      const typedKey = key as keyof IUpdateProfilePayload;

      // if (
      //   allowedKeys.includes(key as keyof IUpdateProfilePayload) &&
      //   value !== undefined &&
      //   value !== null &&
      //   value !== ''
      // ) {
      //   filteredData[typedKey] = value as IUpdateProfilePayload[typeof typedKey];
      // }

      if (allowedKeys.includes(typedKey) && value !== undefined && value !== null && value !== '') {
        switch (typedKey) {
          case 'preferredAge':
            if (
              typeof value === 'object' &&
              value !== null
              // && typeof value.min === 'number' &&
              // typeof value.max === 'number'
            ) {
              filteredData[typedKey] = value as { min: number; max: number };
            }
            break;
          case 'preferredDistance':
            if (typeof value === 'number') {
              filteredData[typedKey] = value as number;
            }
            break;
          default:
            if (typeof value === 'string') {
              filteredData[typedKey] = value as string;
            }
            break;
        }
      }
    });

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

// Add photos
const addPhotos = async (req: Request, res: Response) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // console.log(user, 'user hlo ==========');

    user.photoUrl ||= [];

    const existingPhotos = user.photoUrl.length;

    if (!req.files || !(req.files as Express.Multer.File[]).length) {
      return res.status(400).json({ message: 'No images uploaded' });
    }

    const newFiles = req.files as Express.Multer.File[];

    if (existingPhotos + newFiles.length > 6) {
      const remaining = 6 - existingPhotos;
      return res.status(400).json({
        message: `You can upload only ${remaining} more photos`,
      });
    }
    // console.log(newFiles, 'user hlo ==========');

    const uploadPromises = newFiles.map((file) => {
      const base64 = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;

      return cloudinary.uploader.upload(base64, {
        folder: 'user_photos',
      });
    });

    const results = await Promise.all(uploadPromises);

    const photoObjects = results.map((r) => ({
      url: r.secure_url,
      public_id: r.public_id,
    }));

    user.photoUrl.push(...photoObjects);

    await user.save();

    res.status(200).json({
      message: 'Photos uploaded successfully',
      totalPhotos: user.photoUrl.length,
      photos: user.photoUrl,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    res.status(500).send(`profileUpdate API error: ${message}`);
  }
};

export { getUserProfile, updateProfile, addPhotos };
