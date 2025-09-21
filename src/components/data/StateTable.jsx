import { useEffect, useState } from "react";
import SimpleTable from "../shared/SimpleTable";
import { useToast } from "../shared/Toast";
import ConfirmDialog from "../shared/ConfirmDialog";

export default function StateTable() {
  const toast = useToast();

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", code: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState(null);

  const columns = [
    { key: "name", header: "Name" },
    { key: "code", header: "Code" },
    {
      key: "actions",
      header: "",
      render: (row) => (
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
      ),
    },
  ];

  const refresh = async () => {
    setLoading(true);
    setError(null);
    try {
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
        id: it.id ?? it._id ?? it.code ?? it.state_code ?? null,
        name: String(it.name ?? it.state_name ?? it.title ?? ""),
        code: String(it.code ?? it.state_code ?? it.abbr ?? it.id ?? ""),
      }));
      setRows(mapped);
    } catch (e) {
      setError(e?.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.code.trim()) {
      setSubmitError("Both name and code are required");
      return;
    }
    setSubmitError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/state", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          code: form.code.trim(),
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      toast.success("State created");
      await refresh();
      setShowForm(false);
      setForm({ name: "", code: "" });
    } catch (e) {
      setSubmitError(e?.message || "Failed to create");
      toast.error(e?.message || "Failed to create state");
    } finally {
      setSubmitting(false);
    }
  };

  const onDelete = (row) => {
    setRowToDelete(row);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    const row = rowToDelete;
    setConfirmOpen(false);
    if (!row) return;
    const identifier = row.id ?? row.code;
    if (!identifier) return;
    try {
      const res = await fetch(`/api/state/${encodeURIComponent(identifier)}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      toast.success("State deleted");
      await refresh();
    } catch (e) {
      toast.error(e?.message || "Failed to delete state");
    } finally {
      setRowToDelete(null);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold"></h2>
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="px-3 py-2 rounded-md bg-black text-white"
        >
          New State
        </button>
      </div>

      {loading && <p>Loading…</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && !error && <SimpleTable columns={columns} rows={rows} />}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-[92vw] max-w-md rounded-xl bg-white p-5 shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Create State</h3>
            <form onSubmit={onSubmit} className="space-y-3">
              <label className="block">
                <span className="block text-sm text-gray-600 mb-1">Name</span>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-md border border-black/20 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/30"
                  placeholder="State name"
                />
              </label>
              <label className="block">
                <span className="block text-sm text-gray-600 mb-1">Code</span>
                <input
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value })}
                  className="w-full rounded-md border border-black/20 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/30"
                  placeholder="e.g. NY"
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

      <ConfirmDialog
        open={confirmOpen}
        title="Delete State"
        message={
          rowToDelete
            ? `Delete state "${rowToDelete.name}"? This action cannot be undone.`
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
