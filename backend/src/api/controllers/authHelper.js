import bcrypt from "bcrypt";
import pgPool from "../models/postgresDB.js";

/*
Contains some helper functions that will be used in the authController.js file
*/

export const hashPassword = (password) => {
  const saltLayers = 10; // determines the number of additional characters to be added into the text before hashing. The higher the number, the more secure the hash is

  return new Promise((resolve, reject) => {
    // generates the salt based on the number of salt layers
    bcrypt.genSalt(saltLayers, (err, salt) => {
      if (err) {
        reject(err);
      }
      // hashes the password and returns it
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
  // Use bcrypt's inbuilt compare method to compare the password string and the hashed password
  return bcrypt.compare(password, hashed);
};

export const logWeights = async (user) => {
  // To insert snapshot of weights of the specific user
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
