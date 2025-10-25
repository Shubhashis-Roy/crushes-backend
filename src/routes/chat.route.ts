import express from 'express';
import { userAuth } from '@/middlewares/auth';
import { getChatUsersList, chatting } from '@/controller';

const chatRouter = express.Router();

chatRouter.get('/users-list', userAuth, getChatUsersList);

chatRouter.get('/:targetUserId', userAuth, chatting);

export default chatRouter;
