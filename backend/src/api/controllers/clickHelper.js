import pgPool from "../models/postgresDB.js";

const normaliseWeights = (weights) => {
  const { environmentalWeight, socialWeight, governanceWeight } = weights;
  const totalWeight = Math.sqrt(
    Math.pow(environmentalWeight, 2) +
      Math.pow(socialWeight, 2) +
      Math.pow(governanceWeight, 2)
  );

  return {
    environmentalWeight: environmentalWeight / totalWeight,
    socialWeight: socialWeight / totalWeight,
    governanceWeight: governanceWeight / totalWeight,
  };
};

const dotProduct = (userWeights, otherWeights) => {
  return (
    userWeights.environmentalWeight * otherWeights.environmentalWeight +
    userWeights.socialWeight * otherWeights.socialWeight +
    userWeights.governanceWeight * otherWeights.governanceWeight
  );
};

export const getCosineSimilarity = (userWeights, otherWeights) => {
  const userNormalisedWeights = normaliseWeights(userWeights);
  const otherNormalisedWeights = normaliseWeights(otherWeights);

  return dotProduct(userNormalisedWeights, otherNormalisedWeights);
};

export const getAllUserTopCompanies = async () => {
  try {
    const data = await pgPool.query(
      `
      SELECT
      user_id,
      max(CASE WHEN company_rank = 1 THEN company_name ELSE null end) AS first_company,
      max(CASE WHEN company_rank = 2 THEN company_name ELSE null end) AS second_company,
      max(CASE WHEN company_rank = 3 THEN company_name ELSE null end) AS third_company
      FROM 
        (SELECT
        user_id,
        company_name,
        ROW_NUMBER() OVER(PARTITION BY user_id ORDER BY num_of_clicks DESC) company_rank
        FROM
          (SELECT 
            user_id,
            company_name,
            COUNT(DISTINCT click_datetime) AS num_of_clicks
          FROM click_transactions
          GROUP BY user_id, company_name
          )
        )
      GROUP BY user_id
      `
    );

    const result = data.rows;
    // console.log(result);

    return result;
  } catch (error) {
    console.error("Error getting the Top Companies", error);
  }
};

export default {
  getCosineSimilarity,
  getAllUserTopCompanies,
};
