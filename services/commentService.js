import {
    addCommentCnt,
    deleteCommentData,
    insertComment,
    subCommentCnt,
} from '../models/commentModel.js';
import pool from '../config/db.js';

export const insertCmtTransaction = async ({ post_id, user_id, comment }) => {
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();
        await insertComment(post_id, user_id, comment, connection);
        await addCommentCnt(post_id, connection);
        await connection.commit();
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

export const deleteCmtTransaction = async ({
    comment_id,
    user_id,
    post_id,
}) => {
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();
        const deleteCmt = await deleteCommentData(
            comment_id,
            user_id,
            post_id,
            connection,
        );

        if (!deleteCmt) {
            throw new Error('사용자가 쓴 댓글을 찾을 수 없음');
        }

        await subCommentCnt(post_id, 1, connection);
        await connection.commit();
        return { success: true };
    } catch (error) {
        await connection.rollback();
        return { success: false, message: error.message };
    } finally {
        connection.release();
    }
};
