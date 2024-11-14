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

        const userIndex = users.findIndex(
            item => item.email === email && item.password === password,
        );
        if (userIndex === -1) {
            return res
                .status(400)
                .json({ message: '아이디와 패스워드가 일치하지 않습니다.' });
        }

        return res.status(201).json({
            message: '로그인 완료',
            data: { user_id: users[userIndex].user_id },
        });
    });
};
