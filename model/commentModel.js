import pool from '../db.js';

export const selectComment = async (post_id, user_id) => {
    const [rows] = await pool.query(
        `SELECT comment.comment_id, comment.user_id, comment.date, comment.comment, 
                user.nickname, user.profile_image,
                CASE WHEN comment.user_id = ? THEN true ELSE false
                END AS is_user
         FROM comment
         JOIN user ON comment.user_id = user.user_id
         WHERE comment.post_id = ?
         ORDER BY comment.date DESC
         `,
        [user_id, post_id],
    );
    return rows;
};

export const insertComment = async (post_id, user_id, comment) => {
    await pool.query(
        'INSERT INTO comment (post_id, user_id, comment, date) VALUES (?, ?, ?, ?)',
        [post_id, user_id, comment, new Date()],
    );
};

export const addCommentCnt = async post_id => {
    await pool.query(
        'UPDATE post SET comment_cnt = comment_cnt + 1 WHERE post_id = ?',
        [post_id],
    );
};

export const updateComment = async (comment, comment_id, user_id) => {
    const [result] = await pool.query(
        'UPDATE comment SET comment = ?, date = ? WHERE comment_id = ? AND user_id = ?',
        [comment, new Date(), comment_id, user_id],
    );

    return result.affectedRows > 0;
};

export const deleteCommentData = async (comment_id, user_id, post_id) => {
    const [result] = await pool.query(
        'DELETE FROM comment WHERE comment_id = ? AND user_id = ? AND post_id = ?',
        [comment_id, user_id, post_id],
    );

    return result.affectedRows > 0;
};

export const subCommentCnt = async post_id => {
    await pool.query(
        'UPDATE post SET comment_cnt = comment_cnt - 1 WHERE post_id = ?',
        [post_id],
    );
};
