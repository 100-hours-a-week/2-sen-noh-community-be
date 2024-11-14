const express = require('express');

const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');
const middlewareRoutes = require('./routes/middlewareRoutes');

const app = express();

const port = 3000;
app.use(express.json());

app.use(middlewareRoutes);

app.use('/posts', postRoutes);
app.use('/posts/:postId/comments', (req, res, next) => {
    const { postId } = req.params;
    req.postId = postId;
    next();
});
app.use('/posts/:postId/comments', commentRoutes);

app.listen(port, () => {
    console.log(`서버가 http://localhost:${port}에서 실행 중입니다.`);
});
