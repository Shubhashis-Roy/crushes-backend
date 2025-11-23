import express from 'express';
import { userAuth } from '../middlewares/auth';
import { sendConnection, reviewConnection, deleteIgnoredRejectedUsers } from '@/controller';

const requestRouter = express.Router();

// Connection send to other
requestRouter.post('/send/:status/:toUserId', userAuth, sendConnection);

// Connection received
requestRouter.post('/review/:status/:requestId', userAuth, reviewConnection);

// Delete not interest users
requestRouter.delete('/delete', deleteIgnoredRejectedUsers);

export default requestRouter;
