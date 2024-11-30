import helmet from 'helmet';

export const helmetMiddleware = helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'"], // 외부 스크립트 도메인 추가 가능
            styleSrc: ["'self'"], // 외부 스타일시트 도메인 추가 가능
            imgSrc: ["'self'", 'http://localhost:3000'], // 이미지 로드 허용 도메인
            connectSrc: ["'self'"],
            frameSrc: ["'none'"],
            objectSrc: ["'none'"],
        },
    },
    crossOriginResourcePolicy: { policy: 'same-site' },
});
