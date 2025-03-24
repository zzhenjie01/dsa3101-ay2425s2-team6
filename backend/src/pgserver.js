import pgPool from "./api/models/postgresDB.js";

export const createAllTables = async () => {
  try {
    await pgPool.query(
      `CREATE TABLE IF NOT EXISTS 
        weight_transactions(
        user_id TEXT NOT NULL,
        transaction_datetime TIMESTAMP NOT NULL,
        environmental_weight INTEGER NOT NULL,
        social_weight INTEGER NOT NULL,
        governance_weight INTEGER NOT NULL
        )`
    );

    await pgPool.query(
      `CREATE TABLE IF NOT EXISTS 
        click_transactions(
        user_id TEXT NOT NULL,
        click_datetime TIMESTAMP NOT NULL,
        company_name text NOT NULL
        )`
    );

    await pgPool.query(
      `CREATE TABLE IF NOT EXISTS 
        company_stock_data(
        company_name TEXT NOT NULL,
        price_type TEXT NOT NULL,
        price_date TIMESTAMP NOT NULL,
        price FLOAT NOT NULL
      )`
    );

    console.log("All tables successfully created in Postgres DB");
  } catch (error) {
    console.error("Table creation error:", error);
  }
};

export default createAllTables;
