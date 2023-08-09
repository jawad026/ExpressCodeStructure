const express = require('express');
const userServices = require('../services/user.services');
const userController = require('../controller/user/userController');

const router = express.Router();

/* GET users listing. */

router.post('/login', userController.loginUser);
router.get('/logout', userController.logoutUser);
router.post('/signup', userController.signupUser);

// Add the signup route

module.exports = router;
