import mongoose, { Model } from 'mongoose';

export interface IConnectionRequest extends Document {
  fromUserId: mongoose.Types.ObjectId;
  toUserId: mongoose.Types.ObjectId;
  status: 'interested' | 'ignored' | 'accepted' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // refernce to the user collection
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ['interested', 'ignored', 'accepted', 'rejected'],
        message: `{VALUE} is incurrent status.`,
      },
    },
  },
  { timestamps: true }
);

// this query is fast for this indexing { fromUserId: toUserId, toUserId: fromUserId },
// Compound index to fast the query
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

// # Using JS
// connectionRequestSchema.pre('save', function (next) {
//   const connectionRequest = this;

//   // fromUserId is same as to toUserId
//   if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
//     throw new Error("Can't send connection request your self!!!");
//   }

//   next();
// });

// ✅ Pre-save hook with proper typing
connectionRequestSchema.pre<IConnectionRequest>('save', function (next) {
  // ✅ use `this` directly — no aliasing needed
  if (this.fromUserId.equals(this.toUserId)) {
    throw new Error("Can't send connection request to yourself!");
  }

  next();
});

// const ConnectionRequestModel = new mongoose.model('ConnectionRequest', connectionRequestSchema);

const ConnectionRequestModel: Model<IConnectionRequest> = mongoose.model<IConnectionRequest>(
  'ConnectionRequest',
  connectionRequestSchema
);

export default ConnectionRequestModel;
