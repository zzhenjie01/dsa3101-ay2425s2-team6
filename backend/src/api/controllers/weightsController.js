import User from "../models/userModel.js";
import pgPool from "../models/postgresDB.js";

/* 
Contains all the functions for the /weights API route
Currently using Axios and Express server for API handling
The API routes can be found in its respective file in the /routes folder
*/

export const insertWeights = async (req, res) => {
  try {
    const user = req.body;
    const userExists = await User.findById(user._id);

    // Check if the user exists in our collections. If so, we will insert the weight transaction
    if (userExists) {
      await pgPool.query(
        `
        INSERT INTO weight_transactions
          (user_id, 
          transaction_datetime, 
          environmental_weight, 
          social_weight, 
          governance_weight)
        VALUES
          ($1, NOW(), $2, $3, $4)
        `,
        [
          `_${user._id.toString()}`, // value cannot start with a digit
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

export const getUserAvgWeights = async (req, res) => {
  try {
    const user = req.query.user;
    const userExists = await User.findById(user._id);

    // If the user exists in our collections, we will simply do a sql query to retrieve the user's average weights based on the latest 5 transactions
    if (userExists) {
      const data = await pgPool.query(
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

      const output = {
        environmentalWeight: result.avg_environmental_weight,
        socialWeight: result.avg_social_weight,
        governanceWeight: result.avg_governance_weight,
      };

      return res.json(output);
    } else {
      // User not found in our collections - Guest / Will just return the weights as it is
      return res.json({
        environmentalWeight: user.environmentalWeight,
        socialWeight: user.socialWeight,
        governanceWeight: user.governanceWeight,
      });
    }
  } catch (error) {
    console.error("Error getting average weights", error);
  }
};

export const getAllOtherAvgWeights = async (req, res) => {
  try {
    const user = req.query.user;
    const user_id = user._id || "";

    // We will simply execute a sql query to get all other users' average weights based on their last 5 weights configurations
    // This will work even for Guests, since all users in our collection will always have an id
    const data = await pgPool.query(
      `
      SELECT
      user_id,
      AVG(environmental_weight) AS avg_environmental_weight,
      AVG(social_weight) AS avg_social_weight,
      AVG(governance_weight) AS avg_governance_weight
      FROM 
        (SELECT 
          *,
          ROW_NUMBER() OVER(PARTITION BY user_id ORDER BY transaction_datetime DESC) row_num
        FROM weight_transactions
        )
      WHERE row_num <= 5
      AND user_id <> $1
      GROUP BY user_id
      `,
      [`_${user_id.toString()}`]
    );

    const result = data.rows;
    res.json(result);
  } catch (error) {
    console.error("Error getting all average weights", error);
  }
};

export default {
  insertWeights,
  getUserAvgWeights,
  getAllOtherAvgWeights,
};
