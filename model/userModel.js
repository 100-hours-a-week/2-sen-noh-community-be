import pool from '../db.js';

export const getUserInfo = async user_id => {
    const [rows] = await pool.query('SELECT * FROM user WHERE user_id = ?', [
        user_id,
    ]);
    if (rows.length === 0) return null;
    return rows[0];
};

export const updateUserInfo = async ({ nickname, profile_image, user_id }) => {
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
};

export const updateRePW = async ({ password, user_id }) => {
    const [result] = await pool.query(
        'UPDATE user SET password = ? WHERE user_id = ?',
        [password, user_id],
    );
    return result.affectedRows > 0;
};

export const deleteUserAll = async user_id => {
    const [result] = await pool.query('DELETE FROM user WHERE user_id = ?', [
        user_id,
    ]);
    return result.affectedRows > 0;
};
