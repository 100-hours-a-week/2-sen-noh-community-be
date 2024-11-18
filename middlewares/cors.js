const cors = require('cors');

const corsMiddleware = cors({
    origin: '*',  // 클라이언트가 요청을 보내는 도메인과 포트
    methods: ['GET', 'POST',  'DELETE', 'PATCH', ],  // 허용할 HTTP 메소드
    allowedHeaders: ['Content-Type', 'Authorization'], 
    credentials: true, 
})

module.exports = corsMiddleware;