import mongoose, { Schema, Model } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { IPhotos, IUser } from '@/types/models/user';

interface TypedValidatorProps<T> {
  path: string;
  value: T;
  type: string;
  reason?: Error;
}

// -------------------------
// Photo Schema definition
// -------------------------

const photoSchema = new Schema<IPhotos>(
  {
    url: {
      type: String,
      // required: true,
      validate: {
        validator: (value: string) => validator.isURL(value),
        message: (props: TypedValidatorProps<string[]>) =>
          `Invalid photo URL(s): ${props.value.join(', ')}`,
      },
    },
    public_id: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

// -------------------------
// Schema definition
// -------------------------
const userSchema = new Schema<IUser>(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      validate(value: string) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email Id: ' + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      // validate(value: string) {
      //   if (!validator.isStrongPassword(value)) {
      //     throw new Error('Enter a strong password: ' + value);
      //   }
      // },
    },
    dateOfBirth: {
      type: String,
      required: true,
      match: /^\d{2}\/\d{2}\/\d{4}$/,
    },
    city: {
      type: String,
      required: true,
    },

    gender: {
      type: String,
      enum: {
        values: ['male', 'female', 'non-binary', 'custom'],
        message: `{VALUE} is not a valid gender type!`,
      },
    },
    photoUrl: {
      type: [photoSchema],
      validate: {
        validator: (arr) => arr.length <= 6,
        message: 'You can upload a maximum of 6 photos',
      },
    },

    interest: {
      type: [String],
      enum: {
        values: ['men', 'women', 'everyone'],
        message: `{VALUE} is not a valid interest type!`,
      },
    },
    profession: {
      type: String,
    },
    organization: {
      type: String,
    },
    education: {
      type: String,
    },
    bio: {
      type: String,
    },
    lookingFor: {
      type: [String],
    },
    preferredAge: {
      min: { type: Number },
      max: { type: Number },
    },
    preferredDistance: {
      type: Number,
    },
  },
  { timestamps: true }
);

// Index for fast query
userSchema.index({ firstName: 1 });

// -------------------------
// Methods
// -------------------------
userSchema.methods.getJWT = async function (): Promise<string> {
  const user = this as IUser;

  if (!process.env.SECRET_TOKEN) {
    throw new Error('SECRET_TOKEN not defined in environment variables');
  }

  const token = jwt.sign({ _id: user._id }, process.env.SECRET_TOKEN, { expiresIn: '1d' });

  return token;
};

userSchema.methods.validatePassword = async function (
  passwordInputByUser: string
): Promise<boolean> {
  const user = this as IUser;
  return bcrypt.compare(passwordInputByUser, user.password);
};

// -------------------------
// Model export
// -------------------------
const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);
export default User;
