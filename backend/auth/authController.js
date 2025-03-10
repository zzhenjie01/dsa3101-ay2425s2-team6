import User from "./createUserCredentialsCollection.js";
import { hashPassword, comparePassword } from "./authHelper.js";
import jwt from "jsonwebtoken";

// JWT Secret
const JWT_SECRET = process.env.JWT_KEY;

export const registerUser = async (req, res) => {
  try {
    const { email, password, cpassword } = req.body;

    // Check if email is present
    if (!email) {
      return res.json({
        error: "Email is required.",
      });
    }

    // Check if password is present
    if (!password) {
      return res.json({
        error: "Password is required.",
      });
    }

    // Check if the password and compare passwords are equal
    if (password != cpassword) {
      return res.json({
        error: "Passwords do not match.",
      });
    }

    // Check if email is already present in our database
    const emailExists = await User.findOne({ email: email });
    if (emailExists) {
      return res.json({
        error: "Email is already taken.",
      });
    }

    // Hash our password using own defined functions
    const hashedPassword = await hashPassword(password);

    // Create user in database
    const user = await User.create({
      email,
      password: hashedPassword,
    });

    return res.json(user);
  } catch (error) {
    console.log(error);
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists in database
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({
        error: "User not found. Please try again",
      });
    }

    // Check if passwords match with one in the database
    const match = await comparePassword(password, user.password);
    if (match) {
      jwt.sign(
        { email: user.email, id: user._id },
        JWT_SECRET,
        {},
        (err, token) => {
          if (err) {
            throw err;
          }
          res.cookie("token", token).json(user);
        }
      );
    }

    if (!match) {
      return res.json({
        error: "Password is incorrect. Please try again.",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

export const getProfile = (req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, JWT_SECRET, {}, (err, user) => {
      if (err) {
        throw err;
      }
      res.json(user);
    });
  } else {
    res.json("Request Cookie not found");
  }
};

export default {
  registerUser,
  loginUser,
  getProfile,
};
