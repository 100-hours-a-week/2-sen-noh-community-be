const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/posts.json');
const likeFilePath = path.join(__dirname, '../data/likes.json');
const userFilePath = path.join(__dirname, '../data/users.json');

// TODO - post 순서 정하기
exports.getPost = (req, res) => {
    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            res.status(500).json({ message: '파일 오류' });
            return;
        }

        const posts = JSON.parse(data);

        fs.readFile(userFilePath, 'utf-8', (err, data) => {
            if (err) {
                res.status(500).json({ message: '파일 오류' });
                return;
            }

            const users = JSON.parse(data);

            const simplifiedPosts = posts.reverse().map(post => {
                const user = users.find(item => item.user_id === post.user_id);

                return {
                    post_id: post.post_id,
                    title: post.title,
                    user_id: post.user_id,
                    profile_image: user ? user.profile_image : null, // 유저 정보 연결
                    nickname: user ? user.nickname : '알 수 없음',
                    heart_cnt: post.heart_cnt,
                    comment_cnt: post.comment_cnt,
                    visit_cnt: post.visit_cnt,
                    date: post.date,
                };
            });

            res.status(200).json({
                message: '게시글 목록',
                data: simplifiedPosts,
            });
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

        if (!post) {
            return res.status(404).json({
                message: '게시글 없음',
            });
        }

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

            fs.readFile(userFilePath, 'utf-8', (err, data) => {
                if (err) {
                    res.status(500).json({ message: '파일 오류' });
                    return;
                }

                const users = JSON.parse(data);
                const user = users.find(item => item.user_id === post.user_id);

                post.nickname = user.nickname;
                post.profile_image = user.profile_image;

                post.visit_cnt += 1;

                fs.writeFile(filePath, JSON.stringify(posts, null, 4), err => {
                    if (err) {
                        console.error(err);
                    }
                });

                return res.status(200).json({
                    message: '게시글 목록',
                    data: post,
                });
            });
        });
    });
};

exports.addPost = (req, res) => {
    const { user_id, title, content, post_image } = req.body;
    if (!user_id || !title || !content) {
        return res.status(400).json({
            message: '필수안보냄',
        });
    }

    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: '파일 읽기 오류' });
        }

        const posts = JSON.parse(data);

        const postId =
            posts.length > 0 ? posts[posts.length - 1].post_id + 1 : 0;
        const newPost = {
            post_id: postId,
            title,
            content,
            post_image: post_image !== undefined ? post_image : null,
            user_id: user_id,
            heart_cnt: 0,
            comment_cnt: 0,
            visit_cnt: 0,
            date: new Date().toISOString(),
        };

        posts.push(newPost);

        fs.writeFile(filePath, JSON.stringify(posts, null, 4), 'utf-8', err => {
            if (err) {
                return res.status(500).json({ message: '파일 저장 오류' });
            }

            res.status(201).json({
                message: '새 게시글 추가 완',
                postId: postId,
            });
        });
    });
};

exports.updatePost = (req, res) => {
    const { postId } = req.params;
    const { title, content, userId, contentImage } = req.body;

    if (!userId) {
        return res.status(400).json({ message: '필수 요소 안넣음' });
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

// TODO - 댓글, 좋아요도 삭제
exports.deletePost = (req, res) => {
    const { postId } = req.params;
    const { user_id } = req.body;

    if (!user_id) {
        return res.status(400).json({ message: '필수 요소 안줌' });
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
            return res.status(404).json({ message: '찾을 수 없는 게시글' });
        }

        if (posts[postIndex].user_id !== user_id) {
            return res.status(401).json({ message: '삭제 권한 없음' });
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
    const { user_id } = req.body;

    if (!user_id) {
        return res.status(400).json({ message: '필수 요소 안줌' });
    }

    fs.readFile(likeFilePath, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: '파일 열기 에러요' });
        }

        const likes = JSON.parse(data);

        if (
            likes.some(
                item =>
                    item.user_id === user_id &&
                    item.post_id === parseInt(postId, 10),
            )
        ) {
            return res
                .status(200)
                .json({ message: '이미 좋아요 눌렀습니다.', success: false });
        }

        const newLike = {
            user_id: user_id,
            post_id: parseInt(postId, 10),
        };

        likes.push(newLike);

        fs.writeFile(likeFilePath, JSON.stringify(likes, null, 4), err => {
            if (err) {
                return res.status(500).json({ message: '파일 쓰기 오류' });
            }

            fs.readFile(filePath, 'utf-8', (err, data) => {
                if (err) {
                    console.error(err);
                }

                const posts = JSON.parse(data);

                const post = posts.find(
                    p => p.post_id === parseInt(postId, 10),
                );

                if (!post) {
                    return console.error(err);
                }

                post.heart_cnt += 1;

                fs.writeFile(filePath, JSON.stringify(posts, null, 4), err => {
                    if (err) {
                        console.error(err);
                    }
                });
            });

            return res.status(201).json({ message: '좋아요', success: true });
        });
    });
};

exports.deleteLike = (req, res) => {
    const { postId } = req.params;
    const { user_id } = req.body;

    fs.readFile(likeFilePath, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: '파일 열기 에러요' });
        }

        const likes = JSON.parse(data);

        const likeIndex = likes.findIndex(
            item =>
                item.user_id === user_id &&
                item.post_id === parseInt(postId, 10),
        );

        if (likeIndex === -1) {
            return res
                .status(200)
                .json({ message: '이미 좋아요 취소했습니다.', success: false });
        }

        likes.splice(likeIndex, 1);

        fs.writeFile(likeFilePath, JSON.stringify(likes, null, 4), err => {
            if (err) {
                return res.status(500).json({ message: '파일 쓰기 오류' });
            }

            fs.readFile(filePath, 'utf-8', (err, data) => {
                if (err) {
                    console.error(err);
                }

                const posts = JSON.parse(data);

                const post = posts.find(
                    p => p.post_id === parseInt(postId, 10),
                );

                if (!post) {
                    return console.error(err);
                }

                post.heart_cnt -= 1;

                fs.writeFile(filePath, JSON.stringify(posts, null, 4), err => {
                    if (err) {
                        console.error(err);
                    }
                });
            });

            return res
                .status(201)
                .json({ message: '좋아요 취소', success: true });
        });
    });
};
