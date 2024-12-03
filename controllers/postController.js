import { readFile as _readFile, writeFile } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { countPosts, selectAllPost } from '../model/postModel.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const filePath = join(__dirname, '../data/posts.json');
const likeFilePath = join(__dirname, '../data/likes.json');
const userFilePath = join(__dirname, '../data/users.json');
const commentFilePath = join(__dirname, '../data/comments.json');

export async function getPost(req, res) {
    const page = parseInt(req.query.page, 10) || 1;
    const size = parseInt(req.query.size, 10) || 10;

    if (!page || !size) {
        return res.status(400).json({
            message: '필수안보냄',
        });
    }

    try {
        const startIndex = (page - 1) * size;
        console.log(startIndex);
        const totalItems = await countPosts();

        if (startIndex >= totalItems) {
            return res
                .status(400)
                .json({ message: '유효하지 않은 페이지 번호입니다.' });
        }

        const pagedPosts = await selectAllPost(size, startIndex);

        res.status(200).json({
            message: '게시글 목록',
            data: pagedPosts,
            meta: {
                totalItems,
                currentPage: page,
                perPage: size,
            },
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: '서버 오류 발생' });
    }
}

export function getDetailPost(req, res) {
    const { postId } = req.params;

    if (!req.session.userId) {
        return res.status(401).json({ message: '세션 만료' });
    }

    _readFile(filePath, 'utf-8', (err, data) => {
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

        _readFile(likeFilePath, 'utf-8', (err, data) => {
            if (err) {
                return res.status(500).json({ message: '파일 오류' });
            }

            const likes = JSON.parse(data);

            post.is_liked = likes.some(
                item =>
                    item.user_id === req.session.userId &&
                    item.post_id === parseInt(postId, 10),
            );

            _readFile(userFilePath, 'utf-8', (err, data) => {
                if (err) {
                    res.status(500).json({ message: '파일 오류' });
                    return;
                }

                const users = JSON.parse(data);
                const user = users.find(item => item.user_id === post.user_id);

                post.nickname = user.nickname;
                post.profile_image = user.profile_image;

                post.visit_cnt += 1;

                writeFile(filePath, JSON.stringify(posts, null, 4), err => {
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
}

export function addPost(req, res) {
    const { title, content } = req.body;
    let post_image;

    if (req.file) {
        post_image = req.file.path;
    }

    if (!req.session.userId) {
        return res.status(401).json({ message: '세션 만료' });
    }

    if (!title || !content) {
        return res.status(400).json({
            message: '필수안보냄',
        });
    }

    _readFile(filePath, 'utf-8', (err, data) => {
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
            post_image:
                post_image !== undefined
                    ? 'http://localhost:3000/' + post_image
                    : null,
            user_id: req.session.userId,
            heart_cnt: 0,
            comment_cnt: 0,
            visit_cnt: 0,
            date: new Date().toISOString(),
        };

        posts.push(newPost);

        writeFile(filePath, JSON.stringify(posts, null, 4), 'utf-8', err => {
            if (err) {
                return res.status(500).json({ message: '파일 저장 오류' });
            }

            res.status(201).json({
                message: '새 게시글 추가 완',
                postId: postId,
            });
        });
    });
}

export function updatePost(req, res) {
    const { postId } = req.params;
    const { title, content } = req.body;
    let post_image;

    if (req.file) {
        post_image = req.file.path;
    }

    if (!req.session.userId) {
        return res.status(401).json({ message: '세션 만료' });
    }

    _readFile(filePath, 'utf-8', (err, data) => {
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

        if (req.session.userId !== posts[postIndex].user_id) {
            return res.status(401).json({ message: '수정 권한 없음' });
        }

        if (title) {
            posts[postIndex].title = title;
        }

        if (content) {
            posts[postIndex].content = content;
        }

        if (post_image) {
            posts[postIndex].post_image = 'http://localhost:3000/' + post_image;
        }

        writeFile(filePath, JSON.stringify(posts, null, 4), 'utf-8', err => {
            if (err) {
                return res.status(500).json({ message: '파일 저장 오류' });
            }
            return res.status(200).json({
                message: '게시글 수정 완료',
            });
        });
    });
}

const readFile = filePath =>
    new Promise((resolve, reject) => {
        _readFile(filePath, 'utf-8', (err, data) => {
            if (err) {
                return reject(err);
            }
            resolve(JSON.parse(data));
        });
    });

//업로드속 사진도 삭제하기
export async function deletePost(req, res) {
    const { postId } = req.params;

    try {
        if (!req.session.userId) {
            return res.status(401).json({ message: '세션 만료' });
        }
        const posts = await readFile(filePath);
        const postIndex = posts.findIndex(
            post => post.post_id === parseInt(postId, 10),
        );

        if (postIndex === -1) {
            return res.status(404).json({ message: '찾을 수 없는 게시글' });
        }

        if (posts[postIndex].user_id !== req.session.userId) {
            return res.status(401).json({ message: '삭제 권한 없음' });
        }

        posts.splice(postIndex, 1);

        writeFile(filePath, JSON.stringify(posts, null, 4), err => {
            if (err) {
                return reject(err);
            }
        });

        const comments = await readFile(commentFilePath);
        const newCmt = comments.filter(
            cmt => cmt.post_id !== parseInt(postId, 10),
        );
        writeFile(commentFilePath, JSON.stringify(newCmt, null, 4), err => {
            if (err) {
                return reject(err);
            }
        });

        const likes = await readFile(likeFilePath);
        const newLikes = likes.filter(l => l.post_id !== parseInt(postId, 10));
        writeFile(likeFilePath, JSON.stringify(newLikes, null, 4), err => {
            if (err) {
                return reject(err);
            }
            return res.status(200).json({ message: '게시글 삭제' });
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: '서버 오류 발생' });
    }
}

export function addLike(req, res) {
    const { postId } = req.params;

    if (!req.session.userId) {
        return res.status(401).json({ message: '세션 만료' });
    }

    _readFile(likeFilePath, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: '파일 열기 에러요' });
        }

        const likes = JSON.parse(data);

        if (
            likes.some(
                item =>
                    item.user_id === req.session.userId &&
                    item.post_id === parseInt(postId, 10),
            )
        ) {
            return res
                .status(200)
                .json({ message: '이미 좋아요 눌렀습니다.', success: false });
        }

        const newLike = {
            user_id: req.session.userId,
            post_id: parseInt(postId, 10),
        };

        likes.push(newLike);

        writeFile(likeFilePath, JSON.stringify(likes, null, 4), err => {
            if (err) {
                return res.status(500).json({ message: '파일 쓰기 오류' });
            }

            _readFile(filePath, 'utf-8', (err, data) => {
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

                writeFile(filePath, JSON.stringify(posts, null, 4), err => {
                    if (err) {
                        console.error(err);
                    }
                });
            });

            return res.status(201).json({ message: '좋아요', success: true });
        });
    });
}

export function deleteLike(req, res) {
    const { postId } = req.params;

    if (!req.session.userId) {
        return res.status(401).json({ message: '필수 요소 안줌' });
    }

    _readFile(likeFilePath, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: '파일 열기 에러요' });
        }

        const likes = JSON.parse(data);

        const likeIndex = likes.findIndex(
            item =>
                item.user_id === req.session.userId &&
                item.post_id === parseInt(postId, 10),
        );

        if (likeIndex === -1) {
            return res
                .status(200)
                .json({ message: '이미 좋아요 취소했습니다.', success: false });
        }

        likes.splice(likeIndex, 1);

        writeFile(likeFilePath, JSON.stringify(likes, null, 4), err => {
            if (err) {
                return res.status(500).json({ message: '파일 쓰기 오류' });
            }

            _readFile(filePath, 'utf-8', (err, data) => {
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

                writeFile(filePath, JSON.stringify(posts, null, 4), err => {
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
}
