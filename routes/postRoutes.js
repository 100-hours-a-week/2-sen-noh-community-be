import { Router } from 'express';
import {
    getPost,
    getDetailPost,
    addPost,
    updatePost,
    deletePost,
    addLike,
    deleteLike,
} from '../controllers/postController.js';
import { upload } from '../middlewares/upload.js';

const router = Router();

router.get('/', getPost);
router.get('/:postId', getDetailPost);
router.post('/', upload.single('post_image'), addPost);
router.patch('/:postId', updatePost);
router.delete('/:postId', deletePost);
router.post('/:postId/like', addLike);
router.delete('/:postId/like', deleteLike);

export default router;
