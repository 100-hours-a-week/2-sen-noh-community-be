import multer from 'multer';
import path from 'path';
import { readFile, writeFile } from 'fs';
import { compare, hash } from 'bcrypt';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const filePath = join(__dirname, '../data/users.json');

export function login(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: '필수 요소 안줌' });
    }

    readFile(filePath, 'utf-8', async (err, data) => {
        if (err) {
            return res.status(500).json({ message: '파일 읽기 오류' });
        }

        const users = JSON.parse(data);

        const getUser = async (email, password) => {
            for (let item of users) {
                if (
                    item.email === email &&
                    (await compare(password, item.password))
                ) {
                    return item;
                }
            }
            return null;
        };

        const user = await getUser(email, password);

        if (!user) {
            return res
                .status(400)
                .json({ message: '아이디와 패스워드가 일치하지 않습니다.' });
        }

        req.session.userId = user.user_id;

        return res.status(201).json({
            message: '로그인 완료',
            data: {
                user_id: user.user_id,
                email: user.email,
                nickname: user.nickname,
                profile_image: user.profile_image,
            },
        });
    });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${Date.now()}${ext}`);
    },
});

export const upload = multer({ storage });

export function signIn(req, res) {
    const { email, password, nickname } = req.body;
    const profile_image = req.file.path;

    if (!email || !password || !nickname) {
        return res.status(400).json({ message: '필수 요소 안보냄' });
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(email)) {
        return res
            .status(400)
            .json({ message: '유효하지 않은 이메일 형식입니다.' });
    }

    const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,20}$/;
    if (!passwordRegex.test(password)) {
        return res.status(400).json({
            message:
                '비밀번호는 8자 이상 20자 이하로, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개씩 포함해야 합니다.',
        });
    }

    const nicknameRegex = /^[^\s]{1,10}$/;
    if (!nicknameRegex.test(nickname)) {
        return res.status(400).json({
            message: '닉네임은 공백 없이 1자 이상 10자 이내여야 합니다.',
        });
    }

    readFile(filePath, 'utf-8', async (err, data) => {
        if (err) {
            return res.status(500).json({ message: '파일 읽기 오류' });
        }

        const users = JSON.parse(data);

        if (
            users.some(
                item => item.email === email || item.nickname === nickname,
            )
        ) {
            return res.status(400).json({
                message: '중복 에러',
            });
        }

        const hashedPW = await hash(password, 10);
        const newUser = {
            user_id: users.length > 0 ? users[users.length - 1].user_id + 1 : 1,
            email,
            password: hashedPW,
            nickname,
            profile_image: profile_image !== undefined ? profile_image : null,
        };

        users.push(newUser);

        writeFile(filePath, JSON.stringify(users, null, 4), err => {
            if (err) {
                return res.status(500).json({ message: '파일 쓰기 오류' });
            }

            return res
                .status(201)
                .json({ message: '회원가입 완료', user_id: newUser.user_id });
        });
    });
}

export function checkEmail(req, res) {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: '필수 요소 안줌' });
    }

    readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: '파일 쓰기 오류' });
        }

        const users = JSON.parse(data);

        const isDup = users.some(item => item.email === email);

        return res
            .status(200)
            .json({ message: '중복 여부', data: { is_existed: isDup } });
    });
}

export function checkNickname(req, res) {
    const { nickname } = req.body;

    if (!nickname) {
        return res.status(400).json({ message: '필수 요소 안줌' });
    }

    readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: '파일 쓰기 오류' });
        }

        const users = JSON.parse(data);

        const isDup = users.some(item => item.nickname === nickname);

        return res
            .status(200)
            .json({ message: '중복 여부', data: { is_existed: isDup } });
    });
}
