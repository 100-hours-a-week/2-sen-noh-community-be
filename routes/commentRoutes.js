import { Router } from 'express';
import {
    getComment,
    addComment,
    deleteComment,
    editComment,
} from '../controllers/commentController.js';

const router = Router();

router.get('/', getComment);
router.post('/', addComment);
router.patch('/:commentId', editComment);
router.delete('/:commentId', deleteComment);

export default router;
