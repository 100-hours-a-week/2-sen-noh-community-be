const morgan = require('morgan');
const rotatingFileStream = require('rotating-file-stream'); 
const path = require('path');
const fs = require('fs');
const moment = require('moment-timezone');

const logDirectory = path.join(__dirname, '../log');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

const accessLogStream = rotatingFileStream.createStream('access.log', {
    interval: '1d',
    path: logDirectory,
});

morgan.token('date', (request, response, timezone) => {
    return moment().tz(timezone).format('YYYY-MM-DD HH:mm:ss');
});

const loggerMiddleware = morgan(
    ':remote-addr - :remote-user [:date[Asia/Seoul]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"',
    { stream: accessLogStream }
);

module.exports = loggerMiddleware;
