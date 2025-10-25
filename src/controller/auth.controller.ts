import validator from 'validator';
import bcrypt from 'bcrypt';
import { validateSignUpData } from '../utils/validation';
import { Request, Response } from 'express';
import User from '@/models/user.model';
import Chat from '@/models/chat.model';
import ConnectionRequest from '@/models/connectionRequest.model';

const register = async (req: Request, res: Response): Promise<void> => {
  // Encryt the password
  try {
    const { password, firstName, lastName, city, emailId, dob, gender, interest } = req.body;

    const alreadyPresentUser = await User.findOne({ emailId });

    if (alreadyPresentUser) {
      res.status(409).json({ message: 'Email already exists', alreadyPresentUser });
      return;
    }

    // Validation of data
    validateSignUpData(req);

    // Encryt the password
    const passwordHash = await bcrypt.hash(password, 10);

    // Creating a new instance of the User model
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
      dateOfBirth: dob,
      city,
      interest,
      gender,
    });

    const savedUser = await user.save();
    // Create a JWT token
    const token = await savedUser.getJWT();

    // Add the token to cookie & send the res back to the user
    res.cookie('token', token, {
      expires: new Date(Date.now() + 2 * 3600000),
    });

    res.status(200).send({ message: 'User Added Successfully!', data: savedUser });
  } catch (error) {
    // if (err.code === 11000) {
    //   res.status(400).send("Email already exists");
    // } else {
    //   res.status(400).send(`Signup Error: ${err.message}`);
    // }
    const message = error instanceof Error ? error.message : String(error);

    res.status(400).send(`Signup Error: ${message}`);
  }
};

const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { emailId, password } = req.body as { emailId: string; password: string };

    if (!validator.isEmail(emailId)) {
      throw new Error('Email Id not valid!');
    }

    const user = await User.findOne({ emailId });
    if (!user) {
      throw new Error('Email Id is not present!');
    }

    const isPasswordValid = await user.validatePassword(password);

    if (!isPasswordValid) {
      throw new Error('Password is not correct');
    }

    const token = await user.getJWT();

    res.cookie('token', token, {
      expires: new Date(Date.now() + 2 * 3600000),
      httpOnly: true,
      sameSite: 'lax',
    });

    // const userObj = user.toObject() as IUser;
    // delete (userObj as any).password;

    res.status(200).json(user);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    res.status(400).send(`Login API Error: ${message}`);
  }
};

const logout = async (req: Request, res: Response) => {
  res
    .cookie('token', null, {
      expires: new Date(Date.now()),
    })
    .send('Logout Successful!!');
};

const deleteUser = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized: user not found in request' });
  }
  const userId = req.user._id;

  try {
    const deleteUser = await User.findByIdAndDelete(userId);

    if (!deleteUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    await ConnectionRequest.findOneAndDelete({
      $or: [{ fromUserId: userId }, { toUserId: userId }],
    });

    await Chat.deleteMany({ 'messages.senderId': userId });

    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export { register, login, logout, deleteUser };
