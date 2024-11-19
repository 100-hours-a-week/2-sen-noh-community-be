const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/comments.json');
const userFilePath = path.join(__dirname, '../data/users.json');

exports.getComment = (req, res) => {
    const { postId } = req;

    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            res.status(500).json({ message: '파일 오류' });
            return;
        }

        const comments = JSON.parse(data);

        fs.readFile(userFilePath, 'utf-8', (err, data) => {
            if (err) {
                res.status(500).json({ message: '파일 오류' });
                return;
            }

            const users = JSON.parse(data);

            const comment = comments
                .filter(c => c.post_id === parseInt(postId, 10))
                .map(c => {
                    const user = users.find(item => item.user_id === c.user_id);

                    return {
                        comment_id: c.comment_id,
                        user_id: c.user_id,
                        nickname: user.nickname,
                        profile_image: user.profile_image,
                        date: c.date,
                        comment: c.comment,
                    };
                });

            res.status(200).json({
                message: 'ok',
                data: comment,
            });
        });
    });
};

exports.addComment = (req, res) => {
    const { postId } = req;
    const { user_id, comment } = req.body;

    if (!user_id || !comment) {
        return res.status(400).json({ message: '필수 요소 안줌' });
    }

    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: '파일 읽기 오류' });
        }

        const comments = JSON.parse(data);

        const newComment = {
            comment_id:
                comments.length > 0
                    ? comments[comments.length - 1].comment_id + 1
                    : 0,
            post_id: parseInt(postId, 10),
            user_id: user_id,
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
};

// TODO - 게시글 id가 올바른 지 확인
exports.updateComment = (req, res) => {
    // const { postId } = req;
    const { commentId } = req.params;
    const { user_id, comment } = req.body;

    if (!user_id || !comment) {
        return res.status(400).json({ message: '필수 요소 안보냄' });
    }

    fs.readFile(filePath, 'utf-8', (err, data) => {
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

        if (editCmt.user_id !== user_id) {
            return res.status(401).json({ message: '접근 권한 없음둥' });
        }

        editCmt.comment = comment;
        editCmt.date = new Date().toISOString();

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
    const { user_id } = req.body;
    console.log(req.body);

    if (!user_id) {
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

        if (comments[editCmtIndex].user_id !== user_id) {
            return res.status(401).json({ message: '삭제 권한 없음' });
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
