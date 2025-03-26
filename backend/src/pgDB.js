import pgPool from "./api/models/postgresDB.js";

export const setupPG = async () => {
  try {
    // Create weight_transactions table
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

    // Create click_transactinos table
    await pgPool.query(
      `CREATE TABLE IF NOT EXISTS 
        click_transactions(
        user_id TEXT NOT NULL,
        click_datetime TIMESTAMP NOT NULL,
        company_name text NOT NULL
        )`
    );

    // Delete company_stock_data table if it exists
    await pgPool.query(`DROP TABLE IF EXISTS company_stock_data`);

    // Creates company_stock_data table
    await pgPool.query(
      `CREATE TABLE 
        company_stock_data(
        company_name TEXT NOT NULL,
        price_date TIMESTAMP NOT NULL,
        price_type TEXT NOT NULL,
        price FLOAT NOT NULL
      )`
    );

    // Fills up company_stock_data table with the .csv file
    await pgPool.query(
      `COPY company_stock_data 
      FROM '/var/lib/postgresql/data/companies_stock_price_data.csv' 
      DELIMITER ',' CSV HEADER
      `
    );

    console.log("All tables successfully created in Postgres DB");
  } catch (error) {
    console.error("Table creation error:", error);
  }
};

export default setupPG;
