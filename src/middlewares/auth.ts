import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import User from '../models/user.model';

export const userAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { token } = req.cookies as { token?: string };

    if (!token) {
      res.status(401).send('Please Login!!!');
      return;
    }

    const secret = process.env.SECRET_TOKEN;
    if (!secret) {
      throw new Error('SECRET_TOKEN is not defined in environment variables');
    }

    const decoded = jwt.verify(token, secret) as JwtPayload & { _id: string };
    const { _id } = decoded;

    const user = await User.findById(_id);
    if (!user) {
      res.status(404).send('User not found');
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    res.status(400).send(`Auth middleware Error: ${message}`);
  }
};
