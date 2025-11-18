import React, { useState } from 'react';
import axios from 'axios';

const OtpVerification = ({ email, onSuccess }) => {
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');

  const handleVerify = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:8080/auth/verify-otp', {
        email,
        otp
      });

      if (res.data.success) {
        setMessage(res.data.message);
        // Call a function to continue signup or redirect
        onSuccess();
      } else {
        setMessage(res.data.message);
      }
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error verifying OTP');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', textAlign: 'center' }}>
      <h2>Verify OTP</h2>
      <p>Enter the OTP sent to your email: {email}</p>
      <form onSubmit={handleVerify}>
        <input
          type="number"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
          style={{ padding: '10px', width: '100%', marginBottom: '15px' }}
        />
        <button type="submit" style={{ padding: '10px 20px' }}>Verify</button>
      </form>
      {message && <p style={{ marginTop: '15px' }}>{message}</p>}
    </div>
  );
};

export default OtpVerification;
