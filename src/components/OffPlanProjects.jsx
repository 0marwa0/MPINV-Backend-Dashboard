import { useEffect, useState } from "react";
import placeholder from "../assets/image-placeholder.svg";

export default function OffPlanProjects() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("/api/off_plan_projects");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const any = await res.json();
        const list = Array.isArray(any?.data)
          ? any.data
          : Array.isArray(any)
          ? any
          : [];
        setRows(list);
      } catch (e) {
        setError(e?.message || "Failed to load");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const buildImageSrc = (bg) => {
    if (!bg) return placeholder;
    // Accept absolute URL or already-rooted path
    if (/^(https?:\/\/|\/)/.test(bg)) return bg;
    // Otherwise assume backend default path
    return `/uploads/off_plan_projects/${bg}`;
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">Off-plan Projects</h1>
      {loading && <p>Loading…</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && !error && (
        <div className="bg-white rounded-xl shadow-sm border border-black/10 p-2 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-black/60 font-semibold border-b border-black/10">
                <th className="text-left p-3">Image</th>
                <th className="text-left p-3">Title</th>
                <th className="text-left p-3">Short</th>
                <th className="text-left p-3">Highlights</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p, i) => (
                <tr key={i} className="border-b border-black/10">
                  <td className="p-3">
                    <img
                      src={`${p.bg_img}`}
                      alt={p.project_title || "img"}
                      className="h-16 w-20 object-cover rounded ring-1 ring-black/10"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = placeholder;
                      }}
                    />
                  </td>
                  <td className="p-3">{String(p.project_title || "")}</td>
                  <td className="p-3">{String(p.project_short_doc || "")}</td>
                  <td className="p-3">
                    {Array.isArray(p.project_highlights)
                      ? p.project_highlights.join(" • ")
                      : String(p.project_highlights || "")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {rows.length === 0 && (
            <p className="p-3 text-black/60">No projects found.</p>
          )}
        </div>
      )}
    </div>
  );
}
