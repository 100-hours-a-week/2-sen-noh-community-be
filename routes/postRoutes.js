const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

router.get('/', postController.getPost);
router.get('/:postId', postController.getDetailPost);
router.post('/', postController.addPost);
router.patch('/:postId', postController.updatePost);
router.delete('/posts/:postId', postController.deletePost);
router.post('/:postId/like', postController.addLike);

module.exports = router;
