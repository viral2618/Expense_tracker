const router = require('express').Router();
const { signup, login } = require('../Controller/AuthController');
const {signupValidation, loginValidation}=require('../Middleware/AuthValidation')


router.post('/signup',signupValidation,signup);
router.post('/login',loginValidation,login)

module.exports= router;