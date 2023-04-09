// https://www.mongodb.com/compatibility/using-typescript-with-mongodb-tutorial

// External Dependencies
// const Sequelize = require('sequelize');
import dotenv from "dotenv";
import postgres from "postgres";

// Global Variables

// Initialize Connection
dotenv.config({ path: "./vars.env" });

const sql = postgres({
  host: process.env.DB_HOST, // Postgres ip address[s] or domain name[s]
  port: Number(process.env.DB_PORT), // Postgres server port[s]
  database: process.env.DB_NAME, // Name of database to connect to
  username: process.env.DB_USER, // Username of database user
  password: process.env.DB_PASSWORD, // Password of database user
});

export default sql;
