import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LoginForm = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const toggleForm = () => {
    setIsLogin(!isLogin);
    resetFormFields();
    setError('');
  };

  const resetFormFields = () => { 
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    setEmail('');
    setError('');
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:8000/api/token/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);  
      onLoginSuccess(username);
      navigate('/');
      toast.success(`Welcome back, ${username}!`, {
        position: 'top-center',
        autoClose: 1500,
    });
    } else {
      setError('Invalid credentials');
      setTimeout(() => {
        setError('');
      }, 2000);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setTimeout(() => {
        setError('');
      }, 2000);
      return;
    }
    if (!validateEmail(email)) {
      setError('Invalid email format');
      return;
    }
    try {
      const response = await fetch('http://localhost:8000/api/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password, confirm_password: confirmPassword }),
      });

      if (response.ok) {
        toggleForm();
        toast.success('Registration successful! Please login to continue.', {
          position: 'top-center',
          autoClose: 2000,
        })
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Registration failed');
      }
    } catch (err) {
      setError('Fetch error: ' + err.message);
    }
  };

  return (
    <div className={`text-black ${isLogin ? 'w-60' : 'w-70'} mx-auto`}>
      {isLogin ? (
        <div>
          <h2 className='text-2xl font-bold mb-6'>Login</h2>
          <form onSubmit={handleLogin} className='space-y-6'>
            <div>
              <label className='block text-sm font-medium text-gray-700'>Username:</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700'>Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
              />
            </div>
            {error && <p className='text-red-500 text-sm'>{error}</p>}
            <button
              type="submit"
              className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
            >
              Login
            </button>
          </form>
          <p className='mt-4'>
            Don't have an account? <button onClick={toggleForm} className='text-indigo-600 hover:text-indigo-800'>Register</button>
          </p>
        </div>
      ) : (
        <div>
          <h2 className='text-2xl font-bold mb-6'>Register</h2>
          <form onSubmit={handleRegister} className='space-y-6'>
            <div>
              <label className='block text-sm font-medium text-gray-700'>Username:</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700'>Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700'>Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700'>Confirm Password:</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
              />
            </div>
            {error && <p className='text-red-500 text-sm'>{error}</p>}
            <button
              type="submit"
              className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
            >
              Register
            </button>
          </form>
          <p className='mt-4'>
            Already have an account? <button onClick={toggleForm} className='text-indigo-600 hover:text-indigo-800'>Login</button>
          </p>
        </div>
      )}
    </div>
  );
};

export default LoginForm;