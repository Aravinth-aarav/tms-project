import React, { useContext, useEffect, useState } from "react";
import {
  complaintService,
  departmentService,
  programmeService,
  userService,
} from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-hot-toast";
import "./Reports.css";

const Reports = () => {
  const { user } = useContext(AuthContext);
  const [departments, setDepartments] = useState([]);
  const [programmes, setProgrammes] = useState([]);
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({
    department: "",
    programme: "",
    complaintType: "",
    status: "",
    assignee: "",
  });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Helper function to fetch reports with specific filters
  const fetchReportInternal = async (filterParams) => {
    setError("");
    setLoading(true);
    try {
      const params = { ...filterParams };
      // remove empty
      Object.keys(params).forEach((k) => {
        if (!params[k]) delete params[k];
      });
      const res = await complaintService.report(params);
      setResults(res.data || []);
      toast.success("Report generated successfully!");
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to fetch report";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Load filter options (dropdowns)
  useEffect(() => {
    if (user?.role !== "SuperAdmin") return;
    Promise.all([
      departmentService.getAll(),
      programmeService.getAll(),
      userService.getAll(),
    ])
      .then(([d, p, u]) => {
        setDepartments(d.data || []);
        setProgrammes(p.data || []);
        setUsers(u.data || []);
      })
      .catch((err) => console.error("Failed to load filter data", err));
  }, [user]);

  // Restore state from localStorage on mount OR fetch all by default
  useEffect(() => {
    const savedFilters = localStorage.getItem("superadmin_report_filters");
    const hasGenerated = localStorage.getItem("superadmin_report_generated");

    if (hasGenerated && savedFilters) {
      try {
        const parsedFilters = JSON.parse(savedFilters);
        setFilters(parsedFilters);
        fetchReportInternal(parsedFilters);
      } catch (e) {
        console.error("Failed to parse saved filters", e);
        fetchReportInternal({}); // fallback to all
      }
    } else {
      // First time? Load all activities automatically
      fetchReportInternal({});
    }
    // eslint-disable-next-line
  }, []); // Run only on mount

  const handleManualGenerate = () => {
    // Save to localStorage
    localStorage.setItem("superadmin_report_filters", JSON.stringify(filters));
    localStorage.setItem("superadmin_report_generated", "true");

    // Fetch
    fetchReportInternal(filters);
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm("Are you sure you want to delete this complaint record?")
    )
      return;
    try {
      await complaintService.delete(id);
      // Remove from local state to update UI immediately
      setResults(results.filter((c) => c._id !== id));
      toast.success("Complaint record deleted");
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Failed to delete complaint";
      setError(msg);
      toast.error(msg);
    }
  };

  const exportCSV = () => {
    if (!results.length) return;
    const headers = [
      "Date",
      "Dept",
      "Programme",
      "Block",
      "Room",
      "Type",
      "Remarks",
      "Status",
      "CreatedBy",
      "Assignee",
    ];
    const rows = results.map((r) => [
      new Date(r.createdAt).toLocaleString(),
      r.departmentName || "-",
      r.programmeName || "-",
      r.blockName,
      r.roomNumber,
      r.complaintType,
      (r.remarks || "").replace(/\n/g, " "),
      r.status,
      r.createdBy?.username || r.createdBy?.email || "",
      r.assignedTo?.username || r.assignedTo?.email || "",
    ]);
    const csv = [
      headers.join(","),
      ...rows.map((row) =>
        row.map((cell) => `"${("" + cell).replace(/"/g, '""')}"`).join(","),
      ),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "complaints_report.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Report exported as CSV");
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Pending":
        return "status-badge pending";
      case "Assigned":
        return "status-badge assigned";
      case "In-Progress":
        return "status-badge in-progress";
      case "Onhold":
        return "status-badge onhold";
      case "Completed":
        return "status-badge closed";
      default:
        return "status-badge";
    }
  };

  if (user?.role !== "SuperAdmin") {
    return (
      <div className="reports-page">
        <div className="error-banner">
          Only SuperAdmin can generate reports.
        </div>
      </div>
    );
  }

  return (
    <div className="reports-page">
      <div className="reports-page-header">
        <div className="header-title">
          <h1>Complaint Activity Report</h1>
          <p className="subtitle">
            Automatically tracking system-wide activities
          </p>
        </div>
        {results.length > 0 && (
          <div className="report-summary-stats">
            <div className="stat-pill">
              <span className="stat-label">Total:</span>
              <span className="stat-value">{results.length}</span>
            </div>
            <div className="stat-pill pending">
              <span className="stat-label">Pending:</span>
              <span className="stat-value">
                {results.filter((r) => r.status === "Pending").length}
              </span>
            </div>
            <div className="stat-pill assigned">
              <span className="stat-label">Assigned:</span>
              <span className="stat-value">
                {results.filter((r) => r.status === "Assigned").length}
              </span>
            </div>
            <div className="stat-pill success">
              <span className="stat-label">Completed:</span>
              <span className="stat-value">
                {results.filter((r) => r.status === "Completed").length}
              </span>
            </div>
          </div>
        )}
      </div>

      {error && <div className="error-banner">{error}</div>}

      <div className="filter-card">
        <div className="filter-grid">
          <div className="filter-item">
            <label>Department</label>
            <select
              value={filters.department}
              onChange={(e) =>
                setFilters({ ...filters, department: e.target.value })
              }
            >
              <option value="">All Departments</option>
              {departments.map((d) => (
                <option key={d._id} value={d._id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
          <div className="filter-item">
            <label>Programme</label>
            <select
              value={filters.programme}
              onChange={(e) =>
                setFilters({ ...filters, programme: e.target.value })
              }
            >
              <option value="">All Programmes</option>
              {programmes.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
          <div className="filter-item">
            <label>Complaint Type</label>
            <input
              placeholder="Search Type..."
              value={filters.complaintType}
              onChange={(e) =>
                setFilters({ ...filters, complaintType: e.target.value })
              }
            />
          </div>
          <div className="filter-item">
            <label>Status</label>
            <select
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
            >
              <option value="">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Assigned">Assigned</option>
              <option value="In-Progress">In-Progress</option>
              <option value="Onhold">Onhold</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <div className="filter-item">
            <label>Assignee</label>
            <select
              value={filters.assignee}
              onChange={(e) =>
                setFilters({ ...filters, assignee: e.target.value })
              }
            >
              <option value="">Any Assignee</option>
              {users.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.username} ({u.role})
                </option>
              ))}
            </select>
          </div>
          <div className="filter-actions">
            <button onClick={handleManualGenerate} className="btn-generate">
              <span>🔄</span> Update Report
            </button>
            <button onClick={exportCSV} className="btn-export">
              <span>📥</span> Export CSV
            </button>
            <button
              onClick={() => {
                setFilters({
                  department: "",
                  programme: "",
                  complaintType: "",
                  status: "",
                  assignee: "",
                });
                handleManualGenerate();
              }}
              className="btn-clear"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      <div style={{ marginTop: "2rem" }}>
        {loading ? (
          <p style={{ textAlign: "center", color: "#64748b" }}>
            Generating report...
          </p>
        ) : (
          <div className="reports-table-card">
            <div className="table-wrapper">
              <table className="report-table">
                <thead>
                  <tr>
                    <th>Reported On</th>
                    <th>Last Activity</th>
                    <th>Dept / Prog</th>
                    <th>Location</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Reporter</th>
                    <th>Assignee</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {results.length > 0 ? (
                    results.map((r) => (
                      <tr key={r._id}>
                        <td className="date-cell">
                          <div className="main-date">
                            {new Date(r.createdAt).toLocaleDateString()}
                          </div>
                          <div className="sub-time">
                            {new Date(r.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </td>
                        <td className="activity-cell">
                          {new Date(r.updatedAt).toLocaleDateString() ===
                          new Date(r.createdAt).toLocaleDateString()
                            ? "Just reported"
                            : `${new Date(r.updatedAt).toLocaleDateString()} ${new Date(r.updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`}
                        </td>
                        <td>
                          <div className="dept-text">
                            {r.departmentName || "-"}
                          </div>
                          <div className="sub-text">
                            {r.programmeName || "-"}
                          </div>
                        </td>
                        <td>
                          <div className="block-text">{r.blockName}</div>
                          <div className="sub-text">Room {r.roomNumber}</div>
                        </td>
                        <td>
                          <span className="type-text">{r.complaintType}</span>
                        </td>
                        <td>
                          <span className={getStatusBadge(r.status)}>
                            {r.status}
                          </span>
                        </td>
                        <td>{r.createdBy?.username || r.createdBy?.email}</td>
                        <td>
                          {r.assignedTo ? (
                            <div className="assignee-info">
                              <strong>{r.assignedTo.username}</strong>
                              <span className="sub-role">
                                ({r.assignedTo.role})
                              </span>
                            </div>
                          ) : (
                            <span className="unassigned">-</span>
                          )}
                        </td>
                        <td>
                          <button
                            className="btn-delete-report"
                            onClick={() => handleDelete(r._id)}
                            title="Delete this record"
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="10"
                        style={{
                          textAlign: "center",
                          padding: "2rem",
                          color: "#94a3b8",
                        }}
                      >
                        No results found. Adjust filters and click Generate.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
