import { Router } from 'express';
import authRoutes from './auth.route';
import chatRoutes from './chat.route';
import profileRoutes from './profile.route';
import requestRoutes from './request.route';
import userRoutes from './user.route';

const router = Router();

// All the routes
router.use('/', authRoutes);
router.use('/chat', chatRoutes);
router.use('/profile', profileRoutes);
router.use('/request', requestRoutes);
router.use('/user', userRoutes);

export default router;
