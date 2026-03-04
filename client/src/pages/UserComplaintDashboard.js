import React, { useEffect, useState, useContext, useCallback } from "react";
import { complaintService } from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-hot-toast";
import "./UserComplaintDashboard.css";

const complaintTypes = [
  "PC Hardware",
  "PC Software",
  "Application Issues",
  "Network",
  "Electronics",
  "Plumbing",
  "Other",
];

const StatCard = ({ label, value, color, onClick }) => (
  <div
    className="stat-card"
    style={{ borderTop: `4px solid ${color}` }}
    onClick={onClick}
    role={onClick ? "button" : undefined}
    tabIndex={onClick ? 0 : undefined}
    onKeyDown={
      onClick
        ? (e) => {
            if (e.key === "Enter" || e.key === " ") onClick();
          }
        : undefined
    }
  >
    <div className="stat-value">{value}</div>
    <div className="stat-label">{label}</div>
  </div>
);

const UserComplaintDashboard = () => {
  const { user } = useContext(AuthContext);
  const BASE_URL =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
      ? "http://localhost:5000"
      : "https://tms-project-su5o.onrender.com";
  const [myStats, setMyStats] = useState({
    total: 0,
    pending: 0,
    assigned: 0,
    closed: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [complaints, setComplaints] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");

  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    blockName: "",
    roomNumber: "",
    complaintType: "",
    remarks: "",
    attachment: "",
  });
  const [newAttachment, setNewAttachment] = useState(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await complaintService.getAll();
      const allComplaints = res.data || [];

      // Filter complaints for current user: either created by them or assigned to them
      const userId = user?.id || user?._id;
      const userComplaints = allComplaints.filter((c) => {
        const createdById = c.createdBy?._id || c.createdBy;
        const assignedToId = c.assignedTo?._id || c.assignedTo;
        return (
          String(createdById) === String(userId) ||
          String(assignedToId) === String(userId)
        );
      });
      setComplaints(userComplaints);

      // Calculate stats
      const stats = {
        total: userComplaints.length,
        pending: userComplaints.filter((c) => c.status === "Pending").length,
        assigned: userComplaints.filter((c) => c.status === "Assigned").length,
        closed: userComplaints.filter((c) => c.status === "Completed").length,
      };
      setMyStats(stats);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load complaints");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredComplaints =
    filterStatus === "All"
      ? complaints
      : complaints.filter((c) => c.status === filterStatus);

  const handleEditClick = (complaint) => {
    setEditingId(complaint._id);
    setEditFormData({
      blockName: complaint.blockName || "",
      roomNumber: complaint.roomNumber || "",
      complaintType: complaint.complaintType || "",
      remarks: complaint.remarks || "",
      attachment: complaint.attachment || "",
    });
    setNewAttachment(null);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (
      !window.confirm(
        "Are you sure you want to resubmit this complaint with the updated details?",
      )
    ) {
      return;
    }
    const load = toast.loading("Updating your complaint...");
    const formData = new FormData();
    formData.append("blockName", editFormData.blockName);
    formData.append("roomNumber", editFormData.roomNumber);
    formData.append("complaintType", editFormData.complaintType);
    formData.append("remarks", editFormData.remarks);
    if (newAttachment) {
      formData.append("attachment", newAttachment);
    }

    try {
      await complaintService.update(editingId, formData);
      toast.dismiss(load);
      toast.success("Complaint details updated and resubmitted!");
      setEditingId(null);
      setNewAttachment(null);
      loadData();
    } catch (err) {
      console.error("Update error:", err);
      toast.dismiss(load);
      toast.error(err.response?.data?.message || "Failed to update complaint");
    }
  };

  const handleStatusUpdate = async (id, status) => {
    const load = toast.loading("Updating status...");
    try {
      await complaintService.updateStatus(id, status);
      toast.dismiss(load);
      toast.success(`Status updated to ${status}!`);
      loadData();
    } catch (err) {
      toast.dismiss(load);
      toast.error("Failed to update status");
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Pending":
        return "status-badge status-pending";
      case "Assigned":
        return "status-badge status-assigned";
      case "In-Progress":
        return "status-badge status-in-progress";
      case "Onhold":
        return "status-badge status-onhold";
      case "Completed":
        return "status-badge status-closed";
      default:
        return "status-badge";
    }
  };

  if (loading)
    return (
      <div className="user-complaint-dashboard">
        <p>Loading...</p>
      </div>
    );

  return (
    <div className="user-complaint-dashboard">
      <div className="dashboard-header">
        <h1>My Complaints</h1>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {/* Complaint Status Dashboard */}
      <div>
        <h2
          style={{
            color: "#0f172a",
            marginBottom: "1.5rem",
            fontSize: "1.25rem",
            fontWeight: "600",
          }}
        >
          Complaint Status Overview
        </h2>
        <div className="stats-grid">
          <StatCard
            label="Total Complaints"
            value={myStats.total}
            color="#3b82f6"
            onClick={() => setFilterStatus("All")}
          />
          <StatCard
            label="Completed"
            value={myStats.closed}
            color="#10b981"
            onClick={() => setFilterStatus("Completed")}
          />
        </div>
      </div>

      {/* Edit Complaint Card */}
      {editingId && (
        <div
          className="complaint-details-card edit-card"
          style={{ marginBottom: "2rem" }}
        >
          <div className="details-header">
            <h3>Edit & Resubmit Complaint</h3>
            <button onClick={() => setEditingId(null)} className="close-btn">
              ✕
            </button>
          </div>
          <form onSubmit={handleUpdateSubmit} className="edit-form">
            <div className="details-grid">
              <div className="detail-item">
                <label>Block Name</label>
                <input
                  type="text"
                  className="edit-input"
                  value={editFormData.blockName}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      blockName: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="detail-item">
                <label>Room Number</label>
                <input
                  type="text"
                  className="edit-input"
                  value={editFormData.roomNumber}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      roomNumber: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="detail-item">
                <label>Complaint Type</label>
                <select
                  className="edit-input"
                  value={editFormData.complaintType}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      complaintType: e.target.value,
                    })
                  }
                  required
                >
                  {complaintTypes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="detail-item" style={{ marginTop: "1.5rem" }}>
              <label>Remarks / Issue Details</label>
              <textarea
                className="edit-input textarea"
                value={editFormData.remarks}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, remarks: e.target.value })
                }
                rows="4"
              />
            </div>
            <div className="detail-item" style={{ marginTop: "1.5rem" }}>
              <label>Current Attachment</label>
              <div style={{ marginBottom: "1rem" }}>
                {editFormData.attachment ? (
                  <a
                    href={`${BASE_URL}${editFormData.attachment}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="attachment-link"
                  >
                    View Existing File 📎
                  </a>
                ) : (
                  <span style={{ color: "#64748b", fontSize: "0.9rem" }}>
                    No attachment previously uploaded
                  </span>
                )}
              </div>
              <label>Update Attachment (Optional)</label>
              <input
                type="file"
                className="edit-input"
                onChange={(e) => setNewAttachment(e.target.files[0])}
                accept="image/*,application/pdf"
              />
            </div>
            <div
              className="form-actions"
              style={{ marginTop: "2rem", display: "flex", gap: "1rem" }}
            >
              <button type="submit" className="btn-primary">
                Resubmit Complaint
              </button>
              <button
                type="button"
                onClick={() => setEditingId(null)}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Complaints List */}
      <div className="table-card" style={{ marginTop: "2rem" }}>
        <div className="table-header">
          <h3>
            {filterStatus === "All"
              ? "All Complaints"
              : `${filterStatus} Complaints`}
          </h3>
          <button onClick={() => setFilterStatus("All")} className="btn-reset">
            Reset Filter
          </button>
        </div>

        <div className="table-wrapper">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Block</th>
                <th>Room</th>
                <th>Type</th>
                <th>Remarks</th>
                <th>Status</th>
                <th>Date</th>
                <th>Attachment</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredComplaints.length > 0 ? (
                filteredComplaints.map((complaint) => (
                  <tr key={complaint._id}>
                    <td>{complaint.blockName || "-"}</td>
                    <td>{complaint.roomNumber || "-"}</td>
                    <td>{complaint.complaintType || "-"}</td>
                    <td style={{ maxWidth: "200px", whiteSpace: "normal" }}>
                      {complaint.remarks || "-"}
                    </td>
                    <td>
                      <span className={getStatusBadge(complaint.status)}>
                        {complaint.status}
                      </span>
                    </td>
                    <td>
                      {new Date(complaint.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      {complaint.attachment ? (
                        <a
                          href={`${BASE_URL}${complaint.attachment}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="attachment-link"
                          onClick={(e) => e.stopPropagation()}
                        >
                          View 📎
                        </a>
                      ) : (
                        <span style={{ color: "#94a3b8" }}>No file</span>
                      )}
                    </td>
                    <td>
                      {/* Allow editing only if the user is the creator and it's not completed */}
                      {String(
                        complaint.createdBy?._id || complaint.createdBy,
                      ) === String(user?.id || user?._id) && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditClick(complaint);
                          }}
                          className="btn-edit-small"
                          style={{
                            backgroundColor: "#3b82f6",
                            color: "white",
                            marginRight: "0.5rem",
                          }}
                        >
                          Edit
                        </button>
                      )}

                      {/* Allow status update only if the user is the assignee and it's not completed */}
                      {(String(
                        complaint.assignedTo?._id || complaint.assignedTo,
                      ) === String(user?.id || user?._id) ||
                        user?.role === "SuperAdmin") && (
                        <select
                          className="status-dropdown-small"
                          style={{
                            padding: "0.3rem 0.5rem",
                            fontSize: "0.8rem",
                          }}
                          value={complaint.status}
                          onChange={(e) =>
                            handleStatusUpdate(complaint._id, e.target.value)
                          }
                          onClick={(e) => e.stopPropagation()}
                        >
                          <option value="Assigned">Assigned</option>
                          <option value="In-Progress">In-Progress</option>
                          <option value="Onhold">Onhold</option>
                          <option value="Completed">Completed</option>
                        </select>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    style={{
                      textAlign: "center",
                      padding: "2rem",
                      color: "#64748b",
                    }}
                  >
                    No{" "}
                    {filterStatus === "All"
                      ? "complaints"
                      : `${filterStatus.toLowerCase()} complaints`}{" "}
                    found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserComplaintDashboard;
