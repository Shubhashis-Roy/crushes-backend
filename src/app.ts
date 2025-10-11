import express, { Application } from 'express';
import dotenv from 'dotenv';
import connectDB from './config/database';
import cookieParser from 'cookie-parser';
import cors from 'cors';

// Routes
import authRouter from './routes/auth.route';
import requestRouter from './routes/request.route';
import profileRouter from './routes/profile.route';
import userRouter from './routes/user.route';
import chatRouter from './routes/chat.route';

dotenv.config();

// Connect to MongoDB
connectDB();

const app: Application = express();

// CORS configuration
app.use(
  cors({
    origin: process.env.FE_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/', authRouter);
app.use('/', requestRouter);
app.use('/', profileRouter);
app.use('/', userRouter);
app.use('/', chatRouter);

export default app;
