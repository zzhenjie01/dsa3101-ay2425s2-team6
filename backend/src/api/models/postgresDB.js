import pg from "pg";

const pg_user = process.env.POSTGRES_USER;
const pg_password = process.env.POSTGRES_PASSWORD;

export const pgPool = new pg.Pool({
  host: "localhost",
  user: pg_user,
  port: 5432,
  password: pg_password,
  database: "postgres",
  idleTimeoutMillis: 30000, // worker will be disconnected after 30s of idleness
  connectionTimeoutMillis: 2000, // connection will timeout after connecting to client for 2s
});

pgPool.connect();

export default pgPool;
