import {
    checkDupEmail,
    checkDupNickname,
    loginUser,
} from '../models/authModel.js';
import { signUpTransaction } from '../services/authService.js';

export async function login(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: '필수 요소 안줌' });
    }

    try {
        const user = await loginUser({ email, password });

        if (!user) {
            return res.status(400).json({
                message: '아이디와 패스워드가 일치하지 않습니다.',
            });
        }

        req.session.userId = user.user_id;

        return res.status(200).json({
            message: '로그인 완료',
            data: {
                user_id: user.user_id,
                profile_image: user.profile_image,
            },
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: '서버 오류 발생' });
    }
}

const validateEmail = email => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
};

const validatePassword = password => {
    const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,20}$/;
    return passwordRegex.test(password);
};

const validateNickname = nickname => {
    const nicknameRegex = /^[^\s]{1,10}$/;
    return nicknameRegex.test(nickname);
};

export async function signIn(req, res) {
    const { email, password, nickname } = req.body;
    const profile_image = req.file
        ? `http://localhost:3000/${req.file.path}`
        : null;

    if (!email || !password || !nickname) {
        return res.status(400).json({ message: '필수 요소 안보냄' });
    }

    try {
        if (!validateEmail(email)) {
            return res.status(400).json({
                message: '유효하지 않은 이메일 형식입니다.',
            });
        }

        if (!validatePassword(password)) {
            return res.status(400).json({
                message:
                    '비밀번호는 8자 이상 20자 이하로, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개씩 포함해야 합니다.',
            });
        }

        if (!validateNickname(nickname)) {
            return res.status(400).json({
                message: '닉네임은 공백 없이 1자 이상 10자 이내여야 합니다.',
            });
        }

        const result = await signUpTransaction({
            email,
            password,
            nickname,
            profile_image,
        });

        if (!result.success) {
            return res.status(400).json({ message: result.message });
        }

        return res.status(201).json({
            message: '회원가입 완료',
            user_id: result.newUserId,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: '서버 오류 발생' });
    }
}

export async function checkEmail(req, res) {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: '필수 요소 안줌' });
    }

    try {
        const is_existed = await checkDupEmail(email);

        return res.status(200).json({
            message: '중복 여부',
            data: { is_existed },
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: '서버 오류 발생' });
    }
}

export async function checkNickname(req, res) {
    const { nickname } = req.body;

    if (!nickname) {
        return res.status(400).json({ message: '필수 요소 안줌' });
    }

    try {
        const is_existed = await checkDupNickname(nickname);

        return res.status(200).json({
            message: '중복 여부',
            data: { is_existed },
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: '서버 오류 발생' });
    }
}
