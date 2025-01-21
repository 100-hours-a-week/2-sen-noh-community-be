import bcrypt from 'bcryptjs';
import pool from '../config/db.js';

export const loginUser = async ({ email, password }) => {
    const [rows] = await pool.query('SELECT * FROM user WHERE email = ?', [
        email,
    ]);
    if (
        rows.length === 0 ||
        !(await bcrypt.compare(password, rows[0].password))
    ) {
        return null;
    }
    return rows[0];
};

export const createUser = async (
    { email, password, nickname, profile_image },
    connection,
) => {
    const [result] = await connection.query(
        'INSERT INTO user (email,password,nickname,profile_image) VALUES (?, ?,?,?)',
        [email, password, nickname, profile_image],
    );
    return result.insertId;
};

export const checkDupEmail = async (email, connection = null) => {
    const [rows] = await (connection || pool).query(
        'SELECT email FROM user WHERE email = ?',
        [email],
    );
    return rows.length > 0;
};

export const checkDupNickname = async (nickname, connection = null) => {
    const [rows] = await (connection || pool).query(
        'SELECT nickname FROM user WHERE nickname = ?',
        [nickname],
    );
    return rows.length > 0;
};
