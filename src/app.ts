import express, { Application } from 'express';
import dotenv from 'dotenv';
import connectDB from './config/database';
import cookieParser from 'cookie-parser';
import cors from 'cors';

// Routes
import routes from './routes';
import { healthCheck } from './controller';

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
app.use('/v1', routes);

// Health check endpoint
app.get('/health', healthCheck);

export default app;
