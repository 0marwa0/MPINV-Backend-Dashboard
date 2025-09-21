import { NavLink, Routes, Route, Navigate } from 'react-router-dom'

const tabs = [
  { id: 'community', label: 'Community' },
  { id: 'sub-community', label: 'Sub Community' },
  { id: 'state', label: 'State' },
  { id: 'developers', label: 'Developers' },
]

export default function Data() {

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6">Data</h1>

      <div className="border-b border-gray-200">
        <div className="flex justify-around sm:justify-start sm:gap-10 overflow-x-auto">
          {tabs.map((t) => (
            <NavLink
              key={t.id}
              to={t.id}
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
          <Route index element={<Navigate to="community" replace />} />
          <Route path="community" element={<CommunityTable />} />
          <Route path="sub-community" element={<SubCommunityTable />} />
          <Route path="state" element={<StateTable />} />
          <Route path="developers" element={<DevelopersTable />} />
        </Routes>
      </div>
    </div>
  )
}

import SimpleTable from './shared/SimpleTable'

function CommunityTable() {
  const columns = [
    { key: 'id', header: 'ID' },
    { key: 'name', header: 'Community' },
    { key: 'projects', header: 'Projects' },
  ]
  const rows = []
  return <SimpleTable columns={columns} rows={rows} />
}

function SubCommunityTable() {
  const columns = [
    { key: 'id', header: 'ID' },
    { key: 'name', header: 'Sub Community' },
    { key: 'community', header: 'Parent Community' },
  ]
  const rows = []
  return <SimpleTable columns={columns} rows={rows} />
}

function StateTable() {
  const columns = [
    { key: 'code', header: 'Code' },
    { key: 'name', header: 'State' },
  ]
  const rows = []
  return <SimpleTable columns={columns} rows={rows} />
}

function DevelopersTable() {
  const columns = [
    { key: 'id', header: 'ID' },
    { key: 'name', header: 'Developer' },
    { key: 'projects', header: 'Projects' },
  ]
  const rows = []
  return <SimpleTable columns={columns} rows={rows} />
}
