const helmet = require('helmet');

const cspMiddleware = helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'"],
        // 외부 CDN 사용하면 해당 도메인 추가
        scriptSrc: ["'self"],
        // 외부 폰트 같은 거 사용할 때는 해당 도메인 추가
        styleSrc: ["'self"],
        imgSrc: ["'self"],
        connectSrc: ["'self"],
        frameSrc: ["'none"],
        objectSrc: ["'none"],
    },
});

module.exports = cspMiddleware;
