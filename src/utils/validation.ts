import validator from 'validator';
import { Request } from 'express';

const validateSignUpData = (req: Request) => {
  // const { firstName, emailId, password } = req.body;
  const { firstName, emailId } = req.body;

  if (!firstName) {
    throw new Error('Name is not valid!');
  } else if (firstName.length < 4 || firstName.length > 50) {
    throw new Error('FirstName should be 4-50 charaters');
  } else if (!validator.isEmail(emailId)) {
    throw new Error('Email is not valid!');
  }
  // } else if (!validator.isStrongPassword(password)) {
  //   throw new Error('Password is not Strong');
  // }
};

const validateEditProfileData = (req: Request) => {
  const allowedEditFields = [
    'firstName',
    'lastName',
    'emailId',
    'age',
    'gender',
    'about',
    'skills',
    'city',
  ];

  const isEditAllowed = Object.keys(req.body).every((field) => allowedEditFields.includes(field));

  return isEditAllowed;
};

export { validateSignUpData, validateEditProfileData };
