import User from "./userModel.js";
import { hashPassword, comparePassword } from "./authHelper.js";
import jwt from "jsonwebtoken";
import { guestProfile } from "./guestProfile.js";
import { client } from "./postgresDB.js";

// JWT Secret
const JWT_SECRET = process.env.JWT_KEY;

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, cpassword } = req.body;

    const errors = [];

    // Check if name is present and less than 20 characters
    if (!name) {
      errors.push("Name is required.");
    } else if (name.length > 20) {
      errors.push("Name must be less than 20 characters.");
    }

    // Check if email is present
    if (!email) {
      errors.push("Email is required.");
    }

    // Check if password is present
    if (!password) {
      errors.push("Password is required.");
    }

    // Check if confirm password is present
    if (!cpassword) {
      errors.push("Confirm Password is required.");
    }

    // Check if the password and compare passwords are equal
    if (password && cpassword && password != cpassword) {
      errors.push("Passwords do not match.");
    }

    if (errors.length !== 0) {
      return res.json({
        error: errors,
      });
    }

    // Check if email is already present in our database
    const emailExists = await User.findOne({ email: email });
    if (emailExists) {
      return res.json({
        error: ["Email is already taken."],
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

    const errors = [];

    // Check if email is present
    if (!email) {
      errors.push("Email is required.");
    }

    // Check if password is present
    if (!password) {
      errors.push("Password is required.");
    }

    if (errors.length !== 0) {
      return res.json({
        error: errors,
      });
    }

    // Check if user exists in database
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.json({
        error: ["User not found. Please try again"],
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

export const insertWeights = async (req, res) => {
  try {
    const user = req.body;
    const userExists = await User.findById(user._id);
    if (userExists) {
      await client.query(
        `
        INSERT INTO weight_transactions
          (user_id, 
          transaction_datetime, 
          environmental_weight, 
          social_weight, 
          governance_weight)
        VALUES
          (_$1, NOW(), $2, $3, $4)
        `,
        [
          user._id.toString(), // value cannot start with a digit
          user.environmentalWeight,
          user.socialWeight,
          user.governanceWeight,
        ]
      );

      res.json("Weights successfully inserted into postgres.");
    } else {
      res.json("Guest User detected.");
    }
  } catch (error) {
    console.log("Error with inserting weights into postgres:", error);
    res
      .status(500)
      .json({ error: "An error occurred while inserting Weights." });
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

export const getAvgWeights = async (req, res) => {
  try {
    const user = req.body;
    const userExists = await User.findById(user._id);
    if (userExists) {
      const data = await client.query(
        `
        SELECT
        AVG(environmental_weight) AS avg_environmental_weight,
        AVG(social_weight) AS avg_social_weight,
        AVG(governance_weight) AS avg_governance_weight
        FROM 
          (SELECT * FROM weight_transactions
          WHERE user_id = $1
          ORDER BY transaction_datetime DESC
          LIMIT 5)
        GROUP BY user_id
        `,
        [`_${user._id.toString()}`]
      );

      const result = data.rows[0];

      return res.json({
        environmentalWeight: result.avg_environmental_weight,
        socialWeight: result.avg_social_weight,
        governanceWeight: result.avg_governance_weight,
      });
    } else {
      // User not found in db - Guest
      return res.json({
        environmentalWeight: user.environmentalWeight,
        socialWeight: user.socialWeight,
        governanceWeight: user.governanceWeight,
      });
    }
  } catch (error) {
    console.log("Error getting average weights", error);
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
  insertWeights,
  getProfile,
  getAvgWeights,
  updateProfile,
};
