import { useEffect, useMemo, useState } from 'react'
import SimpleTable from '../shared/SimpleTable'
import { useToast } from '../shared/Toast'

export default function SubCommunityTable() {
  const toast = useToast()
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [total, setTotal] = useState(0)
  const [communities, setCommunities] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', community_id: '' })
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)
  const communityById = useMemo(() => {
    const m = new Map()
    for (const c of communities) m.set(Number(c.id), c)
    return m
  }, [communities])

  const columns = [
    { key: 'id', header: 'ID' },
    { key: 'name', header: 'Sub Community' },
    {
      key: 'community_id',
      header: 'Community',
      render: (row) => communityById.get(Number(row.community_id))?.name || row.community_id
    },
  ]

  const loadCommunities = async () => {
    try {
      // Fetch many communities to resolve names; adjust limit if needed
      const res = await fetch('/api/community?limit=1000')
      if (!res.ok) throw new Error('Failed communities')
      const any = await res.json()
      const list = Array.isArray(any?.data) ? any.data : (Array.isArray(any) ? any : [])
      setCommunities(list.map((c) => ({ id: c.id ?? c._id, name: String(c.name ?? '') })))
    } catch {}
  }

  const loadSubCommunities = async (p = page, l = limit) => {
    try {
      setLoading(true)
      setError(null)
      const params = new URLSearchParams({ page: String(p), limit: String(l) })
      const res = await fetch(`/api/sub-community?${params.toString()}`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const any = await res.json()
      const list = Array.isArray(any?.data) ? any.data : (Array.isArray(any) ? any : [])
      const mapped = list.map((it) => ({
        id: it.id ?? it._id ?? '',
        name: String(it.name ?? ''),
        community_id: it.community_id ?? '',
      }))
      setRows(mapped)
      const newTotal = Number(any?.total ?? any?.count ?? mapped.length)
      const newPage = Number(any?.page ?? p)
      const newLimit = Number(any?.limit ?? l)
      if (!Number.isNaN(newTotal)) setTotal(newTotal)
      if (!Number.isNaN(newPage)) setPage(newPage)
      if (!Number.isNaN(newLimit)) setLimit(newLimit)
    } catch (e) {
      setError(e?.message || 'Failed to load')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCommunities()
    loadSubCommunities(1, limit)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.community_id) {
      setSubmitError('Name and community are required')
      return
    }
    setSubmitError(null)
    setSubmitting(true)
    try {
      const payload = { name: form.name.trim(), community_id: Number(form.community_id) }
      const res = await fetch('/api/sub-community', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      // Optimistic add
      setRows((prev) => [{ id: (prev[0]?.id ?? 0) + 1, ...payload }, ...prev])
      toast.success('Sub community created')
      setShowForm(false)
      setForm({ name: '', community_id: '' })
      // Refresh to sync from server
      loadSubCommunities(1, limit)
    } catch (e) {
      setSubmitError(e?.message || 'Failed to create')
      toast.error(e?.message || 'Failed to create sub community')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <p>Loading…</p>
  if (error) return <p className="text-red-600">{error}</p>

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div />
        <div className="flex items-center gap-3">
          <label className="hidden md:flex items-center gap-2 text-sm text-gray-600">
            Rows:
            <select
              value={limit}
              onChange={(e) => { const v = Number(e.target.value) || 10; setLimit(v); loadSubCommunities(1, v) }}
              className="rounded-md border border-black/20 px-2 py-1 bg-white"
            >
              {[5,10,20,50].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </label>
          <button type="button" className="px-3 py-2 rounded-md bg-black text-white" onClick={() => setShowForm(true)}>
            New Sub Community
          </button>
        </div>
      </div>

      <SimpleTable columns={columns} rows={rows} />

      <div className="flex items-center justify-between text-sm text-gray-600">
        <div>
          {total ? (
            <span>
              Showing {Math.min((page - 1) * limit + 1, total)}�{Math.min(page * limit, total)} of {total}
            </span>
          ) : (
            <span>{rows.length} items</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <label className="hidden md:flex items-center gap-2">
            Rows:
            <select
              value={limit}
              onChange={(e) => { const v = Number(e.target.value) || 10; setLimit(v); loadSubCommunities(1, v) }}
              className="rounded-md border border-black/20 px-2 py-1 bg-white"
            >
              {[5,10,20,50].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </label>
          <button
            type="button"
            className="px-3 py-1 rounded-md border border-black/20 disabled:opacity-40"
            disabled={page <= 1}
            onClick={() => loadSubCommunities(page - 1, limit)}
          >
            Previous
          </button>
          <span className="mx-1">Page {page}</span>
          <button
            type="button"
            className="px-3 py-1 rounded-md border border-black/20 disabled:opacity-40"
            disabled={total && page >= Math.ceil(total / limit)}
            onClick={() => loadSubCommunities(page + 1, limit)}
          >
            Next
          </button>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-[92vw] max-w-md rounded-xl bg-white p-5 shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Create Sub Community</h3>
            <form onSubmit={onSubmit} className="space-y-3">
              <label className="block">
                <span className="block text-sm text-gray-600 mb-1">Name</span>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-md border border-black/20 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/30"
                  placeholder="Sub community name"
                />
              </label>
              <label className="block">
                <span className="block text-sm text-gray-600 mb-1">Community</span>
                <select
                  value={form.community_id}
                  onChange={(e) => setForm({ ...form, community_id: e.target.value })}
                  className="w-full rounded-md border border-black/20 px-3 py-2 bg-white"
                >
                  <option value="" disabled>Select a community</option>
                  {communities.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </label>
              {submitError && <p className="text-sm text-red-600">{submitError}</p>}

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" className="px-3 py-2 rounded-md border border-black/20" onClick={() => { setShowForm(false); setSubmitError(null) }}>
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="px-3 py-2 rounded-md bg-black text-white disabled:opacity-50">
                  {submitting ? 'Saving…' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

