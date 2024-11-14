const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.delete('/:userId', userController.deleteUser);

module.exports = router;
