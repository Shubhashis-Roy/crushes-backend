import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  const mongoUri = process.env.MONGODB_URL;

  if (!mongoUri) {
    throw new Error('MONGODB_URL is not defined in environment variables.');
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed:', (error as Error).message);
    process.exit(1);
  }
};

export default connectDB;
