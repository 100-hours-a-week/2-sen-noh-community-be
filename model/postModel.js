import pool from '../db.js';

export const selectAllPost = async (limit = 10, offset) => {
    const [rows] = await pool.query(
        `SELECT post.post_id, post.user_id, post.title, post.content, post.post_image, post.heart_cnt, post.comment_cnt, post.visit_cnt, post.date, 
                user.nickname, user.profile_image
         FROM post
         JOIN user ON post.user_id = user.user_id
         ORDER BY post.date DESC
         LIMIT ? OFFSET ?`,
        [limit, offset],
    );
    return rows;
};

export const countPosts = async () => {
    const [rows] = await pool.query(
        `SELECT COUNT(*) AS totalCount
         FROM post`,
    );
    return rows[0].totalCount;
};
