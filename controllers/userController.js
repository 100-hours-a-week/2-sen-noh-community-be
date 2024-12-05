import { hash } from 'bcrypt';

import {
    getUserInfo,
    updateRePW,
    updateUserInfo,
} from '../models/userModel.js';
import { deleteUserTransaction } from '../services/userService.js';

export async function getUser(req, res) {
    try {
        const user = await getUserInfo(req.session.userId);

        if (!user) {
            return res.status(404).json({
                message: '찾을 수 없는 유저입니다.',
            });
        }

        return res.status(200).json({
            message: '유저 정보',
            data: {
                email: user.email,
                nickname: user.nickname,
            },
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: '서버 오류 발생' });
    }
}

export async function deleteUser(req, res) {
    try {
        const result = await deleteUserTransaction(req.session.userId);

        if (!result.success) {
            return res.status(404).json({
                message: result.message,
            });
        }

        return res.status(200).json({ message: result.message });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: '서버 오류 발생' });
    }
}

export async function updateUser(req, res) {
    const { nickname } = req.body;
    const profile_image = req.file
        ? `http://localhost:3000/${req.file.path}`
        : null;

    if (!nickname && !profile_image) {
        return res.status(400).json({ message: '아무 요소도 보내지 않음' });
    }

    try {
        await updateUserInfo({
            nickname,
            profile_image,
            user_id: req.session.userId,
        });

        return res.status(200).json({
            message: '유저 정보 업데이트 완료',
            img: profile_image,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: '서버 오류 발생' });
    }
}

export async function updatePW(req, res) {
    const { password } = req.body;

    if (!password) {
        return res.status(400).json({ message: '필수 요소 안보냄' });
    }

    try {
        const result = await updateRePW({
            password: await hash(password, 10),
            user_id: req.session.userId,
        });

        if (!result) {
            return res.status(404).json({ message: '찾을 수 없는 유저' });
        }

        return res.status(200).json({ message: '비밀번호 수정' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: '서버 오류 발생' });
    }
}

export function logout(req, res) {
    req.session.destroy(err => {
        if (err) {
            console.error('Session destroy error:', err);
        }

        res.status(200).send({ message: '로그아웃 성공' });
    });
}
