import { readFile, writeFile } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import {
    addVisitCnt,
    insertComment,
    selectComment,
} from '../model/commentModel.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const filePath = join(__dirname, '../data/comments.json');

const postFilePath = join(__dirname, '../data/posts.json');

export async function getComment(req, res) {
    const { postId } = req;

    if (!req.session.userId) {
        return res.status(401).json({ message: '세션 만료' });
    }

    if (!postId) {
        return res.status(400).json({ message: '필수 요소 안줌' });
    }

    try {
        const comments = await selectComment(postId, req.session.userId);

        res.status(200).json({
            message: '댓글 조회',
            data: comments,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: '서버 오류 발생' });
    }
}

export async function addComment(req, res) {
    const { postId } = req;
    const { comment } = req.body;

    if (!req.session.userId) {
        return res.status(401).json({ message: '세션 만료' });
    }

    if (!comment) {
        return res.status(400).json({ message: '필수 요소 안줌' });
    }
    try {
        await insertComment(postId, req.session.userId, comment);

        await addVisitCnt(postId);

        res.status(201).json({
            message: '새 댓글 추가 완',
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: '서버 오류 발생' });
    }
}

// TODO - 게시글 id가 올바른 지 확인
export function updateComment(req, res) {
    // const { postId } = req;
    const { commentId } = req.params;
    const { comment } = req.body;

    if (!req.session.userId) {
        return res.status(401).json({ message: '세션 만료' });
    }

    if (!comment) {
        return res.status(400).json({ message: '필수 요소 안보냄' });
    }

    readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: '파일 읽기 오류' });
        }

        const comments = JSON.parse(data);

        const editCmt = comments.find(
            cmt => cmt.comment_id === parseInt(commentId, 10),
        );

        if (!editCmt) {
            return res.status(404).json({ message: '댓글을 찾을 수 없음' });
        }

        if (editCmt.user_id !== req.session.userId) {
            return res.status(401).json({ message: '접근 권한 없음둥' });
        }

        editCmt.comment = comment;
        editCmt.date = new Date().toISOString();

        writeFile(filePath, JSON.stringify(comments, null, 4), err => {
            if (err) {
                return res.status(500).json({ message: '파일 쓰기 오류' });
            }

            res.status(200).json({ message: '댓글 수정 완' });
        });
    });
}

export function deleteComment(req, res) {
    const { commentId } = req.params;

    if (!req.session.userId) {
        return res.status(401).json({ message: '세션 만료' });
    }

    readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: '파일 읽기 오류' });
        }

        const comments = JSON.parse(data);

        const editCmtIndex = comments.findIndex(
            cmt => cmt.comment_id === parseInt(commentId, 10),
        );

        if (editCmtIndex === -1) {
            return res.status(404).json({ message: '댓글을 찾을 수 없음' });
        }

        if (comments[editCmtIndex].user_id !== req.session.userId) {
            return res.status(401).json({ message: '삭제 권한 없음' });
        }

        readFile(postFilePath, 'utf-8', (err, data) => {
            if (err) {
                console.error(err);
            }

            const posts = JSON.parse(data);

            const post = posts.find(
                p => p.post_id === comments[editCmtIndex].post_id,
            );

            if (!post) {
                console.log('왜 post 없냐');
            }

            post.comment_cnt -= 1;

            writeFile(postFilePath, JSON.stringify(posts, null, 4), err => {
                if (err) {
                    console.error(err);
                }

                comments.splice(editCmtIndex, 1);

                writeFile(filePath, JSON.stringify(comments, null, 4), err => {
                    if (err) {
                        return res
                            .status(500)
                            .json({ message: '파일 쓰기 오류' });
                    }

                    res.status(200).json({ message: '댓글 삭제 완' });
                });
            });
        });
    });
}
