const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

router.get('/', postController.getPost);
router.get('/:postId', postController.getDetailPost);
router.post('/', postController.addPost);
router.patch('/:postId', postController.updatePost);
router.delete('/:postId', postController.deletePost);

module.exports = router;
