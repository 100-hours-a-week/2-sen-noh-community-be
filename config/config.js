import dotenv from 'dotenv';

dotenv.config();

export const SERVER_URL = process.env.SERVER_URL || 'http://localhost:3000/api';
export const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:8080';
