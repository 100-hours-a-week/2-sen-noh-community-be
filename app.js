import express from 'express';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';
import commentRoutes from './routes/commentRoutes.js';
import middlewareRoutes from './routes/middlewareRoutes.js';

const app = express();

const port = 3000;
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
    console.log(`서버가 http://localhost:${port}에서 실행 중입니다.`);
});
