const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

// Authentication routes
router.post('/login', userController.login);
router.post('/signup', userController.signup);

// User verification routes
router.get('/checkEmail', userController.checkEmail);
router.get('/checkUsername', userController.checkUsername);

// User profile routes
router.get('/profile', userController.getUserProfile); // Get current user's profile
router.get('/getUserById:userId', userController.getUserDetails); // Get specific user's details
router.put('/updateProfile', userController.updateProfile); // Update profile

// User payments routes

module.exports = router;