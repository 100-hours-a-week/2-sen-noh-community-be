import cors from 'cors';

export const corsMiddleware = cors({
    origin: 'http://localhost:3002',
    methods: ['GET', 'POST', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
});
