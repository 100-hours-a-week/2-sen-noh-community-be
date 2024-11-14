const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/comments.json');
exports.getComment = (req, res) => {
    const { postId } = req;

    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            res.status(500).json({ message: '파일 오류' });
            return;
        }

        const comments = JSON.parse(data);
        const comment = comments
            .filter(c => c.post_id === parseInt(postId, 10))
            .map(c => ({
                comment_id: c.comment_id,
                user_id: c.user_id,
                nickname: c.nickname,
                profile_image: c.profile_image,
                date: c.date,
                comment: c.comment,
            }));
        res.status(200).json({
            message: 'ok',
            data: comment,
        });
    });
};

exports.addComment = (req, res) => {
    const { postId } = req;
    const { userId, comment } = req.body;

    if (!userId || !comment) {
        return res.status(400).json({ message: '필수 요소 안줌' });
    }

    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: '파일 읽기 오류' });
        }

        const comments = JSON.parse(data);

        const userFilePath = path.join(__dirname, '../data/user.json');

        fs.readFile(userFilePath, 'utf-8', (err, data) => {
            if (err) {
                return res.status(500).json({ message: '유저 파일 읽기 오류' });
            }

            const users = JSON.parse(data);
            const userIndex = users.findIndex(
                users => users.user_id === parseInt(userId, 10),
            );

            const user = users[userIndex];

            const newComment = {
                comment_id:
                    comments.length > 0
                        ? comments[comments.length - 1].comment_id + 1
                        : 0,
                post_id: parseInt(postId, 10),
                user_id: userId,
                nickname: user.nickname,
                profile_image: user.profile_image,
                date: new Date().toISOString(),
                comment,
            };

            comments.push(newComment);

            fs.writeFile(filePath, JSON.stringify(comments, null, 4), err => {
                if (err) {
                    return res.status(500).json({ message: '파일 쓰기 오류' });
                }

                res.status(201).json({
                    message: '새 댓글 추가 완',
                });
            });
        });
    });
};

// TODO - 권한 있는 사용자인지 확인
exports.updateComment = (req, res) => {
    // const { postId } = req;
    const { commentId } = req.params;
    const { userId, comment } = req.body;

    if (!userId || !comment) {
        return res.status(400).json({ message: '필수 요소 안보냄' });
    }

    fs.readFile(filePath, 'utf-8', (err, data) => {
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

        comments[editCmtIndex].comment = comment;
        comments[editCmtIndex].date = new Date().toISOString();

        fs.writeFile(filePath, JSON.stringify(comments, null, 4), err => {
            if (err) {
                return res.status(500).json({ message: '파일 쓰기 오류' });
            }

            res.status(200).json({ message: '댓글 수정 완' });
        });
    });
};

exports.deleteComment = (req, res) => {
    const { commentId } = req.params;

    fs.readFile(filePath, 'utf-8', (err, data) => {
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

        comments.splice(editCmtIndex, 1);

        fs.writeFile(filePath, JSON.stringify(comments, null, 4), err => {
            if (err) {
                return res.status(500).json({ message: '파일 쓰기 오류' });
            }

            res.status(200).json({ message: '댓글 삭제 완' });
        });
    });
};
