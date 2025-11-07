export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  firstName: string;
  lastName?: string;
  emailId: string;
  city: string;
  password: string;
  dateOfBirth?: number;
  gender?: 'male' | 'female' | 'other';
  photoUrl?: string[];
  interest?: 'male' | 'female' | 'non-binary' | 'custom';
  organization?: string;
  profession?: string;
  education?: string;
  bio?: string;
  lookingFor?: string[];
  preferredAge?: string;
  preferredDistance?: string;
  createdAt: Date;
  updatedAt: Date;

  getJWT(): Promise<string>;
  validatePassword(passwordInputByUser: string): Promise<boolean>;
}
