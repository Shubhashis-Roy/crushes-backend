import mongoose, { Document, Schema, Model } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// -------------------------
// Interface for User document
// -------------------------
export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  firstName: string;
  lastName?: string;
  emailId: string;
  city: string;
  password: string;
  age?: number;
  gender?: 'male' | 'female' | 'other';
  photoUrl?: string[];
  about?: string;
  skills?: string[];
  createdAt: Date;
  updatedAt: Date;

  getJWT(): Promise<string>;
  validatePassword(passwordInputByUser: string): Promise<boolean>;
}

interface TypedValidatorProps<T> {
  path: string;
  value: T;
  type: string;
  reason?: Error;
}

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
    city: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      validate(value: string) {
        if (!validator.isStrongPassword(value)) {
          throw new Error('Enter a strong password: ' + value);
        }
      },
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      enum: {
        values: ['male', 'female', 'other'],
        message: `{VALUE} is not a valid gender type!`,
      },
    },
    photoUrl: {
      type: [String],
      validate: {
        validator(arr: string[]) {
          return arr.every((url) => validator.isURL(url));
        },
        message: (props: TypedValidatorProps<string[]>) =>
          `Invalid photo URL(s): ${props.value.join(', ')}`,
      },
    },
    about: {
      type: String,
      default: 'This is a default about of user',
    },
    skills: {
      type: [String],
      default: ['default - JS'],
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
