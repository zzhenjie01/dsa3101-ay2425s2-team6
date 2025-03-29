import User from "../models/userModel.js";
import pgPool from "../models/postgresDB.js";
import { getCosineSimilarity, getAllUserTopCompanies } from "./clickHelper.js";

export const insertClick = async (req, res) => {
  try {
    const { user, companyName } = req.body;
    const userExists = await User.findById(user._id);
    if (userExists) {
      await pgPool.query(
        `
        INSERT INTO click_transactions
          (user_id,
          click_datetime, 
          company_name)
        VALUES
          ($1, NOW(), $2)
        `,
        [
          `_${user._id.toString()}`, // value cannot start with a digit
          companyName,
        ]
      );

      res.json("Company click successfully inserted into postgres.");
    } else {
      res.json("Guest User detected.");
    }
  } catch (error) {
    console.log("Error with inserting click into postgres:", error);
    res
      .status(500)
      .json({ error: "An error occurred while inserting clicks." });
  }
};

export const getUserRecommendations = async (req, res) => {
  try {
    const { userAvgWeights, allOtherAvgWeights } = req.query;
    const allUserTopCompanies = await getAllUserTopCompanies();

    // Get the user rankings based on their cosine similarity
    const userRankings = allOtherAvgWeights.reduce((acc, otherUser) => {
      const otherWeights = {
        environmentalWeight: otherUser.avg_environmental_weight,
        socialWeight: otherUser.avg_social_weight,
        governanceWeight: otherUser.avg_governance_weight,
      };

      acc[otherUser.user_id] = getCosineSimilarity(
        userAvgWeights,
        otherWeights
      );
      return acc;
    }, {});

    // Get the top 3 most similar users
    const similarUsers = Object.entries(userRankings)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3) // Get top 3 matches;
      .map(([userId]) => userId); // get only user ids

    // Create mappings for each user and their respective first, second and third companies
    const userCompaniesMap = allUserTopCompanies.reduce((acc, entry) => {
      acc[entry.user_id] = [
        entry.first_company,
        entry.second_company,
        entry.third_company,
      ];
      return acc;
    }, {});

    const companyRankings = similarUsers.reduce((acc, userId, rankIndex) => {
      const companies = userCompaniesMap[userId] || [];
      const reciprocalRank = 1 / (rankIndex + 1);

      companies.forEach((company, position) => {
        if (!company) return; // if company is null, return
        const weight = [5, 4, 3, 2, 1][position] * reciprocalRank;
        acc[company] = (acc[company] || 0) + weight;
      });

      return acc;
    }, {});

    const finalRecommendations = Object.entries(companyRankings)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5) // Get top 5 matches;
      .map(([company]) => company); // get only company names

    res.json(finalRecommendations);
  } catch (error) {
    console.error("Error getting User Reccomendations:", error);
    res.status(500).json({ error: "Failed to generate recommendations" });
  }
};

export default {
  insertClick,
  getUserRecommendations,
};
