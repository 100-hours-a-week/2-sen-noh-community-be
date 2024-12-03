import pool from '../db.js';

export const getUserInfo = async user_id => {
    try {
        const [rows] = await pool.query(
            'SELECT * FROM user WHERE user_id = ?',
            [user_id],
        );
        if (rows.length === 0) return null;
        return rows[0];
    } catch (error) {
        throw error;
    }
};

export const updateUserInfo = async ({ nickname, profile_image, user_id }) => {
    try {
        const updates = [];
        const values = [];

        if (nickname) {
            updates.push('nickname = ?');
            values.push(nickname);
        }

        if (profile_image) {
            updates.push('profile_image = ?');
            values.push(profile_image);
        }

        values.push(user_id);

        await pool.query(
            `UPDATE user SET ${updates.join(', ')} WHERE user_id = ?`,
            values,
        );
    } catch (error) {
        throw error;
    }
};
