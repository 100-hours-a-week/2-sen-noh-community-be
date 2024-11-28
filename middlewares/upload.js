import multer from 'multer';
import fs from 'fs';
import path from 'path';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = 'uploads/';

        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true }); // 중간 폴더도 생성 가능하도록 recursive: true 설정
        }

        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const fileExtension = path.extname(file.originalname); // 파일 확장자를 분리
        const fileNameWithoutExt = path.basename(
            file.originalname,
            fileExtension,
        );
        const newFileName = `${fileNameWithoutExt}-${Date.now()}${fileExtension}`; // 날짜와 확장자 포함
        cb(null, newFileName);
    },
});

export const upload = multer({ storage });
