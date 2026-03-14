import sql from "mssql";
import { ENV, NODE_ENV } from "./env.environment";


const dbConfig: sql.config = {
   server: ENV[NODE_ENV].DB_HOST,
   database: ENV[NODE_ENV].DB_NAME,
   user: ENV[NODE_ENV].DB_USER,
   password: ENV[NODE_ENV].DB_PASSWORD,
   port: ENV[NODE_ENV].DB_PORT,
   options: {
      encrypt: false,                
      trustServerCertificate: true 
    }
};


export const connectDB = async () => {
   try {
    const connection = await sql.connect(dbConfig);
   if(!connection){
      console.log(`Error connecting database`);
      return false;
   }
   console.log("Database Connected Sucessfully");
   await connection.request().query(`IF DB_ID('auth') IS NULL CREATE DATABASE auth`);
   return true;
   } catch (error: unknown) {
      console.log(`Error connecting database ${error instanceof Error ? error.message : "Failed to connect database"}`);
      return false;
   }
}