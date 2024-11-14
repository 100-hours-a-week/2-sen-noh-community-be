const express = require('express');
const { timeoutMiddleware, timeoutHandler } = require('../middlewares/timeout');
const cspMiddleware = require('../middlewares/csp');
const { generalLimiter, getLimiter } = require('../middlewares/rateLimit');

const router = express.Router();

router.use(timeoutMiddleware);
router.use(timeoutHandler);
router.use(cspMiddleware);

router.use(generalLimiter);

router.get('*', getLimiter, (req, res, next) => {
    next();
});

module.exports = router;