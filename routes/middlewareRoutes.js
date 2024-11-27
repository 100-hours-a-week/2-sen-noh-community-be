import { Router } from 'express';
import { timeoutMiddleware, timeoutHandler } from '../middlewares/timeout.js';
import { cspMiddleware } from '../middlewares/csp.js';
import { corsMiddleware, corsM } from '../middlewares/cors.js';
import { loggerMiddleware } from '../middlewares/logger.js';
import { generalLimiter, getLimiter } from '../middlewares/rateLimit.js';
import { sessionMiddleware } from '../middlewares/session.js';

const router = Router();

router.use(timeoutMiddleware);
router.use(timeoutHandler);
router.use(cspMiddleware);
router.use(corsMiddleware);
router.options('*', corsM);
router.use(sessionMiddleware);
router.use(loggerMiddleware);
router.use(generalLimiter);

router.get('*', getLimiter, (req, res, next) => {
    next();
});

export default router;
