import { Pool } from 'pg';
import dotenv from 'dotenv';

//result var used for debugging, but the method left out intentionally
const result = dotenv.config({path: './../.env'}) //.env file should be in root dir (capstone-mockup)

export const pool = new Pool({
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    host: process.env.PGHOST,
    port: +process.env.PGPORT,
    database: process.env.PGDATABASE
});