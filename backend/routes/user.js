const express = require('express');
const userController = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Authentication routes
router.post('/login', userController.login);
router.post('/signup', userController.signup);

// User verification routes
router.get('/checkEmail', userController.checkEmail);
router.get('/checkUsername', userController.checkUsername);

// Protected user profile routes
router.get('/profile', protect, userController.getUserProfile); // Get current user's profile
router.get('/profile/:userId', protect, userController.getUserDetails); // Get specific user's details
router.put('/updateProfile', protect, userController.updateProfile); // Update profile
router.put('/changePassword', protect, userController.changePassword); // Change password

module.exports = router;