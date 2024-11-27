import { Router } from 'express';
import {
    getComment,
    addComment,
    updateComment,
    deleteComment,
} from '../controllers/commentController.js';

const router = Router();

router.get('/', getComment);
router.post('/', addComment);
router.patch('/:commentId', updateComment);
router.delete('/:commentId', deleteComment);

export default router;
