const express = require('express');
const router = express.Router();
const { updateProfile, changePassword, forgotPassword } = require('../Controller/UserController');
const ensureAuthenticated = require('../Middleware/Auth');

// Protected routes
router.put('/update', ensureAuthenticated, updateProfile);
router.put('/change-password', ensureAuthenticated, changePassword);

// Public routes
router.post('/forgot-password', forgotPassword);


module.exports = router;
