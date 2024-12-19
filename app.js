import express from 'express';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';
import commentRoutes from './routes/commentRoutes.js';
import middlewareRoutes from './routes/middlewareRoutes.js';
import { SERVER_URL } from './config/config.js';

const app = express();

const port = 3000;
app.use(express.json());

app.use(middlewareRoutes);

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/posts/:postId/comments', (req, res, next) => {
    const { postId } = req.params;
    req.postId = postId;
    next();
});
app.use('/api/posts/:postId/comments', commentRoutes);

app.use('/api/uploads', express.static('uploads'));

app.listen(port, () => {
    console.log(`서버가 ${SERVER_URL}에서 실행 중입니다.`);
});
