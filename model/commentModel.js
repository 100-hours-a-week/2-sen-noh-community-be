import pool from '../db.js';

export const selectComment = async (post_id, user_id) => {
    const [rows] = await pool.query(
        `SELECT comment.comment_id, comment.user_id, comment.date, comment.comment, 
                user.nickname, user.profile_image,
                CASE WHEN comment.user_id = ? THEN true ELSE false
                END AS is_user
         FROM comment
         JOIN user ON comment.user_id = user.user_id
         WHERE comment.post_id = ?`,
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

export const addVisitCnt = async post_id => {
    await pool.query(
        'UPDATE post SET visit_cnt = visit_cnt + 1 WHERE post_id = ?',
        [post_id],
    );
};
