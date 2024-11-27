import { Router } from 'express';
import {
    login,
    signIn,
    checkEmail,
    checkNickname,
    upload,
} from '../controllers/authController.js';

const router = Router();

router.post('/login', login);
router.post('/signIn', upload.single('profile_image'), signIn);
router.post('/checkEmail', checkEmail);
router.post('/checkNickname', checkNickname);

export default router;
