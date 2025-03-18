import User from "../models/userModel.js";
import client from "../models/postgresDB.js";

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

      console.log("Average Weights Returned");
      return res.json({
        environmentalWeight: result.avg_environmental_weight,
        socialWeight: result.avg_social_weight,
        governanceWeight: result.avg_governance_weight,
      });
    } else {
      // User not found in db - Guest / Will just return the weights as is
      // console.log("Current Weights Returned");

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

export const getAllAvgWeights = async (req, res) => {
  try {
    const data = await client.query(
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
      GROUP BY user_id
      `
    );

    const result = data.rows;
    // console.log("All Users Average Weights Returned");

    return res.json(result);
  } catch (error) {
    console.error("Error getting all average weights", error);
  }
};

export default {
  insertWeights,
  getUserAvgWeights,
  getAllAvgWeights,
};
