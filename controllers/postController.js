import session from 'express-session';
import {
    addVisitCnt,
    countPosts,
    deletePostData,
    findLikePost,
    insertPost,
    selectAllPost,
    selectEditPost,
    selectPost,
    updatePost,
} from '../models/postModel.js';
import {
    deleteHeartTransaction,
    insertHeartTransaction,
} from '../services/postService.js';

export async function getPost(req, res) {
    const page = parseInt(req.query.page, 10) || 1;
    const size = parseInt(req.query.size, 10) || 10;
    const category = parseInt(req.query.category, 10);

    if (!page || !size) {
        return res.status(400).json({ message: '필수안보냄' });
    }

    try {
        const startIndex = (page - 1) * size;

        const totalItems = await countPosts();

        if (startIndex >= totalItems) {
            return res.status(400).json({
                message: '유효하지 않은 페이지 번호입니다.',
            });
        }

        const pagedPosts = await selectAllPost(category, size, startIndex);

        return res.status(200).json({
            message: '게시글 목록',
            data: pagedPosts,
            meta: {
                totalItems,
                currentPage: page,
                perPage: size,
            },
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: '서버 오류 발생' });
    }
}

export async function getDetailPost(req, res) {
    const { postId } = req.params;

    if (!postId) {
        return res.status(400).json({ message: '필수안보냄' });
    }

    try {
        const post = await selectPost(postId, req.session.userId);

        if (!post) {
            return res.status(404).json({ message: '게시글 없음' });
        }

        const is_liked = await findLikePost(postId, req.session.userId);

        if (!req.session.viewedPosts) {
            req.session.viewedPosts = [];
        }

        if (!req.session.viewedPosts.includes(postId)) {
            try {
                await addVisitCnt(postId);
                req.session.viewedPosts.push(postId);
            } catch (err) {
                console.error(`조회수 증가 실패: ${err.message}`);
            }
        }

        return res.status(200).json({
            message: '게시글 목록',
            data: { ...post, is_liked },
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: '서버 오류 발생' });
    }
}

// 본인 작성자인지 확인이 필요할까?
export async function getEditPost(req, res) {
    const { postId } = req.params;

    if (!postId) {
        return res.status(400).json({ message: '필수안보냄' });
    }

    try {
        const post = await selectEditPost(postId);

        if (!post) {
            return res.status(404).json({ message: '게시글 없음' });
        }

        return res.status(200).json({
            message: '게시글 목록',
            data: { ...post },
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: '서버 오류 발생' });
    }
}

export async function addPost(req, res) {
    const { title, content } = req.body;
    const post_image = req.file ? `${req.file.key}` : null;

    if (!title || !content) {
        return res.status(400).json({ message: '필수안보냄' });
    }

    try {
        const postId = await insertPost({
            title,
            content,
            post_image,
            user_id: req.session.userId,
        });

        return res.status(201).json({
            message: '새 게시글 추가 완',
            postId: postId,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: '서버 오류 발생' });
    }
}

export async function editPost(req, res) {
    const { postId } = req.params;
    const { title, content } = req.body;
    const post_image = req.file ? `${req.file.key}` : null;

    if (!title && !content && !post_image) {
        return res.status(400).json({ message: '아무 요소도 보내지 않음' });
    }

    try {
        const updatedPost = await updatePost(
            { title, content, post_image },
            req.session.userId,
            postId,
        );

        if (!updatedPost)
            return res.status(404).json({
                message: '사용자가 수정 할 수 있는 게시글이 없습니다.',
            });

        return res.status(200).json({ message: '게시글 수정 완료' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: '서버 오류 발생' });
    }
}

// 업로드속 사진도 삭제하기
export async function deletePost(req, res) {
    const { postId } = req.params;

    try {
        const delPost = await deletePostData(postId, req.session.userId);

        if (!delPost) {
            return res
                .status(404)
                .json({ message: '찾을 수 없는 사용자가 쓴 게시글' });
        }

        return res.status(200).json({
            message: '게시글 삭제 완료',
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: '서버 오류 발생' });
    }
}

export async function addLike(req, res) {
    const { postId } = req.params;

    if (!postId) {
        return res.status(400).json({ message: '아무 요소도 보내지 않음' });
    }

    try {
        const result = await insertHeartTransaction(postId, req.session.userId);

        return res.status(200).json({
            message: result.message,
            success: result.success,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: '서버 오류 발생' });
    }
}

export async function deleteLike(req, res) {
    const { postId } = req.params;

    if (!postId) {
        return res.status(400).json({ message: '아무 요소도 보내지 않음' });
    }

    try {
        const result = await deleteHeartTransaction(postId, req.session.userId);

        return res.status(200).json({
            message: result.message,
            success: result.success,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: '서버 오류 발생' });
    }
}
