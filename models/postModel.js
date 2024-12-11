import pool from '../config/db.js';

export const selectAllPost = async (limit = 10, offset) => {
    const [rows] = await pool.query(
        `SELECT post.post_id, post.title, post.heart_cnt, post.comment_cnt, post.visit_cnt, post.date, 
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

export const selectPost = async (post_id, user_id) => {
    const [rows] = await pool.query(
        `SELECT post.post_id, post.user_id, post.title, post.content, post.post_image, post.heart_cnt, post.comment_cnt, post.visit_cnt, post.date, 
                user.nickname, user.profile_image,
                CASE WHEN post.user_id = ? THEN true ELSE false
                END AS is_user
         FROM post
         JOIN user ON post.user_id = user.user_id
         WHERE post.post_id = ?`,
        [user_id, post_id],
    );
    return rows[0];
};

export const findLikePost = async (post_id, user_id) => {
    const [rows] = await pool.query(
        'SELECT * FROM heart WHERE post_id = ? AND user_id = ?',
        [post_id, user_id],
    );
    return rows.length > 0;
};

export const addVisitCnt = async post_id => {
    await pool.query(
        'UPDATE post SET visit_cnt = visit_cnt + 1 WHERE post_id = ?',
        [post_id],
    );
};

export const insertPost = async ({ title, content, post_image, user_id }) => {
    const [result] = await pool.query(
        'INSERT INTO post (title, content, post_image, user_id, heart_cnt, comment_cnt, visit_cnt, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [title, content, post_image, user_id, 0, 0, 0, new Date()],
    );

    return result.insertId;
};

export const updatePost = async (updateData, user_id, post_id) => {
    const updates = [];
    const values = [];

    Object.keys(updateData).forEach(key => {
        const value = updateData[key];

        if (value) {
            updates.push(`${key} = ?`);
            values.push(value);
        }
    });

    values.push(user_id, post_id);

    const [result] = await pool.query(
        `UPDATE post SET ${updates.join(', ')} WHERE user_id = ? AND post_id = ?`,
        values,
    );

    return result.affectedRows;
};

export const insertHeart = async (post_id, user_id, connection) => {
    const [result] = await connection.query(
        'INSERT INTO heart (post_id, user_id) VALUES (?, ?)',
        [post_id, user_id],
    );

    return result.affectedRows > 0;
};

export const addLikeCnt = async (post_id, connection) => {
    await connection.query(
        'UPDATE post SET heart_cnt = heart_cnt + 1 WHERE post_id = ?',
        [post_id],
    );
};

export const deleteHeart = async (post_id, user_id, connection) => {
    const [result] = await connection.query(
        'DELETE FROM heart WHERE post_id = ? AND user_id = ?',
        [post_id, user_id],
    );

    return result.affectedRows > 0;
};

export const subLikeCnt = async (post_id, connection) => {
    await connection.query(
        'UPDATE post SET heart_cnt = heart_cnt - 1 WHERE post_id = ?',
        [post_id],
    );
};

export const deletePostData = async (post_id, user_id) => {
    const [result] = await pool.query(
        'DELETE FROM post WHERE post_id = ? AND user_id = ?',
        [post_id, user_id],
    );
    return result.affectedRows > 0;
};
