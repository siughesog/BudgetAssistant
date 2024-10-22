import React, { useState } from 'react';
import './LoginRegister.css';

function LoginRegister() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:8080/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        alert('Login successful');
      } else {
        alert('Login failed');
      }
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
      <button type="submit">Login/Register</button>
    </form>
  );
}

export default LoginRegister;
