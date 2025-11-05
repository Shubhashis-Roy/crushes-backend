import ConnectionRequest from '../models/connectionRequest.model';
import User from '../models/user.model';
import { Request, Response } from 'express';
import { IUser } from '@/types/models/user';

export interface AuthenticatedRequest extends Request {
  user?: IUser;
}

const USER_SAFE_DATA = 'firstName lastName city photoUrl skills about age';

// Get all the received connection request
const getReceivedConnection = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const loggedInUser = req.user;
    if (!loggedInUser) {
      res.status(401).json({ message: 'User is not logged in' });
      return;
    }

    const connectionReq = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: 'interested',
    }).populate('fromUserId', USER_SAFE_DATA);

    res.json({
      message: 'Data fetched succesfuly',
      data: connectionReq,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    res.status(400).json({ error: `Error in getReceivedConnection: ${message}` });
  }
};

// Get all the user connections
const getAllConnection = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const loggedInUser = req.user;
    if (!loggedInUser) {
      res.status(401).json({ message: 'User is not logged in' });
      return;
    }

    const connectionRes = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: 'accepted' },
        { fromUserId: loggedInUser._id, status: 'accepted' },
      ],
    })
      .populate('fromUserId', USER_SAFE_DATA)
      .populate('toUserId', USER_SAFE_DATA);

    const data = connectionRes.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });

    res.json({ data });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    res.status(400).json({ error: `Error in getAllConnection: ${message}` });
  }
};

// User should not see
//0. his own card
//1. his connections
//2. ignored people
//3. already sent the connection req
const getFeed = async (req: Request, res: Response) => {
  try {
    const loggedInUser = req.user;

    if (!loggedInUser) return;

    const page = parseInt(req.query.page as string) || 1;
    let limit = parseInt(req.query.limit as string) || 10;

    limit = limit > 50 ? 50 : limit;

    const skip = (page - 1) * limit;

    // Find all connection req(send + received)
    const connectionReq = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select('fromUserId toUserId');
    // .populate("fromUserId", "firstName")
    // .populate("toUserId", "firstName");

    const hideUsersFromFeed = new Set();

    connectionReq.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });

    const users = await User.find({
      $and: [{ _id: { $nin: Array.from(hideUsersFromFeed) } }, { _id: { $ne: loggedInUser._id } }],
    })
      .select(USER_SAFE_DATA)
      .skip(skip);
    // .limit(limit);

    res.json({
      message: 'Feed users',
      data: users,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    res.status(400).json({
      message: message,
    });
  }
};

export { getAllConnection, getReceivedConnection, getFeed };
