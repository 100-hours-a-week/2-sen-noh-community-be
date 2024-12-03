import {
    addCommentCnt,
    deleteCommentData,
    insertComment,
    selectComment,
    subCommentCnt,
    updateComment,
} from '../model/commentModel.js';

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

        await addCommentCnt(postId);

        res.status(201).json({
            message: '새 댓글 추가 완',
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: '서버 오류 발생' });
    }
}

export async function editComment(req, res) {
    const { commentId } = req.params;
    const { comment } = req.body;

    if (!req.session.userId) {
        return res.status(401).json({ message: '세션 만료' });
    }

    if (!comment) {
        return res.status(400).json({ message: '필수 요소 안보냄' });
    }

    try {
        const editCmt = await updateComment(
            comment,
            commentId,
            req.session.userId,
        );
        if (!editCmt) {
            return res
                .status(404)
                .json({ message: '사용자가 쓴 댓글을 찾을 수 없음' });
        }
        res.status(200).json({ message: '댓글 수정 완' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: '서버 오류 발생' });
    }
}

export async function deleteComment(req, res) {
    const { commentId } = req.params;
    const { postId } = req;

    if (!req.session.userId) {
        return res.status(401).json({ message: '세션 만료' });
    }

    if (!commentId) {
        return res.status(400).json({ message: '필수 요소 안보냄' });
    }

    try {
        const deleteCmt = await deleteCommentData(
            commentId,
            req.session.userId,
            postId,
        );

        if (!deleteCmt) {
            return res
                .status(404)
                .json({ message: '사용자가 쓴 댓글을 찾을 수 없음' });
        }

        await subCommentCnt(postId);

        res.status(200).json({ message: '댓글 삭제 완' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: '서버 오류 발생' });
    }
}
