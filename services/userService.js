import { subCommentCnt } from '../models/commentModel.js';
import { deleteUserAll, deleteUserCmtCnt } from '../models/userModel.js';
import pool from '../config/db.js';

export const deleteUserTransaction = async user_id => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const cmtCnt = await deleteUserCmtCnt(user_id, connection);

        for (const i of cmtCnt) {
            await subCommentCnt(i.post_id, i.comment_cnt, connection);
        }

        const user = await deleteUserAll(user_id, connection);

        if (!user) {
            throw new Error('찾을 수 없는 유저입니다.');
        }

        await connection.commit();
        return { success: true, message: '회원 탈퇴 완료' };
    } catch (error) {
        await connection.rollback();
        return { success: false, message: error.message };
    } finally {
        connection.release();
    }
};
