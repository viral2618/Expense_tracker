const User = require('../Models/Users');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

// Update profile (name/email)
const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) return res.status(400).json({ success: false, message: 'Name and email required' });

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, email: email.toLowerCase() },
      { new: true }
    );

    res.json({ success: true, message: 'Profile updated', user: updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Change password
const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const match = await bcrypt.compare(oldPassword, user.password);
    if (!match) return res.status(400).json({ success: false, message: 'Old password incorrect' });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ success: true, message: 'Password changed successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Forgot Password (just sends email notification without reset token)
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email is required' });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    // Send simple email notification (optional: tell them to contact admin or login)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Password Assistance',
      text: `Hello ${user.name},\n\nYou requested assistance with your password. Please log in and change it if needed.`,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ success: true, message: 'Password assistance email sent' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Failed to send email' });
  }
};

module.exports = {
  updateProfile,
  changePassword,
  forgotPassword,
};
