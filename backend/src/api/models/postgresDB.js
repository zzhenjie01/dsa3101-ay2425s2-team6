import "dotenv/config";
import pg from "pg";

/*
Create postgreSQL worker pool and establish connection to the database
Can simply use the exported pool for querying in our database
*/

// pull the relevant details required for postgres
const pg_user = process.env.POSTGRES_USER;
const pg_password = process.env.POSTGRES_PASSWORD;
// define postgres worker pool
export const pgPool = new pg.Pool({
  host: "localhost",
  user: pg_user,
  port: 5678,
  password: pg_password,
  database: "postgres",
  idleTimeoutMillis: 30000, // worker will be disconnected after 30s of idleness
  connectionTimeoutMillis: 2000, // connection will timeout after connecting to client for 2s
});

// connect to the backend
pgPool.connect();

export default pgPool;
