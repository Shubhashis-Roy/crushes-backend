import { Router } from 'express';
import { register, login, logout, deleteUser } from '@/controller';
import { userAuth } from '@/middlewares/auth';

const authRouter = Router();

// Register
authRouter.post('/signup', register);

// Login
authRouter.post('/login', login);

// Logout
authRouter.post('/logout', logout);

// Delete user
authRouter.delete('/delete', userAuth, deleteUser);

export default authRouter;
