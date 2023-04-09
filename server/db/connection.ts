// https://www.mongodb.com/compatibility/using-typescript-with-mongodb-tutorial

// External Dependencies

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
//validation to our existing clients
/*
 await db.command({
    "collMod": process.env.USER_CLIENT_NAME,
    "validator": {
        $jsonSchema: {
            bsonType: "object",
            required: [
                "name", 
                "company", 
                "email", 
                "phone", 
                "street", 
                "city",                
                "state", 
                "zip", 
                "login", 
                "password" 
                ],
            additionalProperties: true,
            properties: {
            _id: {},
            name: {
                bsonType: "string",
                description: "'name' is required and is a string"
            },
            company: {
                bsonType: "string",
                description: "'company' is required and is a string"
            },
            email: {
                bsonType: "string",
                description: "'email' is required and is a string"
            },
            phone: {
                bsonType: "string",
                description: "'phone' is required and is a string"
            },
            street: {
                bsonType: "string",
                description: "'steet' is required and is a string"
            },
            street2: {
                bsonType: "string",
                description: "'steet2' is optional and is a string"
            },
            city: {
                bsonType: "string",
                description: "'email' is required and is a string"
            },
            category: {
                bsonType: "string",
                description: "'city' is required and is a string"
            },
            state: {
                bsonType: "string",
                description: "'state' is required and is a string"
            },
            zip: {
                bsonType: "number",
                description: "'zip' is required and is a string"
            }
            }
        }
     }
     
});
*/
