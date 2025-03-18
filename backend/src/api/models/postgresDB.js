import pg from "pg";

const pg_user = process.env.POSTGRES_USER;
const pg_password = process.env.POSTGRES_PASSWORD;

export const client = new pg.Client({
  host: "localhost",
  user: pg_user,
  port: 5432,
  password: pg_password,
  database: "postgres",
});

client.connect();

export default client;
