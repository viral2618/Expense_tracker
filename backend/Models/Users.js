const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, minlength: 3, maxlength: 100 },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },


  otp: { type: Number, default: null },
  otpExpiry: { type: Date, default: null },

  resetPasswordToken: { type: String, default: null },
  resetPasswordExpires: { type: Date, default: null },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
