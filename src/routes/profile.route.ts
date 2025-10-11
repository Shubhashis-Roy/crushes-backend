import express from 'express';
import { userAuth } from '../middlewares/auth';
import { getUserProfile, updateProfile } from '../controller/profile.controller';

const profileRouter = express.Router();

//Profile
profileRouter.get('/profile/view', userAuth, getUserProfile);

//Edit profile
profileRouter.patch('/profile/edit', userAuth, updateProfile);

//Add profile
// profileRouter.post("/profile/editPhoto", userAuth, updateProfilePhoto);

export default profileRouter;
