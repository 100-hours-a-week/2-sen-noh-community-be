import rateLimit from 'express-rate-limit';

export const generalLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 100,
    message: '이 ip로부터 제한 시간에 너무 많은 요청이 왔다, 10분 뒤 다시 요청',
    skip: req => req.method === 'GET',
});

export const getLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 200,
    message: '이 ip로부터 너무 많은 요청이 왔다, 5분 뒤 다시 요청해주새요',
});
