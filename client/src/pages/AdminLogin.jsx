import { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // ✅ added Link
import "../pages/AdminLogin.css";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Invalid credentials");
        return;
      }

      // Login successful
      localStorage.setItem("adminAuth", "true");
      navigate("/admin/dashboard");
    } catch (err) {
      setError("Server not responding");
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-container">
        <div className="login-icon">🎨</div>
        <h1>Admin Panel</h1>
        <h2>Decent Paint Service</h2>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </div>

          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="login-btn">🔐 Login</button>

          {/* ✅ Forgot password link */}
          <div className="forgot-password-link">
            <Link to="/admin/forgot-password">Forgot password?</Link>
          </div>
        </form>

        <p className="login-hint">Admin access only</p>
      </div>
    </div>
  );
};

export default AdminLogin;