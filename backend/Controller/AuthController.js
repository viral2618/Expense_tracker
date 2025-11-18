const bcrypt = require('bcrypt');
const UserModel = require('../Models/Users');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/mailer');


const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        message: 'User already exists, you can login',
        success: false
      });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    // Save OTP temporarily in DB or memory (here, in DB for simplicity)
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new UserModel({
      name,
      email,
      password: hashedPassword,
      otp,              // Save OTP
      otpExpiry: Date.now() + 10 * 60 * 1000 // OTP expires in 10 min
    });
    await newUser.save();

    // Send OTP email
    await sendEmail(
      email,
      'Your OTP for MyApp Signup',
      `Hello ${name},\n\nYour OTP is: ${otp}\nIt will expire in 10 minutes.`
    );

    return res.status(200).json({
      message: 'OTP sent to email. Please verify to complete signup.',
      success: true,
      email
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: 'Internal server error',
      success: false
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(403).json({
        message: 'Authentication failed: email or password is incorrect',
        success: false
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(403).json({
        message: 'Authentication failed: email or password is incorrect',
        success: false
      });
    }

    const jwtToken = jwt.sign(
      { email: user.email, _id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    return res.status(200).json({
      message: 'Login successful',
      success: true,
      jwtToken,
      name: user.name,
      email: user.email
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: 'Internal server error',
      success: false
    });
  }
};

const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found', success: false });
    }

    // Check OTP and expiry
    if (user.otp != otp) {
      return res.status(400).json({ message: 'Invalid OTP', success: false });
    }
    if (user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: 'OTP expired', success: false });
    }

    // Clear OTP after verification
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    return res.status(200).json({ message: 'OTP verified, signup complete!', success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error', success: false });
  }
};

const resendOtp = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await UserModel.findOne({ email: email.trim().toLowerCase() });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000);
    user.otp = otp;
    user.otpExpiry = Date.now() + 10 * 60 * 1000; // 10 min
    await user.save();

    // Send OTP email
    await sendEmail(email, 'Your OTP', `Your new OTP is ${otp}. It will expire in 10 minutes.`);

    return res.status(200).json({ success: true, message: 'OTP resent successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Failed to resend OTP' });
  }
};

module.exports = {
  signup,
  login,
  verifyOtp,
  resendOtp,
};
