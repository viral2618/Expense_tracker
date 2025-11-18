const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,          // smtp.gmail.com
  port: Number(process.env.SMTP_PORT),  // 587
  secure: false,                         // TLS
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Test SMTP connection
transporter.verify()
  .then(() => console.log("SMTP ready to send emails"))
  .catch(err => console.error("SMTP connection error:", err));

const sendEmail = async (to, subject, text) => {
  try {
    const info = await transporter.sendMail({
      from: `"Expense_tracker" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text
    });
    console.log("Email sent:", info.messageId);
    return info;
  } catch (err) {
    console.error("Error sending email:", err);
    throw err;
  }
};

module.exports = sendEmail;
