import { compare } from 'bcrypt';
import pool from '../db.js';

export const loginUser = async ({ email, password }) => {
    try {
        const [rows] = await pool.query('SELECT * FROM user WHERE email = ?', [
            email,
        ]);
        if (rows.length === 0 || !(await compare(password, rows[0].password))) {
            return null;
        }
        return rows[0];
    } catch (error) {
        throw error;
    }
};

export const createUser = async ({
    email,
    password,
    nickname,
    profile_image,
}) => {
    try {
        const [result] = await pool.query(
            'INSERT INTO user (email,password,nickname,profile_image) VALUES (?, ?,?,?)',
            [email, password, nickname, profile_image],
        );
        return result.insertId;
    } catch (error) {
        throw error;
    }
};

export const checkDupEmail = async email => {
    try {
        const [rows] = await pool.query(
            'SELECT email FROM user WHERE email = ?',
            [email],
        );
        return rows.length > 0;
    } catch (err) {
        throw err;
    }
};

export const checkDupNickname = async nickname => {
    try {
        const [rows] = await pool.query(
            'SELECT nickname FROM user WHERE nickname = ?',
            [nickname],
        );
        return rows.length > 0;
    } catch (err) {
        throw err;
    }
};
