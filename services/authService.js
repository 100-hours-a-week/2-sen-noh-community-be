import pool from '../db.js';
import {
    checkDupEmail,
    checkDupNickname,
    createUser,
} from '../models/authModel.js';
import { hash } from 'bcrypt';

export const signUpTransaction = async ({
    email,
    password,
    nickname,
    profile_image,
}) => {
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        if (await checkDupEmail(email, connection)) {
            return res
                .status(400)
                .json({ message: '중복되는 이메일 입니다. ' });
        }

        if (await checkDupNickname(nickname, connection)) {
            return res.status(400).json({ message: '중복되는 닉네임입니다.' });
        }

        const hashedPW = await hash(password, 10);

        const newUserId = await createUser(
            {
                email,
                password: hashedPW,
                nickname,
                profile_image,
            },
            connection,
        );

        await connection.commit();
        return newUserId;
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};
