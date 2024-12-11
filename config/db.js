// db/database.js
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// MySQL 연결 풀 설정
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '1235',
    database: process.env.DB_NAME || 'community',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

export default pool;
