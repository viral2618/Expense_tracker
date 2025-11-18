const router = require('express').Router();
const { signup, login ,verifyOtp,resendOtp} = require('../Controller/AuthController');
const {signupValidation, loginValidation}=require('../Middleware/AuthValidation')


router.post('/signup',signupValidation,signup);
router.post('/login',loginValidation,login)
router.post('/verify-otp', verifyOtp);
router.post('/resend-otp', resendOtp); 

module.exports= router;