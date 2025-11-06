import React from "react";
import './LoginForm.css'

function LoginForm({ onLoginSuccess }) {
  const handleLogin = (e) => {
    e.preventDefault();
    // Just call the callback to show the main
    if (onLoginSuccess) {
      onLoginSuccess();
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Sign In</h2>

        <label>Username</label>
        <input
          type="text"
          placeholder="Enter user ID"
        />

        <label>Password</label>
        <input
          type="password"
          placeholder="Enter password"
        />

        <button type="submit">Sign In</button>
      </form>
    </div>
  );
}

export default LoginForm;

