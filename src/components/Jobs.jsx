import { NavLink, Routes, Route, Navigate } from 'react-router-dom'

const tabs = [
  { id: 'jobs', label: 'Jobs' },
  { id: 'applications', label: 'Job Applications' },
]

export default function Jobs() {

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6">Jobs</h1>

      <div className="border-b border-gray-200">
        <div className="flex justify-around sm:justify-start sm:gap-10 overflow-x-auto">
          {tabs.map((t) => (
            <NavLink
              key={t.id}
              to={t.id === 'jobs' ? '' : t.id}
              end={t.id === 'jobs'}
              className={({ isActive }) => `relative px-3 sm:px-4 pt-3 pb-2 text-sm whitespace-nowrap transition-colors ${isActive ? 'text-black font-semibold' : 'text-gray-400 hover:text-gray-600'}`}
            >
              {({ isActive }) => (
                <>
                  {t.label}
                  <div className={`mx-auto mt-2 mb-[-1px] h-1 rounded-full ${isActive ? 'bg-black w-16' : 'bg-transparent w-16'}`} />
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>

      <div className="mt-2">
        <Routes>
          <Route index element={<JobsTable />} />
          <Route path="applications" element={<ApplicationsTable />} />
        </Routes>
      </div>
    </div>
  )
}

import SimpleTable from './shared/SimpleTable'

function JobsTable() {
  const columns = [
    { key: 'title', header: 'Title' },
    { key: 'dept', header: 'Department' },
    { key: 'location', header: 'Location' },
    { key: 'posted', header: 'Posted' },
  ]
  const rows = []
  return <SimpleTable columns={columns} rows={rows} />
}

function ApplicationsTable() {
  const columns = [
    { key: 'applicant', header: 'Applicant' },
    { key: 'job', header: 'Job' },
    { key: 'status', header: 'Status' },
    { key: 'date', header: 'Date' },
  ]
  const rows = []
  return <SimpleTable columns={columns} rows={rows} />
}
