//off-plan-enquiry
import { useEffect, useState } from "react";
import SimpleTable from "../shared/SimpleTable";

export default function OffPlanEnquiryTable() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);

  const columns = [
    { key: "id", header: "ID" },
    { key: "name", header: "Name" },
    { key: "email", header: "Email" },
    { key: "phone", header: "Phone" },
    { key: "project", header: "Project" },
  ];

  const loadContacts = async (p = page, l = limit) => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams({ page: String(p), limit: String(l) });
      const res = await fetch(`/api/off-plan-enquiry?${params.toString()}`);
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
        email: String(it.email ?? ""),
        phone: String(it.phone ?? ""),
        message: String(it.message ?? ""),
      }));

      setRows(mapped);

      // pagination info if backend provides it
      const newTotal = Number(
        any?.total ?? any?.count ?? total ?? mapped.length
      );
      const newPage = Number(any?.page ?? p);
      const newLimit = Number(any?.limit ?? l);

      if (!Number.isNaN(newTotal)) setTotal(newTotal);
      if (!Number.isNaN(newPage)) setPage(newPage);
      if (!Number.isNaN(newLimit)) setLimit(newLimit);
    } catch (e) {
      setError(e?.message || "Failed to load contacts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContacts();
  }, []);

  if (loading) return <p>Loading…</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Contact Messages</h2>
        <label className="text-sm text-gray-600 hidden md:flex items-center gap-2">
          <span>Rows:</span>
          <select
            value={limit}
            onChange={(e) => {
              const v = Number(e.target.value) || 10;
              setLimit(v);
              loadContacts(1, v);
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
            onClick={() => loadContacts(page - 1, limit)}
          >
            Previous
          </button>
          <span className="mx-1">Page {page}</span>
          <button
            type="button"
            className="px-3 py-1 rounded-md border border-black/20 disabled:opacity-40"
            disabled={total && page >= Math.ceil(total / limit)}
            onClick={() => loadContacts(page + 1, limit)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
