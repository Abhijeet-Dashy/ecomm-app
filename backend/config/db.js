import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";
dotenv.config();

const { PGHOST, PGDATABASE, PGPASSWORD, PGUSER } = process.env;
//CREATES A SQL CONNECTION
export const sql = neon(
  `postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE}?sslmode=require&channel_binding=require`
);
