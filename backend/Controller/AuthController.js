const bcrypt = require('bcrypt');
const UserModel = require('../Models/Users');
const jwt = require('jsonwebtoken');

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
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new UserModel({ name, email, password: hashedPassword });
    await newUser.save();

    return res.status(201).json({
      message: 'Signup successful',
      success: true
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

module.exports = {
  signup,
  login
};
