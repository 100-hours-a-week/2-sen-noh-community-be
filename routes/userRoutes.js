import { Router } from 'express';
import {
    deleteUser,
    updateUser,
    updatePW,
    getUser,
    logout,
} from '../controllers/userController.js';
import { upload } from '../middlewares/upload.js';

const router = Router();

router.delete('/', deleteUser);
router.patch('/userInfo', upload.single('profile_image'), updateUser);
router.patch('/password', updatePW);
router.get('/', getUser);
router.post('/logout', logout);

export default router;
