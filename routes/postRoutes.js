import { Router } from 'express';
import {
    getPost,
    getDetailPost,
    addPost,
    editPost,
    deletePost,
    addLike,
    deleteLike,
    getEditPost,
} from '../controllers/postController.js';
import { upload } from '../middlewares/upload.js';
import { checkSession } from '../middlewares/session.js';

const router = Router();

router.use(checkSession);
router.get('/', getPost);
router.get('/:postId', getDetailPost);
router.get('/edit/:postId', getEditPost);
router.post('/', upload.single('post_image'), addPost);
router.patch('/:postId', upload.single('post_image'), editPost);
router.delete('/:postId', deletePost);
router.post('/:postId/like', addLike);
router.delete('/:postId/like', deleteLike);

export default router;
