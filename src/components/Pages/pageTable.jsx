import { useEffect, useState } from "react";
import SimpleTable from "../shared/SimpleTable";
import ConfirmDialog from "../shared/ConfirmDialog";
import { useToast } from "../shared/Toast";

export default function JobTable() {
  const toast = useToast();

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);

  // CRUD UI state
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    jobTitle: "",
    jobLink: "",
    location: "",
    status: "",
    description: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const [editOpen, setEditOpen] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [editForm, setEditForm] = useState({
    jobTitle: "",
    jobLink: "",
    location: "",
    status: "",
    description: "",
  });
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [editError, setEditError] = useState(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState(null);

  const columns = [
    { key: "id", header: "ID" },
    { key: "jobTitle", header: "Job Title" },
    { key: "jobLink", header: "Job Link" },
    { key: "location", header: "Location" },
    { key: "status", header: "Status" },
    { key: "description", header: "Description" },
    {
      key: "createdAt",
      header: "Created At",
      render: (row) =>
        row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "",
    },
    {
      key: "actions",
      header: "",
      render: (row) => (
        <div className="flex items-center gap-1">
          <button
            type="button"
            title="Edit"
            className="text-gray-700 hover:text-black p-2"
            onClick={() => onStartEdit(row)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path d="M4 15.5V20h4.5L19.81 8.69l-4.5-4.5L4 15.5zm17.71-10.04a1.004 1.004 0 000-1.42l-1.75-1.75a1.004 1.004 0 00-1.42 0l-1.83 1.83 4.5 4.5 1.5-1.16z" />
            </svg>
          </button>
          <button
            type="button"
            title="Delete"
            className="text-red-600 hover:text-red-700 p-2"
            onClick={() => onDelete(row)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path d="M9 3a1 1 0 00-1 1v1H5.5a1 1 0 000 2H6v12a2 2 0 002 2h8a2 2 0 002-2V7h.5a1 1 0 000-2H16V4a1 1 0 00-1-1H9zm2 2h4v1h-4V5zm-1 4a1 1 0 012 0v8a1 1 0 11-2 0V9zm6 0a1 1 0 10-2 0v8a1 1 0 102 0V9z" />
            </svg>
          </button>
        </div>
      ),
    },
  ];

  // Load jobs
  const loadJobs = async (p = page, l = limit) => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams({ page: String(p), limit: String(l) });
      const res = await fetch(`/api/job?${params.toString()}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const any = await res.json();
      const list = Array.isArray(any?.data)
        ? any.data
        : Array.isArray(any)
        ? any
        : [];

      const mapped = list.map((it) => ({
        id: it.id ?? it._id ?? "",
        jobTitle: String(it.jobTitle ?? ""),
        jobLink: String(it.jobLink ?? ""),
        location: String(it.location ?? ""),
        status: String(it.status ?? ""),
        description: String(it.description ?? ""),
        createdAt: it.createdAt ?? "",
      }));

      setRows(mapped);

      const newTotal = Number(
        any?.total ?? any?.count ?? total ?? mapped.length
      );
      const newPage = Number(any?.page ?? p);
      const newLimit = Number(any?.limit ?? l);

      if (!Number.isNaN(newTotal)) setTotal(newTotal);
      if (!Number.isNaN(newPage)) setPage(newPage);
      if (!Number.isNaN(newLimit)) setLimit(newLimit);
    } catch (e) {
      setError(e?.message || "Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  // --- Create ---
  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.jobTitle.trim()) {
      setSubmitError("Job title is required");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/job", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      toast.success("Job created");
      setShowForm(false);
      setForm({
        jobTitle: "",
        jobLink: "",
        location: "",
        status: "",
        description: "",
      });
      await loadJobs();
    } catch (e) {
      setSubmitError(e?.message || "Failed to create job");
      toast.error(e?.message || "Failed to create job");
    } finally {
      setSubmitting(false);
    }
  };

  // --- Edit ---
  const onStartEdit = (row) => {
    setEditRow(row);
    setEditForm({
      jobTitle: row.jobTitle || "",
      jobLink: row.jobLink || "",
      location: row.location || "",
      status: row.status || "",
      description: row.description || "",
    });
    setEditError(null);
    setEditOpen(true);
  };

  const onSubmitEdit = async (e) => {
    e.preventDefault();
    if (!editRow) return;
    if (!editForm.jobTitle.trim()) {
      setEditError("Job title is required");
      return;
    }
    setEditSubmitting(true);
    try {
      const res = await fetch(`/api/job/${encodeURIComponent(editRow.id)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      toast.success("Job updated");
      setEditOpen(false);
      setEditRow(null);
      await loadJobs(page, limit);
    } catch (e) {
      setEditError(e?.message || "Failed to update job");
      toast.error(e?.message || "Failed to update job");
    } finally {
      setEditSubmitting(false);
    }
  };

  // --- Delete ---
  const onDelete = (row) => {
    setRowToDelete(row);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    const row = rowToDelete;
    setConfirmOpen(false);
    if (!row || row.id == null) return;
    try {
      const res = await fetch(`/api/job/${encodeURIComponent(row.id)}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      toast.success("Job deleted");
      await loadJobs();
    } catch (e) {
      toast.error(e?.message || "Failed to delete job");
    } finally {
      setRowToDelete(null);
    }
  };

  if (loading) return <p>Loading…</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Job Listings</h2>
        <div className="flex items-center gap-3">
          <label className="text-sm text-gray-600 hidden md:flex items-center gap-2">
            <span>Rows:</span>
            <select
              value={limit}
              onChange={(e) => {
                const v = Number(e.target.value) || 10;
                setLimit(v);
                loadJobs(1, v);
              }}
              className="rounded-md border border-black/20 px-2 py-1 bg-white"
            >
              {[5, 10, 20, 50].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            className="px-3 py-2 rounded-md bg-black text-white"
            onClick={() => setShowForm(true)}
          >
            New Job
          </button>
        </div>
      </div>

      <SimpleTable columns={columns} rows={rows} />

      {/* Pagination */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <div>
          {total ? (
            <span>
              Showing {Math.min((page - 1) * limit + 1, total)}–
              {Math.min(page * limit, total)} of {total}
            </span>
          ) : (
            <span>{rows.length} items</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="px-3 py-1 rounded-md border border-black/20 disabled:opacity-40"
            disabled={page <= 1}
            onClick={() => loadJobs(page - 1, limit)}
          >
            Previous
          </button>
          <span className="mx-1">Page {page}</span>
          <button
            type="button"
            className="px-3 py-1 rounded-md border border-black/20 disabled:opacity-40"
            disabled={total && page >= Math.ceil(total / limit)}
            onClick={() => loadJobs(page + 1, limit)}
          >
            Next
          </button>
        </div>
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-[92vw] max-w-md rounded-xl bg-white p-5 shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Create Job</h3>
            <form onSubmit={onSubmit} className="space-y-3">
              <label className="block">
                <span className="block text-sm text-gray-600 mb-1">
                  Job Title
                </span>
                <input
                  value={form.jobTitle}
                  onChange={(e) =>
                    setForm({ ...form, jobTitle: e.target.value })
                  }
                  className="w-full rounded-md border border-black/20 px-3 py-2"
                />
              </label>
              <label className="block">
                <span className="block text-sm text-gray-600 mb-1">
                  Job Link
                </span>
                <input
                  value={form.jobLink}
                  onChange={(e) =>
                    setForm({ ...form, jobLink: e.target.value })
                  }
                  className="w-full rounded-md border border-black/20 px-3 py-2"
                />
              </label>
              <label className="block">
                <span className="block text-sm text-gray-600 mb-1">
                  Location
                </span>
                <input
                  value={form.location}
                  onChange={(e) =>
                    setForm({ ...form, location: e.target.value })
                  }
                  className="w-full rounded-md border border-black/20 px-3 py-2"
                />
              </label>
              <label className="block">
                <span className="block text-sm text-gray-600 mb-1">Status</span>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full rounded-md border border-black/20 px-3 py-2 bg-white"
                >
                  <option value="">Select status</option>
                  <option value="Open">Open</option>
                  <option value="Close">Close</option>
                </select>
              </label>
              <label className="block">
                <span className="block text-sm text-gray-600 mb-1">
                  Description
                </span>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  className="w-full rounded-md border border-black/20 px-3 py-2"
                />
              </label>

              {submitError && (
                <p className="text-sm text-red-600">{submitError}</p>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  className="px-3 py-2 rounded-md border border-black/20"
                  onClick={() => {
                    setShowForm(false);
                    setSubmitError(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-3 py-2 rounded-md bg-black text-white disabled:opacity-50"
                >
                  {submitting ? "Saving…" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Form */}
      {editOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-[92vw] max-w-md rounded-xl bg-white p-5 shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Edit Job</h3>
            <form onSubmit={onSubmitEdit} className="space-y-3">
              <label className="block">
                <span className="block text-sm text-gray-600 mb-1">
                  Job Title
                </span>
                <input
                  value={editForm.jobTitle}
                  onChange={(e) =>
                    setEditForm({ ...editForm, jobTitle: e.target.value })
                  }
                  className="w-full rounded-md border border-black/20 px-3 py-2"
                />
              </label>
              <label className="block">
                <span className="block text-sm text-gray-600 mb-1">
                  Job Link
                </span>
                <input
                  value={editForm.jobLink}
                  onChange={(e) =>
                    setEditForm({ ...editForm, jobLink: e.target.value })
                  }
                  className="w-full rounded-md border border-black/20 px-3 py-2"
                />
              </label>
              <label className="block">
                <span className="block text-sm text-gray-600 mb-1">
                  Location
                </span>
                <input
                  value={editForm.location}
                  onChange={(e) =>
                    setEditForm({ ...editForm, location: e.target.value })
                  }
                  className="w-full rounded-md border border-black/20 px-3 py-2"
                />
              </label>
              <label className="block">
                <span className="block text-sm text-gray-600 mb-1">Status</span>
                <select
                  value={editForm.status}
                  onChange={(e) =>
                    setEditForm({ ...editForm, status: e.target.value })
                  }
                  className="w-full rounded-md border border-black/20 px-3 py-2 bg-white"
                >
                  <option value="">Select status</option>
                  <option value="Open">Open</option>
                  <option value="Close">Close</option>
                </select>
              </label>
              <label className="block">
                <span className="block text-sm text-gray-600 mb-1">
                  Description
                </span>
                <textarea
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm({ ...editForm, description: e.target.value })
                  }
                  className="w-full rounded-md border border-black/20 px-3 py-2"
                />
              </label>

              {editError && <p className="text-sm text-red-600">{editError}</p>}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  className="px-3 py-2 rounded-md border border-black/20"
                  onClick={() => {
                    setEditOpen(false);
                    setEditRow(null);
                    setEditError(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editSubmitting}
                  className="px-3 py-2 rounded-md bg-black text-white disabled:opacity-50"
                >
                  {editSubmitting ? "Saving…" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      <ConfirmDialog
        open={confirmOpen}
        title="Delete Job"
        message={
          rowToDelete
            ? `Delete job "${rowToDelete.jobTitle}"? This action cannot be undone.`
            : ""
        }
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        onCancel={() => {
          setConfirmOpen(false);
          setRowToDelete(null);
        }}
      />
    </div>
  );
}
