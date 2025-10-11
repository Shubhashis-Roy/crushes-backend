import express from 'express';
import { userAuth } from '../middlewares/auth';
import { getChatUsersList, chatting } from '../controller/chat.controller';

const chatRouter = express.Router();

chatRouter.get('/chat/users-list', userAuth, getChatUsersList);

chatRouter.get('/chat/:targetUserId', userAuth, chatting);

export default chatRouter;
