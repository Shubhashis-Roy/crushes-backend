import { Request, Response } from 'express';
import mongoose from 'mongoose';

const healthCheck = (req: Request, res: Response) => {
  type DbState = 0 | 1 | 2 | 3;

  type DbStatusMap = {
    [key in DbState]: 'disconnected' | 'connected' | 'connecting' | 'disconnecting';
  };

  const dbStatusMap: DbStatusMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  const dbState = mongoose.connection.readyState as DbState;

  res.status(200).json({
    status: 'ok',
    server: 'running',
    database: dbStatusMap[dbState],
    timestamp: new Date().toISOString(),
  });
};

export { healthCheck };
