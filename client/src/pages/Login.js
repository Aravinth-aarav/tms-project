import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-hot-toast";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      toast.success("Welcome back!", {
        icon: "👋",
        duration: 3000,
      });
      navigate("/dashboard");
    } catch (err) {
      const msg =
        err.response?.data?.message || "Login failed. Please try again.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <nav className="login-navbar">
        <div className="navbar-logo">
          <span className="logo-icon">T</span>
          <span>TMS</span>
        </div>
        <div className="navbar-links">
          <button onClick={() => setShowAbout(true)} className="nav-btn">
            About
          </button>
          <button onClick={() => setShowSupport(true)} className="nav-btn">
            Support
          </button>
        </div>
      </nav>
      <div className="login-card">
        <h1>Login to TMS</h1>
        <p className="subtitle">Ticket Management System</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                maxLength="25"
                style={{ paddingRight: "3rem" }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "1rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#64748b",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 0,
                }}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="login-btn">
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* <p className="demo-info">
          Demo: Use SuperAdmin credentials created via Postman
        </p> */}
      </div>

      {/* About Modal */}
      {showAbout && (
        <div
          className="login-modal-overlay"
          onClick={() => setShowAbout(false)}
        >
          <div
            className="login-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>About TMS</h2>
              <button
                className="close-modal"
                onClick={() => setShowAbout(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <p>
                The Ticket Management System (TMS) is a streamlined platform
                designed to bridge the gap between facility issues and technical
                resolutions. Our system ensures every complaint is tracked,
                assigned to the right expert, and resolved with total
                transparency.
              </p>
              <div className="features-list">
                <div className="feature-item">
                  <span>🚀</span> Real-time tracking
                </div>
                <div className="feature-item">
                  <span>🔧</span> Expert assignment
                </div>
                <div className="feature-item">
                  <span>📊</span> Detailed reports
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Support Modal */}
      {showSupport && (
        <div
          className="login-modal-overlay"
          onClick={() => setShowSupport(false)}
        >
          <div
            className="login-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>Technical Support</h2>
              <button
                className="close-modal"
                onClick={() => setShowSupport(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <p>
                Need help? Our support team is available to assist you with any
                technical issues or platform guidance.
              </p>
              <div className="support-contact">
                <div className="contact-info">
                  <strong>📧 Email:</strong> support@tms.example.com
                </div>
                <div className="contact-info">
                  <strong>📍 Desk:</strong> IT Help Desk, Block A - Room 102
                </div>
                <div className="contact-info">
                  <strong>🕒 Hours:</strong> 24/7 for urgent issues
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
