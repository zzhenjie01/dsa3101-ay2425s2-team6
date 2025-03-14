import User from "./userModel.js";
import { hashPassword, comparePassword } from "./authHelper.js";
import jwt from "jsonwebtoken";
import { guestProfile } from "./guestProfile.js";

// JWT Secret
const JWT_SECRET = process.env.JWT_KEY;

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, cpassword } = req.body;

    const errors = {
      error: [],
    };
    // Check if name is present
    if (!name) {
      // return res.json({
      //   error: "Name is required.",
      // });
      errors[error].add("Name is required.");
    }

    if (name.length > 20) {
      return res.json({
        error: "Name must be less than 20 characters.",
      });
    }

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
      name,
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

    // Check if email is present
    if (!email) {
      res.json({
        error: "Email is required.",
      });
    }

    // Check if password is present
    if (!password) {
      res.json({
        error: "Password is required.",
      });
    }

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
        error: "Password is incorrect. Please try again.",
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
        const fetchedUser = await User.findOne({ email: user.email });
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
    const userExists = await User.findOne({ email: user.email });
    if (userExists) {
      await User.replaceOne({ email: user.email }, user);
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
