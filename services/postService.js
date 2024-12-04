import {
    addLikeCnt,
    deleteHeart,
    insertHeart,
    subLikeCnt,
} from '../models/postModel.js';

import pool from '../db.js';

export const insertHeartTransaction = async (post_id, user_id) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        const isSuccess = await insertHeart(post_id, user_id, connection);

        if (!isSuccess) {
            throw new Error();
        }

        await addLikeCnt(post_id, connection);
        await connection.commit();
        return { success: true, message: '좋아요' };
    } catch (error) {
        await connection.rollback();
        return { success: false, message: '이미 좋아요를 눌렀습니다.' };
    } finally {
        connection.release();
    }
};

export const deleteHeartTransaction = async (post_id, user_id) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        const isSuccess = await deleteHeart(post_id, user_id, connection);

        if (!isSuccess) {
            throw new Error();
        }

        await subLikeCnt(post_id, connection);
        await connection.commit();
        return { success: true, message: '좋아요 취소' };
    } catch (error) {
        await connection.rollback();
        return { success: false, message: '이미 좋아요를 취소했습니다.' };
    } finally {
        connection.release();
    }
};
