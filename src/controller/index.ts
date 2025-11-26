import { register, login, logout, deleteUser } from './auth.controller';
import { getChatUsersList, chatting } from './chat.controller';
import { getUserProfile, updateProfile } from './profile.controller';
import { sendConnection, reviewConnection, deleteIgnoredRejectedUsers } from './request.controller';
import { getFeed, getAllConnection, getReceivedConnection } from './user.controller';
import { healthCheck } from './health.controller';

export {
  register,
  login,
  logout,
  deleteUser,
  getChatUsersList,
  chatting,
  getUserProfile,
  updateProfile,
  sendConnection,
  reviewConnection,
  getFeed,
  getAllConnection,
  getReceivedConnection,
  deleteIgnoredRejectedUsers,
  healthCheck,
};
