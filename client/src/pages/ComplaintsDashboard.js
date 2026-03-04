import React, { useEffect, useState, useContext } from "react";
import { complaintService, userService } from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-hot-toast";
import "./ComplaintsDashboard.css";

const ComplaintsDashboard = () => {
  const { user } = useContext(AuthContext);
  const BASE_URL =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
      ? "http://localhost:5000"
      : "https://tms-project-su5o.onrender.com";
  const [complaints, setComplaints] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    assigned: 0,
    closed: 0,
  });
  const [listLoading, setListLoading] = useState(true);
  const [error, setError] = useState("");
  const [assignTarget, setAssignTarget] = useState({
    complaintId: null,
    assignee: "",
  });

  useEffect(() => {
    const load = async () => {
      try {
        setListLoading(true);
        const res = await complaintService.getAll();
        setComplaints(res.data || []);
        // fetch stats too
        try {
          const s = await complaintService.getStats();
          setStats(s.data || { total: 0, pending: 0, assigned: 0, closed: 0 });
        } catch (e) {}
      } catch (err) {
        setError("Failed to load complaints");
      } finally {
        setListLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (user?.role === "SuperAdmin") {
      userService
        .getAll()
        .then((res) => setUsers(res.data || []))
        .catch(() => {});
    }
  }, [user]);

  const refresh = async () => {
    try {
      const res = await complaintService.getAll();
      setComplaints(res.data || []);
      try {
        const s = await complaintService.getStats();
        setStats(s.data || { total: 0, pending: 0, assigned: 0, closed: 0 });
      } catch (e) {}
      toast.success("Dashboard data refreshed");
    } catch (e) {
      toast.error("Refresh failed");
    }
  };

  const handleAssignClick = (id) =>
    setAssignTarget({ complaintId: id, assignee: "" });
  const handleAssignSubmit = async () => {
    if (!assignTarget.assignee) return setError("Select an assignee");
    try {
      await complaintService.assign(
        assignTarget.complaintId,
        assignTarget.assignee,
      );
      setAssignTarget({ complaintId: null, assignee: "" });
      toast.success("Staff assigned successfully!", { icon: "👤" });
      refresh();
    } catch (err) {
      const msg = "Failed to assign staff";
      setError(msg);
      toast.error(msg);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await complaintService.updateStatus(id, status);
      toast.success(`Status updated to ${status}!`);
      refresh();
    } catch (err) {
      const msg = "Failed to update status";
      setError(msg);
      toast.error(msg);
    }
  };

  const getReporterColor = (name) => {
    const colors = [
      { bg: "#e0e7ff", text: "#1e40af", border: "#bfdbfe" }, // Indigo
      { bg: "#f0fdf4", text: "#15803d", border: "#bbf7d0" }, // Green
      { bg: "#fff7ed", text: "#9a3412", border: "#fed7aa" }, // Orange
      { bg: "#faf5ff", text: "#6b21a8", border: "#e9d5ff" }, // Purple
      { bg: "#fdf2f8", text: "#9d174d", border: "#fbcfe8" }, // Pink
    ];
    if (!name) return colors[0];
    const charCode = name.charCodeAt(0) + name.length;
    return colors[charCode % colors.length];
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Pending":
        return "status-badge pending";
      case "In-Progress":
        return "status-badge in-progress";
      case "Completed":
        return "status-badge closed";
      case "Onhold":
        return "status-badge onhold";
      default:
        return "status-badge";
    }
  };

  return (
    <div className="complaints-dashboard">
      <div className="bg-blob blob-1"></div>
      <div className="bg-blob blob-2"></div>

      <div className="dashboard-container">
        <header className="dashboard-header">
          <div className="header-content">
            <span className="premium-badge">Complaint Center</span>
            <h1>Operations Dashboard</h1>
            <p className="header-subtitle">
              Monitor and manage facility tickets in real-time
            </p>
          </div>
          <button onClick={refresh} className="refresh-btn">
            <span className="refresh-icon">🔄</span>
            Refresh Data
          </button>
        </header>

        {error && <div className="error-banner">{error}</div>}

        <div className="stats-grid">
          <div className="stat-card total">
            <div className="stat-icon-bg">📊</div>
            <div className="stat-info">
              <span className="stat-value">{stats.total}</span>
              <span className="stat-label">Total Tickets</span>
            </div>
            <div className="stat-progress total-bar"></div>
          </div>
          <div className="stat-card pending">
            <div className="stat-icon-bg">⏳</div>
            <div className="stat-info">
              <span className="stat-value">{stats.pending}</span>
              <span className="stat-label">Pending</span>
            </div>
            <div className="stat-progress pending-bar"></div>
          </div>
          <div className="stat-card assigned">
            <div className="stat-icon-bg">👤</div>
            <div className="stat-info">
              <span className="stat-value">{stats.assigned}</span>
              <span className="stat-label">Assigned</span>
            </div>
            <div className="stat-progress assigned-bar"></div>
          </div>
          <div className="stat-card resolved">
            <div className="stat-icon-bg">✅</div>
            <div className="stat-info">
              <span className="stat-value">{stats.closed}</span>
              <span className="stat-label">Resolved</span>
            </div>
            <div className="stat-progress resolved-bar"></div>
          </div>
        </div>

        <div className="table-card">
          <div className="table-header">
            <h2>Active Complaints</h2>
            <div className="table-filters">
              <span className="filter-chip active">All Activities</span>
            </div>
          </div>
          {listLoading ? (
            <div style={{ padding: "2rem", textAlign: "center" }}>
              Loading...
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="complaints-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Dept / Prog</th>
                    <th>Block / Room</th>
                    <th>Type</th>
                    <th>Remarks</th>
                    <th>Status</th>
                    <th>Raised By</th>
                    <th>Assigned To</th>
                    <th>Attachment</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {complaints.length > 0 ? (
                    complaints.map((c) => {
                      const isAssignee =
                        c.assignedTo &&
                        String(c.assignedTo._id || c.assignedTo) ===
                          String(user?.id || user?._id);
                      return (
                        <tr key={c._id}>
                          <td>{new Date(c.createdAt).toLocaleDateString()}</td>
                          <td>
                            <div className="dept-text">
                              {c.departmentName || "-"}
                            </div>
                            <div className="sub-text">
                              {c.programmeName || "-"}
                            </div>
                          </td>
                          <td>
                            <strong>{c.blockName}</strong>
                            <br />
                            <span
                              style={{ fontSize: "0.85em", color: "#64748b" }}
                            >
                              Room {c.roomNumber}
                            </span>
                          </td>
                          <td>
                            {c.complaintType}
                            {c.isEdited && (
                              <div
                                style={{
                                  fontSize: "0.7rem",
                                  backgroundColor: "#fff7ed",
                                  color: "#c2410c",
                                  border: "1px solid #fdba74",
                                  padding: "2px 6px",
                                  borderRadius: "4px",
                                  display: "inline-block",
                                  marginLeft: "8px",
                                  fontWeight: "800",
                                  letterSpacing: "0.5px",
                                }}
                              >
                                REVISED
                              </div>
                            )}
                          </td>
                          <td
                            style={{ maxWidth: "200px", whiteSpace: "normal" }}
                          >
                            {c.remarks || "-"}
                          </td>
                          <td>
                            <span className={getStatusBadgeClass(c.status)}>
                              {c.status}
                            </span>
                          </td>
                          <td>
                            <span
                              className="reporter-badge"
                              style={{
                                background: getReporterColor(
                                  c.createdBy?.username || c.createdBy?.email,
                                ).bg,
                                color: getReporterColor(
                                  c.createdBy?.username || c.createdBy?.email,
                                ).text,
                                borderColor: getReporterColor(
                                  c.createdBy?.username || c.createdBy?.email,
                                ).border,
                              }}
                            >
                              {c.createdBy?.username ||
                                c.createdBy?.email ||
                                "-"}
                            </span>
                          </td>
                          <td>
                            {c.assignedTo ? (
                              <div className="assignee-info">
                                <strong>{c.assignedTo.username}</strong>
                                <span className="assignee-role">
                                  ({c.assignedTo.role})
                                </span>
                              </div>
                            ) : (
                              <span className="unassigned">Unassigned</span>
                            )}
                          </td>
                          <td>
                            <div className="attachment-cell">
                              {c.attachment ? (
                                <a
                                  href={`${BASE_URL}${c.attachment}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="attachment-preview"
                                  title="View Attachment"
                                >
                                  📄 View File
                                </a>
                              ) : (
                                <span className="no-file">None</span>
                              )}
                            </div>
                          </td>
                          <td>
                            <div className="action-buttons">
                              {/* Status Update for Assignee or SuperAdmin */}
                              {(isAssignee || user?.role === "SuperAdmin") && (
                                <div className="status-update-container">
                                  <select
                                    className="status-dropdown-small"
                                    onChange={(e) =>
                                      handleStatusUpdate(c._id, e.target.value)
                                    }
                                    defaultValue={c.status}
                                  >
                                    <option value="Assigned">Assigned</option>
                                    <option value="In-Progress">
                                      In-Progress
                                    </option>
                                    <option value="Onhold">Onhold</option>
                                    <option value="Completed">Completed</option>
                                  </select>
                                </div>
                              )}

                              {user?.role === "SuperAdmin" &&
                                (assignTarget.complaintId === c._id ? (
                                  <div className="assign-action-container">
                                    <select
                                      value={assignTarget.assignee}
                                      onChange={(e) =>
                                        setAssignTarget({
                                          ...assignTarget,
                                          assignee: e.target.value,
                                        })
                                      }
                                      className="assign-dropdown"
                                    >
                                      <option value="">Choose Staff</option>
                                      {users
                                        .filter(
                                          (u) =>
                                            u.role !== "SuperAdmin" &&
                                            u.role !== "User",
                                        )
                                        .map((u) => (
                                          <option key={u._id} value={u._id}>
                                            {u.username} ({u.role})
                                          </option>
                                        ))}
                                    </select>
                                    <button
                                      onClick={handleAssignSubmit}
                                      className="action-btn confirm-btn"
                                    >
                                      ✓
                                    </button>
                                    <button
                                      onClick={() =>
                                        setAssignTarget({
                                          complaintId: null,
                                          assignee: "",
                                        })
                                      }
                                      className="action-btn secondary cancel-btn"
                                    >
                                      ✕
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => handleAssignClick(c._id)}
                                    className="action-btn"
                                  >
                                    {c.assignedTo ? "Reassign" : "Assign Staff"}
                                  </button>
                                ))}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan="8"
                        style={{
                          textAlign: "center",
                          padding: "2rem",
                          color: "#64748b",
                        }}
                      >
                        No complaints found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComplaintsDashboard;
