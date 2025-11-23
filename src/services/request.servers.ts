import ConnectionRequestModel from '@/models/connectionRequest.model';

const deleteIgnoredRejectedService = async () => {
  // Calculate timestamp for 4 hours ago
  // const fourHoursAgo = new Date(Date.now() - 4 * 60 * 60 * 1000);

  const filter = {
    status: { $in: ['ignored', 'rejected'] },
    // createdAt: { $lt: fourHoursAgo },
  };

  const count = await ConnectionRequestModel.countDocuments(filter);

  await ConnectionRequestModel.deleteMany(filter);

  return count;
};

export { deleteIgnoredRejectedService };
