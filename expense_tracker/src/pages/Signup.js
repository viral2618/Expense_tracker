import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../utils';
import './Signup.css';

function Signup() {
  const [signInfo, setSignInfo] = useState({ name: '', email: '', password: '' });
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
      const { success, messages } = result;

      if (success) {
        handleSuccess(messages);
        setTimeout(() => navigate('/login'), 1000);
      } else {
        handleError(messages || 'Signup failed');
      }
    } catch (err) {
      handleError(err.message);
    }
  };

  return (
    <div className='signup-page'>
    <div className="signup-container">
      <h1>Sign Up</h1>
      <form onSubmit={handleSignup}>
        <input type="text" placeholder="Name" name="name" value={signInfo.name} onChange={handleChange} />
        <input type="email" placeholder="Email" name="email" value={signInfo.email} onChange={handleChange} />
        <input type="password" placeholder="Password" name="password" value={signInfo.password} onChange={handleChange} /> <br/>
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
