import bcrypt from "bcrypt";
import pgPool from "../models/postgresDB.js";

export const hashPassword = (password) => {
  const saltLayers = 10;

  return new Promise((resolve, reject) => {
    bcrypt.genSalt(saltLayers, (err, salt) => {
      if (err) {
        reject(err);
      }
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) {
          reject(err);
        }
        resolve(hash);
      });
    });
  });
};

export const comparePassword = (password, hashed) => {
  return bcrypt.compare(password, hashed);
};

export const logWeights = async (user) => {
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
  console.log("Initial User Weights logged");
};

export default {
  hashPassword,
  comparePassword,
  logWeights,
};
