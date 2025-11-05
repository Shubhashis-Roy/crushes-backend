import express from 'express';
import { userAuth } from '../middlewares/auth';
import { getUserProfile, updateProfile } from '@/controller';

const profileRouter = express.Router();

//Profile
profileRouter.get('/view', userAuth, getUserProfile);

//Edit profile
profileRouter.patch('/edit', userAuth, updateProfile);

//Add profile
// profileRouter.post("/editPhoto", userAuth, updateProfilePhoto);

export default profileRouter;
