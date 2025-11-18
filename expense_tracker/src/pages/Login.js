import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../utils';
import 'react-toastify/dist/ReactToastify.css';
import './Login.css';

function Login() {
  const [loginInfo, setLoginInfo] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginInfo({ ...loginInfo, [name]: value });
  };

  const handleLogin = async () => {
    const { email, password } = loginInfo;
    if (!email || !password) return handleError('Email and Password required');

    try {
      const response = await fetch('http://localhost:8080/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginInfo),
      });

      const result = await response.json();
      const { success, messages, jwtToken, name } = result;

      if (success) {
        handleSuccess(messages);
        localStorage.setItem('token', jwtToken);
        localStorage.setItem('loggedInUser', name);
        localStorage.setItem('email', email); // Save email
        setTimeout(() => navigate('/home'), 1000);
      } else {
        handleError(messages || 'Login failed');
      }
    } catch (err) {
      handleError(err.message);
    }
  };

  return (
    <div className='login-page'>
      <div className='login-container'>
        <h1>Login</h1>
        <form>
          <input
            type="email"
            placeholder="Email"
            name="email"
            value={loginInfo.email}
            onChange={handleChange}
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={loginInfo.password}
            onChange={handleChange}
          />
          <button type="button" onClick={handleLogin}>
            Login
          </button>
        </form>

        <p>
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>

        <ToastContainer />
      </div>
    </div>
  );
}

export default Login;
