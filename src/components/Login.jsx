// src/components/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ setAuth }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    // Simple fetch to your backend login API
    try {
      const res = await fetch('http://localhost:8000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      if (res.ok) {
        setAuth(true);
        navigate('/');
      } else {
        alert('Invalid Credentials (Try admin/password)');
      }
    } catch (error) {
      console.error(error);
      alert('Backend not connected');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '100px' }}>
      <form onSubmit={handleLogin} style={{ backgroundColor: 'white', padding: '40px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', borderTop: '4px solid #0ea5e9' }}>
        <h2 style={{ color: '#0ea5e9', textAlign: 'center' }}>Warehouse Login</h2>
        <input 
          type="text" 
          placeholder="Username" 
          style={{ display: 'block', width: '250px', padding: '10px', margin: '10px 0', borderRadius: '5px', border: '1px solid #ccc' }}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input 
          type="password" 
          placeholder="Password" 
          style={{ display: 'block', width: '250px', padding: '10px', margin: '10px 0', borderRadius: '5px', border: '1px solid #ccc' }}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#22c55e', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;