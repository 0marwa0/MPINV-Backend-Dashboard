import Sidebar from './components/Sidebar'
import OffPlanProjects from './components/OffPlanProjects'
import Enquiries from './components/Enquiries'
import Data from './components/Data'
import Jobs from './components/Jobs'
import { Routes, Route, Navigate } from 'react-router-dom'

export default function App() {
  return (
    <div className="min-h-screen flex">
      <Sidebar />

      <main className="flex-1 p-6 md:p-8">
        <Routes>
          <Route path="/" element={<Navigate to="/offplan" replace />} />
          <Route path="/offplan" element={<OffPlanProjects />} />
          <Route path="/enquiries/*" element={<Enquiries />} />
          <Route path="/data/*" element={<Data />} />
          <Route path="/jobs/*" element={<Jobs />} />
          <Route path="*" element={<Navigate to="/offplan" replace />} />
        </Routes>
      </main>
    </div>
  )
}
