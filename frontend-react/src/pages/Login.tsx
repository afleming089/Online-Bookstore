import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../LoginForm.css";
import { useAuth } from "../contexts/AuthContext.js";
import type { Role } from "../types.js";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [roleHint, setRoleHint] = useState<Role | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      await login(username, password, roleHint);
      navigate("/books");
    } catch (err) {
      setError("Unable to log in with those credentials.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        <label htmlFor="username">Username</label>
        <input
          id="username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          required
        />
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
        <label className="checkbox">
          <input
            type="checkbox"
            checked={roleHint === "ADMIN"}
            onChange={(event) =>
              setRoleHint(event.target.checked ? "ADMIN" : undefined)
            }
          />
          Login as admin
        </label>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
        {error && <p className="login-error">{error}</p>}
      </form>
    </div>
  );
};

export default LoginPage;
