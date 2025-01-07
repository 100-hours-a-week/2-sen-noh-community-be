import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = 'uploads/';

        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }

        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const fileExtension = path.extname(file.originalname); // 파일 확장자를 분리
        const newFileName = `${uuidv4()}${fileExtension}`;
        cb(null, newFileName);
    },
});

export const upload = multer({ storage });
