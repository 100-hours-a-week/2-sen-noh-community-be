const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController.js');

router.post('/login', authController.login);
router.post('/signIn', authController.signIn);
router.post('/checkEmail', authController.checkEmail);
router.post('/checkNickname', authController.checkNickname);

module.exports = router;
