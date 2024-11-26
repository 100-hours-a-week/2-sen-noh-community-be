import { Router } from 'express';
import {
    deleteUser,
    updateUser,
    updatePW,
    getUser,
    logout,
} from '../controllers/userController.js';

const router = Router();

router.delete('/:userId', deleteUser);
router.patch('/:userId/userInfo', updateUser);
router.patch('/:userId/password', updatePW);
router.get('/:userId', getUser);
router.post('/logout', logout);

export default router;
