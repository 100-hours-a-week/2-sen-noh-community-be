const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

// 포트 설정
const port = 3000;

// GET 요청 처리 (게시글 목록 반환)
app.get('/posts', (req, res) => {
    const filePath = path.join(__dirname, 'posts.json');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            res.status(500).json({ message: '파일 오류' });
            return;
        }

        const posts = JSON.parse(data);
        const simplifiedPosts = posts.map(post => ({
            post_id: post.post_id,
            title: post.title,
            user_id: post.user_id,
            profile_image: post.profile_image,
            nickname: post.nickname,
            heart_cnt: post.heart_cnt,
            chat_cnt: post.chat_cnt,
            visit_cnt: post.visit_cnt,
            date: post.date,
        }));

        res.status(200).json({
            message: '게시글 목록',
            data: simplifiedPosts,
        });
    });
});

app.get('/posts/:postId', (req, res) => {
    const { postId } = req.params;

    const filePath = path.join(__dirname, 'posts.json');

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            res.status(500).json({ message: '파일 오류' });
            return;
        }

        const posts = JSON.parse(data);
        const post = posts.find(p => p.post_id === parseInt(postId, 10));

        if (post) {
            res.status(200).json({
                message: '게시글 목록',
                data: post,
            });
        } else {
            res.status(404).json({
                message: '게시글 없음',
            });
        }
    });
});

app.get('/posts/:postId/comments', (req, res) => {
    const { postId } = req.params;
    const filePath = path.join(__dirname, 'comments.json');

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            res.status(500).json({ message: '파일 오류' });
            return;
        }

        const comments = JSON.parse(data);
        const comment = comments
            .filter(c => c.post_id === parseInt(postId, 10))
            .map(c => ({
                comment_id: c.comment_id,
                user_id: c.user_id,
                nickname: c.nickname,
                profile_image: c.profile_image,
                date: c.date,
                comment: c.comment,
            }));
        res.status(200).json({
            message: 'ok',
            data: comment,
        });
    });
});

// 서버 실행
app.listen(port, () => {
    console.log(`서버가 http://localhost:${port}에서 실행 중입니다.`);
});
