import cors from 'cors';
import dotenv from 'dotenv';
import { CLIENT_URL } from '../config/config.js';

dotenv.config();

export const corsMiddleware = cors({
    origin: CLIENT_URL,
    methods: ['GET', 'POST', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
});
