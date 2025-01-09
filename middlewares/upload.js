import multer from 'multer';
import multerS3 from 'multer-s3';
import path from 'path';
import { S3Client } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';

dotenv.config();

const s3 = new S3Client({
    region: process.env.BUCKET_REGION, // 사용할 리전으로 변경
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID, // 환경변수 또는 IAM 역할 사용
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

const storage = multerS3({
    s3: s3,
    bucket: process.env.BUCKET_NAME,
    // S3에 업로드된 파일을 퍼블릭하게 설정
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, cb) => {
        const fileExtension = path.extname(file.originalname); // 파일 확장자를 분리
        const newFileName = `uploads/${uuidv4()}${fileExtension}`;
        cb(null, newFileName); // S3에 저장될 파일 이름
    },
});

export const upload = multer({ storage });
