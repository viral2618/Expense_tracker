import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../utils';
import './Signup.css';

function Signup() {
  const [signInfo, setSignInfo] = useState({ name: '', email: '', password: '' });
  const [step, setStep] = useState(1); // 1 = signup form, 2 = OTP verification
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSignInfo({ ...signInfo, [name]: value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const { name, email, password } = signInfo;
    if (!name || !email || !password) return handleError('All fields required');

    try {
      const response = await fetch('http://localhost:8080/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signInfo)
      });
      const result = await response.json();
      const { success, message } = result;

      if (success) {
        handleSuccess('OTP sent to your email');
        setStep(2); // Move to OTP verification step
      } else {
        handleError(message || 'Signup failed');
      }
    } catch (err) {
      handleError(err.message);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp) return handleError('Enter the OTP');

    try {
      const response = await fetch('http://localhost:8080/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: signInfo.email, otp })
      });
      const result = await response.json();
      const { success, message } = result;

      if (success) {
        handleSuccess('Signup complete!');
        setTimeout(() => navigate('/login'), 1000);
      } else {
        handleError(message || 'OTP verification failed');
      }
    } catch (err) {
      handleError(err.message);
    }
  };

  if (step === 2) {
    return (
      <div className='signup-page'>
        <div className="signup-container">
          <h1>Verify OTP</h1>
          <p>Enter the OTP sent to: {signInfo.email}</p>
          <form onSubmit={handleVerifyOtp}>
            <input
              type="number"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button type="submit">Verify OTP</button>
          </form>
          <ToastContainer />
        </div>
      </div>
    );
  }

  return (
    <div className='signup-page'>
      <div className="signup-container">
        <h1>Sign Up</h1>
        <form onSubmit={handleSignup}>
          <input type="text" placeholder="Name" name="name" value={signInfo.name} onChange={handleChange} />
          <input type="email" placeholder="Email" name="email" value={signInfo.email} onChange={handleChange} />
          <input type="password" placeholder="Password" name="password" value={signInfo.password} onChange={handleChange} />
          <br/>
          <button type="submit">Sign Up</button>
        </form>
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
        <ToastContainer />
      </div>
    </div>
  );
}

export default Signup;
