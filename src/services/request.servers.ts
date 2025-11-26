import ConnectionRequestModel from '@/models/connectionRequest.model';

const deleteIgnoredRejectedService = async () => {
  // Calculate timestamp for 2 hours ago
  const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);

  const filter = {
    status: { $in: ['ignored', 'rejected'] },
    createdAt: { $lt: twoHoursAgo },
  };

  const count = await ConnectionRequestModel.countDocuments(filter);

  await ConnectionRequestModel.deleteMany(filter);

  return count;
};

export { deleteIgnoredRejectedService };
