const { json } = require('express');
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/users.json');

exports.getUser = (req, res) => {
    const { userId } = req.params;

    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: '파일 읽기 오류' });
        }

        const users = JSON.parse(data);

        const user = users.find(item => item.user_id === parseInt(userId, 10));

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
};

// TODO - 게시물, 댓글, 좋아요 다 삭제
exports.deleteUser = (req, res) => {
    const { userId } = req.params;

    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: '파일 읽기 오류' });
        }

        const users = JSON.parse(data);

        const userIndex = users.findIndex(
            item => item.user_id === parseInt(userId, 10),
        );

        if (userIndex === -1) {
            return res
                .status(404)
                .json({ message: '찾을 수 없는 유저입니다.' });
        }

        users.splice(userIndex, 1);

        fs.writeFile(filePath, JSON.stringify(users, null, 4), err => {
            if (err) {
                return res.status(500).json({ message: '파일 쓰기 오류' });
            }

            return res.status(200).json({ message: '회원탈퇴 완료' });
        });
    });
};

exports.updateUser = (req, res) => {
    const { userId } = req.params;
    const { nickname, profile_image } = req.body;

    if (!nickname && !profile_image) {
        return res.status(400).json({ message: '아무 요소도 보내지 않음' });
    }

    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: '파일 읽기 실패' });
        }

        const users = JSON.parse(data);

        const userIndex = users.findIndex(
            item => item.user_id === parseInt(userId, 10),
        );

        if (userIndex === -1) {
            return res.status(404).json({ message: '없는 유저 입니다' });
        }

        if (nickname) {
            users[userIndex].nickname = nickname;
        }
        if (profile_image) {
            users[userIndex].profile_image = profile_image;
        }

        fs.writeFile(filePath, JSON.stringify(users, null, 4), err => {
            if (err) {
                return res.status(500).json({ message: '파일 쓰기 오류' });
            }

            return res.status(200).json({ message: '유저 정보 업데이트 완료' });
        });
    });
};

exports.updatePW = (req, res) => {
    const { userId } = req.params;
    const { password } = req.body;

    if (!password) {
        return res.status(500).json({ message: '필수 요소 안보냄' });
    }

    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: '파일 읽기 오류' });
        }

        const users = JSON.parse(data);

        const userIndex = users.findIndex(
            item => item.user_id === parseInt(userId, 10),
        );

        if (userIndex === -1) {
            return res.status(404).json({ message: '유저 정보 찾을 수 없음' });
        }

        users[userIndex].password = password;

        fs.writeFile(filePath, JSON.stringify(users, null, 4), err => {
            if (err) {
                return res.status(500).json({ message: '파일 쓰기 오류' });
            }

            return res.status(200).json({ message: '비밀번호 수정' });
        });
    });
};
