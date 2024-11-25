const express = require('express');
const { timeoutMiddleware, timeoutHandler } = require('../middlewares/timeout');
const cspMiddleware = require('../middlewares/csp');
const corsMiddleware = require('../middlewares/cors');
const loggerMiddleware = require('../middlewares/logger'); 
const { generalLimiter, getLimiter } = require('../middlewares/rateLimit');

const router = express.Router();

router.use(timeoutMiddleware);
router.use(timeoutHandler);
router.use(cspMiddleware);
router.use(corsMiddleware);
router.use(loggerMiddleware);
router.use(generalLimiter);

router.get('*', getLimiter, (req, res, next) => {
    next();
});

module.exports = router;
