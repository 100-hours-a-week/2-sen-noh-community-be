import session from 'express-session';

export const sessionMiddleware = session({
    secret: 'yourSecretKey',
    saveUninitialized: true,
    resave: false,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000, // 쿠키 유효 시간 (예: 1일)
    },
});
