import { useEffect, useState } from "react";
import SimpleTable from "../shared/SimpleTable";
import placeholder from "../../assets/image-placeholder.svg";
import { useToast } from "../shared/Toast";
import ConfirmDialog from "../shared/ConfirmDialog";

export default function CommunityTable() {
  const toast = useToast();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", logoFile: null, state_id: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [states, setStates] = useState([]);
  const [statesLoading, setStatesLoading] = useState(true);

  const columns = [
    { key: "id", header: "ID" },
    {
      key: "logo",
      header: "Logo",
      render: (row) => (
        <img
          src={buildLogoSrc(row.logo)}
          alt={row.name || "logo"}
          className="h-10 w-16 object-contain bg-white ring-1 ring-black/10 rounded"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = placeholder;
          }}
        />
      ),
    },
    { key: "name", header: "Community" },
    { key: "state_id", header: "State ID" },
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

  function buildLogoSrc(logo) {
    if (!logo) return placeholder;
    return /^(https?:\/\/|\/)/.test(logo) ? logo : `/${logo}`;
  }

  const loadCommunities = async (p = page, l = limit) => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams({ page: String(p), limit: String(l) });
      const res = await fetch(`/api/community?${params.toString()}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const any = await res.json();
      const list = Array.isArray(any?.data)
        ? any.data
        : Array.isArray(any)
        ? any
        : [];
      const mapped = list.map((it) => ({
        id: it.id ?? it._id ?? "",
        name: String(it.name ?? ""),
        logo: String(it.logo ?? ""),
        state_id: it.state_id ?? "",
      }));
      setRows(mapped);
      // update pagination info if present
      const newTotal = Number(
        any?.total ?? any?.count ?? total ?? mapped.length
      );
      const newPage = Number(any?.page ?? p);
      const newLimit = Number(any?.limit ?? l);
      if (!Number.isNaN(newTotal)) setTotal(newTotal);
      if (!Number.isNaN(newPage)) setPage(newPage);
      if (!Number.isNaN(newLimit)) setLimit(newLimit);
    } catch (e) {
      setError(e?.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  };

  const loadStates = async () => {
    try {
      setStatesLoading(true);
      const res = await fetch("/api/state");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const any = await res.json();
      const list = Array.isArray(any?.data)
        ? any.data
        : Array.isArray(any)
        ? any
        : Array.isArray(any?.states)
        ? any.states
        : [];
      const mapped = list.map((it) => ({
        id: it.id ?? it._id ?? it.code ?? it.state_code,
        name: String(it.name ?? it.state_name ?? ""),
      }));
      setStates(mapped.filter((s) => s.id != null));
    } catch (e) {
      // silent error; dropdown will be empty
    } finally {
      setStatesLoading(false);
    }
  };

  useEffect(() => {
    loadCommunities();
    loadStates();
  }, []);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    state_id: "",
    logoFile: null,
  });
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [editError, setEditError] = useState(null);

  const onDelete = (row) => {
    setRowToDelete(row);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    const row = rowToDelete;
    setConfirmOpen(false);
    if (!row || row.id == null) return;
    try {
      const res = await fetch(`/api/community/${encodeURIComponent(row.id)}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      toast.success("Community deleted");
      await loadCommunities();
    } catch (e) {
      toast.error(e?.message || "Failed to delete community");
    } finally {
      setRowToDelete(null);
    }
  };

  const onStartEdit = (row) => {
    setEditRow(row);
    setEditForm({
      name: row.name || "",
      state_id: String(row.state_id ?? ""),
      logoFile: null,
    });
    setEditError(null);
    setEditOpen(true);
  };

  const onSubmitEdit = async (e) => {
    e.preventDefault();
    if (!editRow) return;
    if (!editForm.name.trim() || !editForm.state_id) {
      setEditError("Name and state are required");
      return;
    }
    setEditSubmitting(true);
    try {
      // Support multipart if a new file selected, otherwise JSON
      let res;
      if (editForm.logoFile) {
        const fd = new FormData();
        fd.append("name", editForm.name.trim());
        fd.append("state_id", String(editForm.state_id));
        fd.append("logo", editForm.logoFile);
        res = await fetch(`/api/community/${encodeURIComponent(editRow.id)}`, {
          method: "PUT",
          body: fd,
        });
      } else {
        res = await fetch(`/api/community/${encodeURIComponent(editRow.id)}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: editForm.name.trim(),
            state_id: Number(editForm.state_id),
          }),
        });
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      toast.success("Community updated");
      setEditOpen(false);
      setEditRow(null);
      await loadCommunities(page, limit);
    } catch (e) {
      setEditError(e?.message || "Failed to update");
      toast.error(e?.message || "Failed to update community");
    } finally {
      setEditSubmitting(false);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.logoFile || !form.state_id) {
      setSubmitError("Name, logo file, and state are required");
      return;
    }
    setSubmitError(null);
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("name", form.name.trim());
      fd.append("state_id", String(form.state_id));
      fd.append("logo", form.logoFile);
      const res = await fetch("/api/community", { method: "POST", body: fd });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const returned = await res.json().catch(() => null);
      // Map created item if backend returns it; otherwise use form values
      const created =
        returned && (returned.data || returned.community || returned);
      const newRow = created
        ? {
            id: created.id ?? created._id ?? rows.length + 1,
            name: String(created.name ?? form.name.trim()),
            logo: String(created.logo ?? ""),
            state_id: created.state_id ?? Number(form.state_id),
          }
        : {
            id: rows.length + 1,
            name: form.name.trim(),
            // temporary preview until next fetch
            logo: "",
            state_id: Number(form.state_id),
          };
      setRows((prev) => [newRow, ...prev]);
      toast.success("Community created");
      setShowForm(false);
      setForm({ name: "", logoFile: null, state_id: "" });
      // Also re-fetch in background to sync IDs and paths
      loadCommunities();
    } catch (e) {
      setSubmitError(e?.message || "Failed to create");
      toast.error(e?.message || "Failed to create community");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p>Loading…</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold"></h2>
        <div className="flex items-center gap-3">
          <label className="text-sm text-gray-600 hidden md:flex items-center gap-2">
            <span>Rows:</span>
            <select
              value={limit}
              onChange={(e) => {
                const v = Number(e.target.value) || 10;
                setLimit(v);
                loadCommunities(1, v);
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
            New Community
          </button>
        </div>
      </div>

      <SimpleTable columns={columns} rows={rows} />

      {/* Pagination controls */}
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
            onClick={() => loadCommunities(page - 1, limit)}
          >
            Previous
          </button>
          <span className="mx-1">Page {page}</span>
          <button
            type="button"
            className="px-3 py-1 rounded-md border border-black/20 disabled:opacity-40"
            disabled={total && page >= Math.ceil(total / limit)}
            onClick={() => loadCommunities(page + 1, limit)}
          >
            Next
          </button>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-[92vw] max-w-md rounded-xl bg-white p-5 shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Create Community</h3>
            <form onSubmit={onSubmit} className="space-y-3">
              <label className="block">
                <span className="block text-sm text-gray-600 mb-1">Name</span>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-md border border-black/20 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/30"
                  placeholder="Community name"
                />
              </label>
              <label className="block">
                <span className="block text-sm text-gray-600 mb-1">
                  Logo File
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setForm({
                      ...form,
                      logoFile:
                        e.target.files && e.target.files[0]
                          ? e.target.files[0]
                          : null,
                    })
                  }
                  className="w-full rounded-md border border-black/20 px-3 py-2 bg-white"
                />
                {form.logoFile && (
                  <p className="mt-1 text-xs text-gray-500">
                    Selected: {form.logoFile.name}
                  </p>
                )}
              </label>
              <label className="block">
                <span className="block text-sm text-gray-600 mb-1">State</span>
                <select
                  value={form.state_id}
                  onChange={(e) =>
                    setForm({ ...form, state_id: e.target.value })
                  }
                  className="w-full rounded-md border border-black/20 px-3 py-2 bg-white"
                >
                  <option value="" disabled>
                    {statesLoading ? "Loading states…" : "Select a state"}
                  </option>
                  {!statesLoading &&
                    states.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                </select>
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

      <ConfirmDialog
        open={confirmOpen}
        title="Delete Community"
        message={
          rowToDelete
            ? `Delete community "${rowToDelete.name}"? This action cannot be undone.`
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

      {editOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-[92vw] max-w-md rounded-xl bg-white p-5 shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Edit Community</h3>
            <form onSubmit={onSubmitEdit} className="space-y-3">
              <label className="block">
                <span className="block text-sm text-gray-600 mb-1">Name</span>
                <input
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                  className="w-full rounded-md border border-black/20 px-3 py-2"
                />
              </label>
              <label className="block">
                <span className="block text-sm text-gray-600 mb-1">State</span>
                <select
                  value={editForm.state_id}
                  onChange={(e) =>
                    setEditForm({ ...editForm, state_id: e.target.value })
                  }
                  className="w-full rounded-md border border-black/20 px-3 py-2 bg-white"
                >
                  <option value="" disabled>
                    {statesLoading ? "Loading states…" : "Select a state"}
                  </option>
                  {!statesLoading &&
                    states.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                </select>
              </label>
              <label className="block">
                <span className="block text-sm text-gray-600 mb-1">
                  Replace Logo (optional)
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="w-full rounded-md border border-black/20 px-3 py-2 bg-white"
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      logoFile:
                        e.target.files && e.target.files[0]
                          ? e.target.files[0]
                          : null,
                    })
                  }
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
    </div>
  );
}
