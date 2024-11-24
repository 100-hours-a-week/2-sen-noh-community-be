const rateLimit = require('express-rate-limit');

const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: '이 ip로부터 제한 시간에 너무 많은 요청이 왔다, 15분 뒤 다시 요청',
    skip: req => req.method === 'GET',
});

const getLimiter = rateLimit({
    window: 10 * 60 * 1000,
    max: 100,
    message: '이 ip로부터 너무 많은 요청이 왔다, 10분 뒤 다시 요청해주새요',
});

module.exports = {
    generalLimiter,
    getLimiter,
};
