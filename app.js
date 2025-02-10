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
const { collectDefaultMetrics, register } = client;
collectDefaultMetrics({ timeout: 5000 });

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
