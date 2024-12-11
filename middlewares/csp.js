import helmet from 'helmet';
import { SERVER_URL } from '../config/config.js';

export const helmetMiddleware = helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'"], // 외부 스크립트 도메인 추가 가능
            styleSrc: ["'self'"], // 외부 스타일시트 도메인 추가 가능
            imgSrc: ["'self'", SERVER_URL], // 이미지 로드 허용 도메인
            connectSrc: ["'self'"],
            frameSrc: ["'none'"],
            objectSrc: ["'none'"],
        },
    },
    crossOriginResourcePolicy: { policy: 'cross-origin' },
});
