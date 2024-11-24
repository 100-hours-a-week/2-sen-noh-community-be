const timeout = require('connect-timeout');

const timeoutMiddleware = timeout('5s');

const timeoutHandler = (req, res, next) => {
    if (!req.timedout) next();
};

module.exports = {
    timeoutMiddleware,
    timeoutHandler,
};
