import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { roleService } from "../services/api";
import { toast } from "react-hot-toast";
import "./Role.css";

const availableRoles = [
  "Networking Staff",
  "Plumber",
  "Electrician",
  "Software Developer",
  "Application",
  "PC Hardware",
];

const availablePermissions = [
  "View Complaints",
  "Assign Complaints",
  "Resolve Complaints",
  "Close Complaints",
  "Update Status",
  "View Reports",
  "Manage Master Data",
];

const Role = () => {
  const { user } = useContext(AuthContext);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    permissions: [],
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    if (user?.role === "SuperAdmin") {
      fetchRoles();
    }
  }, [user]);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const response = await roleService.getAll();
      setRoles(response.data);
      setError("");
    } catch (err) {
      setError("Failed to fetch roles");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await roleService.update(editingId, formData);
      } else {
        await roleService.create(formData);
      }
      setEditingId(null);
      setShowForm(false);
      toast.success(editingId ? "Role updated!" : "Role created!");
      fetchRoles();
    } catch (err) {
      const msg = "Failed to save role";
      setError(msg);
      toast.error(msg);
    }
  };

  const handleCheckboxChange = (perm) => {
    const updatedPermissions = formData.permissions.includes(perm)
      ? formData.permissions.filter((p) => p !== perm)
      : [...formData.permissions, perm];
    setFormData({ ...formData, permissions: updatedPermissions });
  };

  const handleEdit = (role) => {
    setFormData({
      name: role.name,
      permissions: role.permissions || [],
    });
    setEditingId(role._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        await roleService.delete(id);
        toast.success("Role deleted");
        fetchRoles();
      } catch (err) {
        toast.error("Failed to delete role");
      }
    }
  };

  if (loading)
    return (
      <div className="role-page">
        <p>Loading...</p>
      </div>
    );

  return (
    <div className="role-page">
      <div className="role-page-header">
        <h1>Role Management</h1>
        {user?.role === "SuperAdmin" && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="primary-action-btn"
          >
            {showForm ? "Cancel" : "Add Role"}
          </button>
        )}
      </div>

      {error && <div className="error-banner">{error}</div>}

      {showForm && user?.role === "SuperAdmin" && (
        <form onSubmit={handleSubmit} className="role-form-card">
          <div className="form-group-item">
            <label>Role Name</label>
            <select
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            >
              <option value="">Choose Role</option>
              {availableRoles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group-item">
            <label>Permissions Control</label>
            <div className="permissions-container">
              {availablePermissions.map((perm) => {
                const isChecked = formData.permissions.includes(perm);
                return (
                  <div
                    key={perm}
                    className={`permission-option ${isChecked ? "active" : ""}`}
                    onClick={() => handleCheckboxChange(perm)}
                  >
                    <div className="custom-checkbox">
                      {isChecked && <span className="check-mark">✓</span>}
                    </div>
                    <span className="permission-label">{perm}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <button
            type="submit"
            className="primary-action-btn"
            style={{ width: "100%" }}
          >
            {editingId ? "Update Role" : "Create Role"}
          </button>
        </form>
      )}

      <div className="role-table-card">
        <div className="table-wrapper">
          <table className="role-table">
            <thead>
              <tr>
                <th>Role Name</th>
                <th>Permissions</th>
                {user?.role === "SuperAdmin" && (
                  <th style={{ textAlign: "right" }}>Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {roles.length > 0 ? (
                roles.map((role) => (
                  <tr key={role._id}>
                    <td>
                      <strong>{role.name}</strong>
                    </td>
                    <td style={{ whiteSpace: "normal", maxWidth: "300px" }}>
                      {role.permissions && role.permissions.length > 0
                        ? role.permissions.map((perm, idx) => (
                            <span key={idx} className="permission-tag">
                              {perm}
                            </span>
                          ))
                        : "-"}
                    </td>
                    {user?.role === "SuperAdmin" && (
                      <td style={{ textAlign: "right" }}>
                        <div className="role-actions">
                          <button
                            onClick={() => handleEdit(role)}
                            className="edit-action-btn"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(role._id)}
                            className="delete-action-btn"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={user?.role === "SuperAdmin" ? 4 : 3}
                    style={{
                      textAlign: "center",
                      padding: "2rem",
                      color: "#64748b",
                    }}
                  >
                    No roles found.
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

export default Role;
