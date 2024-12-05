import { Router } from 'express';
import {
    getComment,
    addComment,
    deleteComment,
    editComment,
} from '../controllers/commentController.js';
import { checkSession } from '../middlewares/session.js';

const router = Router();

router.use(checkSession);
router.get('/', getComment);
router.post('/', addComment);
router.patch('/:commentId', editComment);
router.delete('/:commentId', deleteComment);

export default router;
