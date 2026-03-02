import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./Home.css";

const Home = () => {
  const { user, isAuthenticated } = useContext(AuthContext);

  const adminLinks = [
    {
      to: "/departments",
      label: "Departments",
      icon: "🏢",
      desc: "Manage campus departments",
    },
    {
      to: "/programmes",
      label: "Programmes",
      icon: "📚",
      desc: "Manage degree programmes",
    },
    {
      to: "/blocks",
      label: "Blocks",
      icon: "🏗️",
      desc: "Configure building blocks",
    },
    {
      to: "/rooms",
      label: "Rooms",
      icon: "🚪",
      desc: "Maintain room database",
    },
    {
      to: "/roles",
      label: "Roles",
      icon: "🛡️",
      desc: "Set access permissions",
    },
    {
      to: "/users",
      label: "Users",
      icon: "👥",
      desc: "System user management",
    },
  ];

  const userActions = [
    {
      to: "/complaints/new",
      label: "Raise Complaint",
      icon: "✏️",
      desc: "Submit a new ticket",
      primary: true,
    },
    {
      to: "/my-complaints",
      label: "My History",
      icon: "📋",
      desc: "Track your active tickets",
    },
    {
      to: "/dashboard",
      label: "Overview",
      icon: "🏠",
      desc: "View your personal dashboard",
    },
  ];

  return (
    <div className="home-page">
      {/* Abstract Background Elements */}
      <div className="bg-blob blob-1"></div>
      <div className="bg-blob blob-2"></div>
      <div className="bg-blob blob-3"></div>

      <div className="home-container">
        {/* Welcome Section */}
        <header className="welcome-header">
          <div className="welcome-content">
            <div className="badge-container">
              <span className="premium-badge">Platform Dashboard</span>
            </div>
            <h1>
              {isAuthenticated ? (
                <>
                  Good Morning,{" "}
                  <span className="highlight">
                    {user?.username || "Researcher"}
                  </span>
                </>
              ) : (
                <>
                  Welcome to <span className="highlight">TMS</span>
                </>
              )}
            </h1>
            <p className="welcome-text">
              {isAuthenticated
                ? `You're logged in as ${user?.role}. Focus on resolving issues and improving facility management today.`
                : "The advanced Ticket Management System for modern institutions. Streamline your workflow with ease."}
            </p>
          </div>
          {isAuthenticated && (
            <div className="profile-brief">
              <div className="brief-avatar">
                {user?.username?.charAt(0).toUpperCase()}
              </div>
              <div className="brief-info">
                <span className="brief-role">{user?.role}</span>
                <span className="brief-status">Online</span>
              </div>
            </div>
          )}
        </header>

        {isAuthenticated ? (
          <div className="dashboard-content">
            <section className="philosophy-section">
              <div className="section-title">
                <h2>Our Mission</h2>
                <span className="premium-badge">Platform Vision</span>
              </div>
              <div className="philosophy-grid">
                <div className="phi-card">
                  <div className="phi-icon">🎯</div>
                  <h3>Precision Tracking</h3>
                  <p>
                    Every ticket is monitored from submission to final
                    resolution with absolute transparency.
                  </p>
                </div>
                <div className="phi-card">
                  <div className="phi-icon">⚡</div>
                  <h3>Rapid Response</h3>
                  <p>
                    Our intelligent system ensures that the right staff is
                    alerted the moment a complaint is raised.
                  </p>
                </div>
                <div className="phi-card">
                  <div className="phi-icon">📈</div>
                  <h3>Data Driven</h3>
                  <p>
                    Analytics help us identify recurring issues and improve
                    campus facility maintenance permanently.
                  </p>
                </div>
              </div>
            </section>

            {/* Quick Actions Grid */}
            <section className="actions-section">
              <div className="section-title">
                <h2>
                  {user?.role === "SuperAdmin"
                    ? "Master Management"
                    : "Quick Actions"}
                </h2>
              </div>
              <div className="actions-grid">
                {(user?.role === "SuperAdmin"
                  ? adminLinks
                  : userActions.filter((action) => {
                      if (
                        action.to === "/complaints/new" &&
                        user?.role !== "User"
                      )
                        return false;
                      return true;
                    })
                ).map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`action-card ${link.primary ? "is-primary" : ""}`}
                  >
                    <div className="action-icon">{link.icon}</div>
                    <div className="action-info">
                      <span className="action-label">{link.label}</span>
                      <span className="action-desc">{link.desc}</span>
                    </div>
                    <div className="action-arrow">→</div>
                  </Link>
                ))}
              </div>
            </section>

            {/* Help/Inspiration Card */}
            <footer className="dashboard-footer">
              <div className="help-card">
                <div className="help-icon">💡</div>
                <div className="help-text">
                  <h3>Need Assistance?</h3>
                  <p>
                    Check our documentation or contact the system administrator
                    for technical support.
                  </p>
                </div>
                <button className="help-btn">Get Help</button>
              </div>
            </footer>
          </div>
        ) : (
          <div className="guest-content">
            <div className="guest-card">
              <div className="guest-icon">🔒</div>
              <h2>Access Restricted</h2>
              <p>
                Please log in with your credentials to access your personalized
                workspace and tools.
              </p>
              <Link to="/login" className="cta-login-btn">
                Log In to Start
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
