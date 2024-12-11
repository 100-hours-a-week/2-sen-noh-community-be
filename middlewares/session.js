import session from 'express-session';
import dotenv from 'dotenv';

dotenv.config();

export const sessionMiddleware = session({
    secret: process.env.SESSION_SECRET || 'secret',
    saveUninitialized: true,
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
