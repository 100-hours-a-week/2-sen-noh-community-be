const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/posts.json');
const likeFilePath = path.join(__dirname, '../data/likes.json');

exports.getPost = (req, res) => {
    fs.readFile(filePath, 'utf-8', (err, data) => {
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
};

exports.getDetailPost = (req, res) => {
    const { postId } = req.params;

    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: '파일 오류' });
        }

        const posts = JSON.parse(data);
        const post = posts.find(p => p.post_id === parseInt(postId, 10));

        fs.readFile(likeFilePath, 'utf-8', (err, data) => {
            if (err) {
                return res.status(500).json({ message: '파일 오류' });
            }

            const likes = JSON.parse(data);

            // TODO - 세션 구현 뒤 user_id 받아와서 변경
            post.is_liked = likes.some(
                item =>
                    item.user_id === 1 && item.post_id === parseInt(postId, 10),
            );

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
};

const userFilePath = path.join(__dirname, '../data/user.json');

exports.addPost = (req, res) => {
    const { userId, title, content, postImage } = req.body;
    if (!userId || !title || !content) {
        return res.status(400).json({
            message: '필수안보냄',
        });
    }

    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: '파일 읽기 오류' });
        }

        const posts = JSON.parse(data);

        fs.readFile(userFilePath, 'utf-8', (err, data) => {
            if (err) {
                return res.status(500).json({ message: '유저 파일 읽기 오류' });
            }

            const users = JSON.parse(data);
            const userIndex = users.findIndex(
                users => users.user_id === parseInt(userId, 10),
            );

            const user = users[userIndex];
            const newPost = {
                post_id:
                    posts.length > 0 ? posts[posts.length - 1].post_id + 1 : 0,
                title,
                content,
                post_image: postImage !== undefined ? postImage : null,
                user_id: userId,
                nickname: user.nickname,
                profile_image: user.profile_image,
                heart_cnt: 0,
                comment_cnt: 0,
                visit_cnt: 0,
                date: new Date().toISOString(),
            };

            posts.push(newPost);

            fs.writeFile(
                filePath,
                JSON.stringify(posts, null, 4),
                'utf-8',
                err => {
                    if (err) {
                        return res
                            .status(500)
                            .json({ message: '파일 저장 오류' });
                    }

                    res.status(201).json({
                        message: '새 게시글 추가 완',
                    });
                },
            );
        });
    });
};

exports.updatePost = (req, res) => {
    const { postId } = req.params;
    const { title, content, userId, contentImage } = req.body;

    if (!userId) {
        return req.status(400).json({ message: '필수 요소 안넣음' });
    }

    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: '파일 읽기 오류' });
        }

        const posts = JSON.parse(data);

        const postIndex = posts.findIndex(
            post => post.post_id === parseInt(postId, 10),
        );

        if (postIndex === -1) {
            return res.status(404).json({ message: '게시글 찾을 수 없음' });
        }

        if (userId !== posts[postIndex].user_id) {
            return res.status(401).json({ message: '수정 권한 없음' });
        }

        if (title) {
            posts[postIndex].title = title;
        }

        if (content) {
            posts[postIndex].content = content;
        }

        if (contentImage) {
            posts[postIndex].content_image = contentImage;
        }

        fs.writeFile(filePath, JSON.stringify(posts, null, 4), 'utf-8', err => {
            if (err) {
                return res.status(500).json({ message: '파일 저장 오류' });
            }
            return res.status(200).json({
                message: '게시글 수정 완료',
            });
        });
    });
};

exports.deletePost = (req, res) => {
    const { postId } = req.params;

    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: '파일 읽기 오류' });
        }

        const posts = JSON.parse(data);

        const postIndex = posts.findIndex(
            post => post.post_id === parseInt(postId, 10),
        );

        if (postIndex === -1) {
            return res.status(404).json({ message: '찾을 수 없는 게시글' });
        }

        posts.splice(postIndex, 1);

        fs.writeFile(filePath, JSON.stringify(posts, null, 4), err => {
            if (err) {
                return res.status(500).json({ message: '파일 저장 오류' });
            }

            res.status(200).json({ message: '게시글 삭제 완료' });
        });
    });
};

exports.addLike = (req, res) => {
    const { postId } = req.params;
    const { userId } = req.body;

    fs.readFile(likeFilePath, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: '파일 열기 에러요' });
        }

        const likes = JSON.parse(data);

        if (
            likes.some(
                item =>
                    item.user_id === userId &&
                    item.post_id === parseInt(postId, 10),
            )
        ) {
            return res.status(200).json({ message: '이미 좋아요 눌렀습니다.' });
        }

        const newLike = {
            user_id: userId,
            post_id: parseInt(postId, 10),
        };

        likes.push(newLike);

        fs.writeFile(likeFilePath, JSON.stringify(likes, null, 4), err => {
            if (err) {
                return res.status(500).json({ message: '파일 쓰기 오류' });
            }

            return res.status(201).json({ message: '좋아요' });
        });
    });
};

exports.deleteLike = (req, res) => {
    const { postId } = req.params;
    const { userId } = req.body;

    fs.readFile(likeFilePath, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: '파일 열기 에러요' });
        }

        const likes = JSON.parse(data);

        if (
            !likes.some(
                item =>
                    item.user_id === userId &&
                    item.post_id === parseInt(postId, 10),
            )
        ) {
            return res
                .status(200)
                .json({ message: '이미 좋아요 취소했습니다.' });
        }

        const likeIndex = likes.findIndex(
            item =>
                item.user_id === userId &&
                item.post_id === parseInt(postId, 10),
        );

        likes.splice(likeIndex, 1);

        fs.writeFile(likeFilePath, JSON.stringify(likes, null, 4), err => {
            if (err) {
                return res.status(500).json({ message: '파일 쓰기 오류' });
            }

            return res.status(201).json({ message: '좋아요 취소' });
        });
    });
};