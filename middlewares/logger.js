import morgan, { token } from 'morgan';
import { createStream } from 'rotating-file-stream';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync, mkdirSync } from 'fs';
import moment from 'moment-timezone';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const logDirectory = join(__dirname, '../log');
existsSync(logDirectory) || mkdirSync(logDirectory);

const accessLogStream = createStream('access.log', {
    interval: '1d',
    path: logDirectory,
});

token('date', (request, response, timezone) => {
    return moment().tz(timezone).format('YYYY-MM-DD HH:mm:ss');
});

export const loggerMiddleware = morgan(
    ':remote-addr - :remote-user [:date[Asia/Seoul]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"',
    { stream: accessLogStream },
);
