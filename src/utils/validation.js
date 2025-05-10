const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, emailId, password } = req.body;

  if (!firstName) {
    throw new Error("Name is not valid!");
  } else if (firstName.length < 4 || firstName.length > 50) {
    throw new Error("FirstName should be 4-50 charaters");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Email is not valid!");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Password is not Strong");
  }
};

const validateEditProfileData = (req) => {
  const allowedEditFields = [
    "firstName",
    "lastName",
    "emailId",
    "age",
    "gender",
    "photoUrl",
    "about",
    "skills",
  ];

  const isEditAllowed = Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field)
  );

  return isEditAllowed;
};

module.exports = { validateSignUpData, validateEditProfileData };
