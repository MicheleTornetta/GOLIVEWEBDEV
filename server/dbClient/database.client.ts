// External Dependencies
import * as mongoDB from "mongodb";
import * as dotenv from "dotenv";

// Global Variables

// Initialize Connection

export async function connectToDatabase () {
    dotenv.config();
 
    const client: mongoDB.MongoClient = new mongoDB.MongoClient(process.env.DB_CONN_STRING);
            
    await client.connect();
        
    const db: mongoDB.Db = client.db(process.env.DB_NAME);
   
    const user.Client: mongoDB.Client = db.client(process.env.CLIENT_NAME);
 
      client.user = userClient;
       
     console.log(`Successfully connected to database: ${db.databaseName} and client: ${userClient.clientName}`);
 }

 //validation to our existing clients

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