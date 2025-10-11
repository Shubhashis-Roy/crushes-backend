import express from 'express';
import { userAuth } from '../middlewares/auth';
import { getFeed, getAllConnection, getReceivedConnection } from '../controller/user.controller';

const userRouter = express.Router();

// Get all the received connection request
userRouter.get('/user/requests/received', userAuth, getReceivedConnection);

// Get all the user connections
userRouter.get('/user/connections', userAuth, getAllConnection);

userRouter.get('/feed', userAuth, getFeed);

export default userRouter;
