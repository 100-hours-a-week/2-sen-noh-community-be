import { Router } from 'express';
import {
    deleteUser,
    updateUser,
    updatePW,
    getUser,
} from '../controllers/userController.js';

const router = Router();

router.delete('/:userId', deleteUser);
router.patch('/:userId/userInfo', updateUser);
router.patch('/:userId/password', updatePW);
router.get('/:userId', getUser);

export default router;
