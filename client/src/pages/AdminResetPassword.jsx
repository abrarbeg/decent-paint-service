import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { API_BASE_URL } from "../config"; // ✅ fixed path
import "./AdminLogin.css";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || "Password updated successfully!");
        setTimeout(() => navigate("/admin/login"), 3000);
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (err) {
      setError("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="admin-login-page">
        <div className="admin-login-container">
          <h1>Invalid Link</h1>
          <p>The password reset link is missing or invalid.</p>
          <div className="forgot-password-link">
            <Link to="/admin/forgot-password">Request a new link</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-login-page">
      <div className="admin-login-container">
        <div className="login-icon">🔒</div>
        <h1>Set New Password</h1>
        <h2>Decent Paint Service</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>New Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              required
              minLength={6}
            />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              required
            />
          </div>

          {message && <p className="success-message">{message}</p>}
          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>

          <div className="forgot-password-link">
            <Link to="/admin/login">← Back to Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;