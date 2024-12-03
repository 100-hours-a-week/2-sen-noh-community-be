import { readFile as _readFile, writeFile } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import {
    addVisitCnt,
    countPosts,
    findLikePost,
    insertPost,
    selectAllPost,
    selectPost,
    updatePost,
} from '../model/postModel.js';
import session from 'express-session';

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
        return res.status(400).json({ message: '필수안보냄' });
    }

    try {
        const startIndex = (page - 1) * size;

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

export async function getDetailPost(req, res) {
    const { postId } = req.params;

    if (!req.session.userId) {
        return res.status(401).json({ message: '세션 만료' });
    }

    if (!postId) {
        return res.status(400).json({ message: '필수안보냄' });
    }

    try {
        const post = await selectPost(postId);

        if (!post) {
            return res.status(404).json({ message: '게시글 없음' });
        }

        const is_liked = await findLikePost(postId, req.session.userId);

        await addVisitCnt(postId);

        return res.status(200).json({
            message: '게시글 목록',
            data: { ...post, is_liked },
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: '서버 오류 발생' });
    }
}

export async function addPost(req, res) {
    const { title, content } = req.body;
    const post_image = req.file
        ? `http://localhost:3000/${req.file.path}`
        : null;

    if (!req.session.userId) {
        return res.status(401).json({ message: '세션 만료' });
    }

    if (!title || !content) {
        return res.status(400).json({ message: '필수안보냄' });
    }

    try {
        const postId = await insertPost({
            title,
            content,
            post_image,
            user_id: req.session.userId,
        });

        res.status(201).json({
            message: '새 게시글 추가 완',
            postId: postId,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: '서버 오류 발생' });
    }
}

export async function editPost(req, res) {
    const { postId } = req.params;
    const { title, content } = req.body;
    const post_image = req.file
        ? `http://localhost:3000/${req.file.path}`
        : null;

    if (!req.session.userId) {
        return res.status(401).json({ message: '세션 만료' });
    }

    if (!title && !content && !post_image) {
        return res.status(400).json({ message: '아무 요소도 보내지 않음' });
    }

    try {
        const updatedPost = await updatePost(
            { title, content, post_image },
            req.session.userId,
            postId,
        );

        if (!updatedPost)
            return res.status(404).json({
                message: '사용자가 수정 할 수 있는 게시글이 없습니다.',
            });

        return res.status(200).json({
            message: '게시글 수정 완료',
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: '서버 오류 발생' });
    }
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
