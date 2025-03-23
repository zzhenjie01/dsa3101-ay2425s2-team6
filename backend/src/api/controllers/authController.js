import User from "../models/userModel.js";
import { hashPassword, comparePassword, logWeights } from "./authHelper.js";
import jwt from "jsonwebtoken";
import guestProfile from "../models/guestProfile.js";

// JWT Secret
const JWT_SECRET = process.env.JWT_KEY;

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, cpassword } = req.body;

    const errors = [];
    const errorFields = [];

    // Check if name is present and less than 20 characters
    if (!name) {
      errors.push("Name is required.");
      errorFields.push("name");
    } else if (name.length > 20) {
      errors.push("Name must be less than 20 characters.");
      errorFields.push("name");
    }

    // Check if email is present
    if (!email) {
      errors.push("Email is required.");
      errorFields.push("email");
    }

    // Check if password is present
    if (!password) {
      errors.push("Password is required.");
      errorFields.push("password");
    }

    // Check if confirm password is present
    if (!cpassword) {
      errors.push("Confirm Password is required.");
      errorFields.push("cpassword");
    }

    // Check if the password and compare passwords are equal
    if (password && cpassword && password != cpassword) {
      errors.push("Passwords do not match.");
      errorFields.push("password");
      errorFields.push("cpassword");
    }

    if (errors.length !== 0) {
      return res.json({
        error: errors,
        errorFields: errorFields,
      });
    }

    // Check if email is already present in our database
    const emailExists = await User.findOne({ email: email });
    if (emailExists) {
      return res.json({
        error: ["Email is already taken."],
        errorFields: ["email"],
      });
    }

    // Hash our password using own defined functions
    const hashedPassword = await hashPassword(password);

    // Create user in database
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    logWeights(user);

    return res.json(user);
  } catch (error) {
    console.log(error);
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const errors = [];
    const errorFields = [];

    // Check if email is present
    if (!email) {
      errors.push("Email is required.");
      errorFields.push("email");
    }

    // Check if password is present
    if (!password) {
      errors.push("Password is required.");
      errorFields.push("password");
    }

    if (errors.length !== 0) {
      return res.json({
        error: errors,
        errorFields: errorFields,
      });
    }

    // Check if user exists in database
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.json({
        error: ["User not found. Please try again"],
        errorFields: ["email"],
      });
    }

    // Check if passwords match with one in the database
    const match = await comparePassword(password, user.password);
    if (match) {
      jwt.sign(
        { _id: user._id },
        JWT_SECRET,
        { expiresIn: "1h" },
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
        error: ["Password is incorrect. Please try again."],
        errorFields: ["password"],
      });
    }
  } catch (error) {
    console.log(error);
  }
};

export const logoutUser = (req, res) => {
  try {
    // Clear the token cookie
    res.clearCookie("token");

    // Return a success message
    res.json({
      message: "User logged out successfully.",
    });
  } catch (error) {
    console.error("Error logging out user:", error);
    res.status(500).json({
      error: "An error occurred while logging out.",
    });
  }
};

export const getProfile = (req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, JWT_SECRET, {}, async (err, user) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          // Clear the expired token cookie
          res.clearCookie("token");
          res.status(401).json({
            error: "Session expired. Please log in again.",
          });
        } else {
          // Handle other JWT errors (e.g., invalid token)
          res.status(400).json({ error: "Invalid token" });
        }
      } else {
        const fetchedUser = await User.findById(user._id);
        if (fetchedUser) {
          res.json(fetchedUser);
        } else {
          res.json(guestProfile);
        }
      }
    });
  } else {
    // Return the guest profile if no token is found
    res.json(guestProfile);
  }
};

export const updateProfile = async (req, res) => {
  try {
    const user = req.body;
    const userExists = await User.findById(user._id);
    if (userExists) {
      await User.replaceOne({ _id: user._id }, user);
      res.json("User Successfully Updated.");
    } else {
      res.json("Guest User Detected.");
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the profile." });
  }
};

export default {
  registerUser,
  loginUser,
  logoutUser,
  getProfile,
  updateProfile,
};
