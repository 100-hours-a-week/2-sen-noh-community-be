import { readFile as _readFile, writeFile as _writeFile } from 'fs';
import { hash } from 'bcrypt';

import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const filePath = join(__dirname, '../data/users.json');
const commentFilePath = join(__dirname, '../data/comments.json');
const postFilePath = join(__dirname, '../data/posts.json');
const likeFilePath = join(__dirname, '../data/likes.json');

// TODO - parseint 할 필요가 있는 지 확인
export function getUser(req, res) {
    if (!req.session.userId) {
        return res.status(401).json({ message: '세션 만료' });
    }

    _readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: '파일 읽기 오류' });
        }

        const users = JSON.parse(data);

        const user = users.find(
            item => item.user_id === parseInt(req.session.userId, 10),
        );

        if (!user) {
            return res
                .status(404)
                .json({ message: '찾을 수 없는 유저입니다.' });
        }

        const userInfo = {
            email: user.email,
            nickname: user.nickname,
        };

        return res.status(200).json({ message: '유저 정보', data: userInfo });
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

const writeFile = (filePath, data) =>
    new Promise((resolve, reject) => {
        _writeFile(filePath, JSON.stringify(data, null, 4), err => {
            if (err) {
                return reject(err);
            }
            resolve();
        });
    });

export async function deleteUser(req, res) {
    const userIdInt = parseInt(req.session.userId, 10);

    if (!userIdInt) {
        return res.status(401).json({ message: '세션 만료' });
    }

    try {
        // 유저 삭제
        const users = await readFile(filePath);
        const userIndex = users.findIndex(user => user.user_id === userIdInt);
        if (userIndex === -1) {
            return res
                .status(404)
                .json({ message: '찾을 수 없는 유저입니다.' });
        }
        users.splice(userIndex, 1);
        await writeFile(filePath, users);

        // 해당 유저의 좋아요 삭제
        const likes = await readFile(likeFilePath);
        const filteredLikes = likes.filter(like => like.user_id !== userIdInt);

        await writeFile(likeFilePath, filteredLikes);

        // 해당 유저의 댓글 삭제
        const comments = await readFile(commentFilePath);
        const filteredComments = comments.filter(
            cmt => cmt.user_id !== userIdInt,
        );
        await writeFile(commentFilePath, filteredComments);

        // 해당 유저의 게시글 삭제
        const posts = await readFile(postFilePath);
        posts.forEach(post => {
            likes.forEach(like => {
                if (
                    like.user_id === userIdInt &&
                    post.post_id === like.post_id
                ) {
                    post.heart_cnt -= 1;
                }
            });
            comments.forEach(cmt => {
                if (cmt.user_id == userIdInt && post.post_id === cmt.post_id) {
                    post.comment_cnt -= 1;
                }
            });
        });
        const filteredPosts = posts.filter(post => post.user_id !== userIdInt);
        await writeFile(postFilePath, filteredPosts);

        return res.status(200).json({ message: '회원탈퇴 완료' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: '서버 오류 발생' });
    }
}

export function updateUser(req, res) {
    const { nickname } = req.body;
    let profile_image;

    if (req.file) {
        profile_image = req.file.path;
    }

    if (!req.session.userId) {
        return res.status(401).json({ message: '세션 만료' });
    }

    if (!nickname && !profile_image) {
        return res.status(400).json({ message: '아무 요소도 보내지 않음' });
    }

    _readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: '파일 읽기 실패' });
        }

        const users = JSON.parse(data);

        const userIndex = users.findIndex(
            item => item.user_id === parseInt(req.session.userId, 10),
        );

        if (userIndex === -1) {
            return res.status(404).json({ message: '없는 유저 입니다' });
        }

        if (nickname) {
            users[userIndex].nickname = nickname;
        }
        if (profile_image) {
            users[userIndex].profile_image =
                'http://localhost:3000/' + profile_image;
        }

        _writeFile(filePath, JSON.stringify(users, null, 4), err => {
            if (err) {
                return res.status(500).json({ message: '파일 쓰기 오류' });
            }

            return res.status(200).json({ message: '유저 정보 업데이트 완료' });
        });
    });
}

export function updatePW(req, res) {
    const { password } = req.body;

    if (!req.session.userId) {
        return res.status(401).json({ message: '세션 만료' });
    }

    if (!password) {
        return res.status(500).json({ message: '필수 요소 안보냄' });
    }

    _readFile(filePath, 'utf-8', async (err, data) => {
        if (err) {
            return res.status(500).json({ message: '파일 읽기 오류' });
        }

        const users = JSON.parse(data);

        const userIndex = users.findIndex(
            item => item.user_id === parseInt(req.session.userId, 10),
        );

        if (userIndex === -1) {
            return res.status(404).json({ message: '유저 정보 찾을 수 없음' });
        }

        users[userIndex].password = await hash(password, 10);

        _writeFile(filePath, JSON.stringify(users, null, 4), err => {
            if (err) {
                return res.status(500).json({ message: '파일 쓰기 오류' });
            }

            return res.status(200).json({ message: '비밀번호 수정' });
        });
    });
}

export function logout(req, res) {
    req.session.destroy(err => {
        if (err) {
            console.error('Session destroy error:', err);
        }

        res.status(200).send({ message: '로그아웃 성공' });
    });
}
