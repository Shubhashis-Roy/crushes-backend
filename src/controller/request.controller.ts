import ConnectionRequestModel from '../models/connectionRequest.model';
import User from '../models/user.model';
import { Request, Response } from 'express';
import { IUser } from '@/types/models/user';
import { deleteIgnoredRejectedService } from '@/services/request.servers';

export interface AuthenticatedRequest extends Request {
  user?: IUser;
}

type ReviewConnectionParams = {
  status: 'accepted' | 'rejected';
  requestId: string;
};

interface AuthenticatedRequestWithParams extends Request<ReviewConnectionParams> {
  user?: IUser;
}

export type ConnectionStatus = 'interested' | 'ignored' | 'accepted' | 'rejected';

// Connection send to other
const sendConnection = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'User is not logged in' });
      return;
    }

    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status as ConnectionStatus;

    if (!['ignored', 'interested'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status type: ' + status });
    }

    // Check if the toUser exists
    const toUser = await User.findById(toUserId);
    if (!toUser) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Check for an existing connection request in either direction
    const existingConnectionReq = await ConnectionRequestModel.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    });

    // If a request exists
    if (existingConnectionReq) {
      if (existingConnectionReq.status === 'rejected') {
        existingConnectionReq.status = status;
        const updatedReq = await existingConnectionReq.save();

        return res.json({
          message: `${req.user.firstName} is ${status} in ${toUser.firstName}`,
          data: updatedReq,
        });
      } else {
        return res.status(400).json({ message: 'Connection request already exists!!!' });
      }
    }

    // No existing request, create new
    const connectionRequest = new ConnectionRequestModel({
      fromUserId,
      toUserId,
      status,
    });

    const data = await connectionRequest.save();

    res.json({
      message: `${req.user.firstName} is ${status} in ${toUser.firstName}`,
      data,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    res.status(400).send(`connectionReq API Error: ${message}`);
  }
};

// Connection received
const reviewConnection = async (req: AuthenticatedRequestWithParams, res: Response) => {
  try {
    const { status, requestId } = req.params;
    const loggedInUser = req.user;
    if (!loggedInUser) {
      res.status(401).json({ message: 'User is not logged in' });
      return;
    }

    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'status is not allowed' });
    }

    const connectionReq = await ConnectionRequestModel.findOne({
      _id: requestId,
      toUserId: loggedInUser._id,
      status: 'interested',
    });
    if (!connectionReq) {
      return res.status(400).json({ message: 'Connection req is not found' });
    }

    connectionReq.status = status;
    const data = await connectionReq.save();

    res.json({ message: 'Connection request ' + status, data });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    res.status(400).send(`connectionReceived api Error: ${message}`);
  }
};

//Delete ignored/rejected requests
const deleteIgnoredRejectedUsers = async (req: Request, res: Response) => {
  try {
    const deletedCount = await deleteIgnoredRejectedService();

    return res.status(200).json({
      message: 'Deleted all ignored/rejected requests successfully',
      deletedCount,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return res.status(400).send(`deleteIgnoredRejectedUsers API Error: ${message}`);
  }
};

export { sendConnection, reviewConnection, deleteIgnoredRejectedUsers };
