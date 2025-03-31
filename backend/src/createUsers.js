import User from "./api/models/userModel.js";
import pgPool from "./api/models/postgresDB.js";
import { hashPassword } from "./api/controllers/authHelper.js";

export const createUsers = async () => {
  const sampleUsers = [
    {
      name: "Environment",
      email: "environment@hotmail.com",
      password: "123",
      environmentalWeight: 100,
      socialWeight: 0,
      governanceWeight: 0,
      firstCompany: "Nubank",
      secondCompany: "BOQ",
      thirdCompany: "Bank of China",
      fourthCompany: "KrungThai Bank",
      fifthCompany: "DBS",
    },
    {
      name: "Social",
      email: "social@hotmail.com",
      password: "123",
      environmentalWeight: 0,
      socialWeight: 100,
      governanceWeight: 0,
      firstCompany: "DBS",
      secondCompany: "Woori Bank",
      thirdCompany: "HSBC",
      fourthCompany: "ANZ",
      fifthCompany: "KrungThai Bank",
    },
    {
      name: "Governance",
      email: "governance@hotmail.com",
      password: "123",
      environmentalWeight: 0,
      socialWeight: 0,
      governanceWeight: 100,
      firstCompany: "BOQ",
      secondCompany: "OCBC",
      thirdCompany: "Banco Santander",
      fourthCompany: "HSBC",
      fifthCompany: "Woori Bank",
    },
    {
      name: "Wellbeing",
      email: "wellbeing@hotmail.com",
      password: "123",
      environmentalWeight: 0,
      socialWeight: 100,
      governanceWeight: 50,
      firstCompany: "Woori Bank",
      secondCompany: "DBS",
      thirdCompany: "HSBC",
      fourthCompany: "BOQ",
      fifthCompany: "KrungThai Bank",
    },
    {
      name: "Higherup",
      email: "higherup@hotmail.com",
      password: "123",
      environmentalWeight: 33,
      socialWeight: 50,
      governanceWeight: 100,
      firstCompany: "BOQ",
      secondCompany: "HSBC",
      thirdCompany: "Woori Bank",
      fourthCompany: "OCBC",
      fifthCompany: "KrungThai Bank",
    },
  ];

  for (const sampleUser of sampleUsers) {
    // Check if the user already exists
    const userExists = await User.findOne({ email: sampleUser.email });
    if (!userExists) {
      const hashedPassword = await hashPassword(sampleUser.password); // hash password

      // Creates user if it does not already exist
      const user = await User.create({
        name: sampleUser.name,
        email: sampleUser.email,
        password: hashedPassword,
        environmentalWeight: sampleUser.environmentalWeight,
        socialWeight: sampleUser.socialWeight,
        governanceWeight: sampleUser.governanceWeight,
      });

      // Inserts into the weight transactions table 5 times so that its last 5 average weights will be that of its current weights
      for (var i = 0; i < 5; i++) {
        pgPool.query(
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
      }

      // Insert into click transactions table 5 times for the 1st company
      for (var i = 0; i < 5; i++) {
        pgPool.query(
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
            sampleUser.firstCompany,
          ]
        );
      }

      // Insert into click transactions table 4 times for the 2nd company
      for (var i = 0; i < 4; i++) {
        pgPool.query(
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
            sampleUser.secondCompany,
          ]
        );
      }

      // Insert into click transactions table 3 times for the 3rd company
      for (var i = 0; i < 3; i++) {
        pgPool.query(
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
            sampleUser.thirdCompany,
          ]
        );
      }

      // Insert into click transactions table 2 times for the 4th company
      for (var i = 0; i < 2; i++) {
        pgPool.query(
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
            sampleUser.fourthCompany,
          ]
        );
      }

      // Insert into click transactions table 1 time for the 5th company
      for (var i = 0; i < 3; i++) {
        pgPool.query(
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
            sampleUser.fifthCompany,
          ]
        );
      }
    }
  }

  console.log("Users Created Successfully");
};

export default createUsers;
