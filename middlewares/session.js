import { RedisStore } from 'connect-redis';
import session from 'express-session';
import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const redisClient = createClient();

redisClient.connect().catch(console.error);

const redisStore = new RedisStore({
    client: redisClient,
});

export const sessionMiddleware = session({
    store: redisStore,
    secret: process.env.SESSION_SECRET || 'secret',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000, // 쿠키 유효 시간 (예: 1일)
    },
});

export const checkSession = (req, res, next) => {
    if (!req.session.userId) {
        return res.status(401).json({ message: '세션 만료' });
    }
    next();
};
