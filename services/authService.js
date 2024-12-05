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
            throw new Error('중복되는 이메일 입니다.');
        }

        if (await checkDupNickname(nickname, connection)) {
            throw new Error('중복되는 닉네임 입니다.');
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
        return { success: true, newUserId };
    } catch (error) {
        await connection.rollback();
        return { success: false, message: error.message };
    } finally {
        connection.release();
    }
};
