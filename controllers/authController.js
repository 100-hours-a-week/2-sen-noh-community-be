const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/users.json');

exports.login = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: '필수 요소 안줌' });
    }

    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: '파일 읽기 오류' });
        }

        const users = JSON.parse(data);

        const user = users.find(
            item => item.email === email && item.password === password,
        );

        if (!user) {
            return res
                .status(400)
                .json({ message: '아이디와 패스워드가 일치하지 않습니다.' });
        }

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
};

// TODO - 닉네임 중복, 이메일 중복 포함하기
// TODO - 암호화 진행시 비번 유효성 검사 빼도 될듯
exports.signIn = (req, res) => {
    console.log('hi');
    const { email, password, nickname, profile_image } = req.body;

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

    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: '파일 읽기 오류' });
        }

        const users = JSON.parse(data);

        const newUser = {
            user_id: users.length > 0 ? users[users.length - 1].user_id + 1 : 1,
            email,
            password,
            nickname,
            profile_image: profile_image !== undefined ? profile_image : null,
        };

        users.push(newUser);

        fs.writeFile(filePath, JSON.stringify(users, null, 4), err => {
            if (err) {
                return res.status(500).json({ message: '파일 쓰기 오류' });
            }

            return res
                .status(201)
                .json({ message: '회원가입 완료', user_id: newUser.user_id });
        });
    });
};

exports.checkEmail = (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: '필수 요소 안줌' });
    }

    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: '파일 쓰기 오류' });
        }

        const users = JSON.parse(data);

        const isDup = users.some(item => item.email === email);

        return res
            .status(200)
            .json({ message: '중복 여부', data: { is_existed: isDup } });
    });
};

exports.checkNickname = (req, res) => {
    const { nickname } = req.body;

    if (!nickname) {
        return res.status(400).json({ message: '필수 요소 안줌' });
    }

    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: '파일 쓰기 오류' });
        }

        const users = JSON.parse(data);

        const isDup = users.some(item => item.nickname === nickname);

        return res
            .status(200)
            .json({ message: '중복 여부', data: { is_existed: isDup } });
    });
};
