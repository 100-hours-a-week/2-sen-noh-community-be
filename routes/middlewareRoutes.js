import { Router } from 'express';
import { timeoutMiddleware, timeoutHandler } from '../middlewares/timeout.js';
import { helmetMiddleware } from '../middlewares/csp.js';
import { corsMiddleware } from '../middlewares/cors.js';
import {
    errorLoggerMiddleware,
    loggerMiddleware,
} from '../middlewares/logger.js';
import { generalLimiter, getLimiter } from '../middlewares/rateLimit.js';
import { sessionMiddleware } from '../middlewares/session.js';

const router = Router();

router.use(timeoutMiddleware);
router.use(timeoutHandler);
router.use(helmetMiddleware);
router.use(corsMiddleware);
router.use(sessionMiddleware);
router.use(loggerMiddleware);
router.use(errorLoggerMiddleware);
router.use(generalLimiter);

router.get('*', getLimiter, (req, res, next) => {
    next();
});

export default router;
