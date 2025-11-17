import express from 'express';
import { userAuth } from '../middlewares/auth';
import { getUserProfile, updateProfile } from '@/controller';
import { addPhotos } from '@/controller/profile.controller';
import upload from '@/middlewares/upload';

const profileRouter = express.Router();

//Profile
profileRouter.get('/view', userAuth, getUserProfile);

//Edit profile
profileRouter.patch('/edit', userAuth, updateProfile);

//Add profile
profileRouter.post('/upload-photos', userAuth, upload.array('photo', 6), addPhotos);

export default profileRouter;
