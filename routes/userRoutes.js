const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.delete('/:userId', userController.deleteUser);
router.patch('/:userId/userInfo', userController.updateUser);

module.exports = router;
