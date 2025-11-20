import React, { useState } from 'react';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) {
      localStorage.setItem('reviewer', username);
      onLogin(username);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Welcome to LLM Feedback Dashboard</h2>
        <p>Please enter your name to continue</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter your name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoFocus
          />
          <button type="submit" className="btn btn-primary">
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
