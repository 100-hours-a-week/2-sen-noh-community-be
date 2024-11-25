import { Router } from 'express';
import {
    login,
    signIn,
    checkEmail,
    checkNickname,
} from '../controllers/authController.js';

const router = Router();

router.post('/login', login);
router.post('/signIn', signIn);
router.post('/checkEmail', checkEmail);
router.post('/checkNickname', checkNickname);

export default router;
