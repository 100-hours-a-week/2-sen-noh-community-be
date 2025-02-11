import express from 'express';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';
import commentRoutes from './routes/commentRoutes.js';
import middlewareRoutes from './routes/middlewareRoutes.js';
import { SERVER_URL } from './config/config.js';
import client from 'prom-client';

const app = express();
const port = 3000;

// Prometheus 메트릭 수집 설정
const { collectDefaultMetrics, register, Counter, Histogram } = client;
collectDefaultMetrics({ timeout: 5000 });

const httpRequestsTotal = new Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'route', 'status'],
});

const httpRequestDuration = new Histogram({
    name: 'http_request_duration_seconds',
    help: 'HTTP request duration in seconds',
    labelNames: ['method', 'route', 'status'],
    buckets: [0.1, 0.3, 0.5, 1, 2, 5, 10], // 응답 시간 분포
});

const httpRequestsErrorsTotal = new Counter({
    name: 'http_requests_errors_total',
    help: 'Total number of HTTP request errors',
    labelNames: ['method', 'route', 'status'],
});

app.use((req, res, next) => {
    const start = Date.now();

    res.on('finish', () => {
        const duration = (Date.now() - start) / 1000;
        const route = req.route ? req.route.path : req.path;
        const status = res.statusCode;

        httpRequestsTotal.inc({ method: req.method, route, status });
        httpRequestDuration.observe(
            { method: req.method, route, status },
            duration,
        );

        if (status >= 400) {
            httpRequestsErrorsTotal.inc({ method: req.method, route, status });
        }
    });

    next();
});

// /metrics 엔드포인트 추가
app.get('/metrics', async (req, res) => {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
});

app.use(express.json());

app.use(middlewareRoutes);

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/posts', postRoutes);
app.use('/posts/:postId/comments', (req, res, next) => {
    const { postId } = req.params;
    req.postId = postId;
    next();
});
app.use('/posts/:postId/comments', commentRoutes);

app.use('/uploads', express.static('uploads'));

app.listen(port, () => {
    console.log(`서버가 ${SERVER_URL}에서 실행 중입니다.`);
});
