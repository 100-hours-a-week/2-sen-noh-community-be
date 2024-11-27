import timeout from 'connect-timeout';

export const timeoutMiddleware = timeout('5s');

export const timeoutHandler = (req, res, next) => {
    if (!req.timedout) next();
};
