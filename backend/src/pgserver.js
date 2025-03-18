import client from "./api/models/postgresDB.js";

export const createAllTables = async () => {
  try {
    await client.query(
      `CREATE TABLE IF NOT EXISTS 
        weight_transactions(
        user_id text NOT NULL,
        transaction_datetime TIMESTAMP NOT NULL,
        environmental_weight INTEGER NOT NULL,
        social_weight INTEGER NOT NULL,
        governance_weight INTEGER NOT NULL
        )`
    );

    console.log("All tables successfully created in Postgres DB");
  } catch (error) {
    console.error("Table creation error:", error);
  }
};

export default createAllTables;
