// External Dependencies
import dotenv from "dotenv";
import postgres from "postgres";

dotenv.config({ path: "./vars.env" });

const IS_PROD = process.env.NODE_ENV === 'production';

const sql = postgres({
  host: process.env.DB_HOST, // Postgres ip address[s] or domain name[s]
  port: Number(process.env.DB_PORT), // Postgres server port[s]
  database: process.env.DB_NAME, // Name of database to connect to
  username: process.env.DB_USER, // Username of database user
  password: process.env.DB_PASSWORD, // Password of database user
  ssl: IS_PROD ? 'require' : false,
});

export default sql;
