import Sidebar from "./components/Sidebar";
import OffPlanProjects from "./components/OffPlanProjects";
import Enquiries from "./components/Enquiries";
import Data from "./components/Data";
import { Routes, Route, Navigate } from "react-router-dom";
import Pages from "./components/Pages";
import Settings from "./components/Settings";
import Users from "./components/Users";
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
          <Route path="/Pages/*" element={<Pages />} />
          <Route path="/Settings/*" element={<Settings />} />
          <Route path="/Users/*" element={<Users />} />
          {/* <Route path="*" element={<Navigate to="/offplan" replace />} /> */}
        </Routes>
      </main>
    </div>
  );
}
