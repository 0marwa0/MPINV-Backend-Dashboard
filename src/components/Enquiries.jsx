import { NavLink, Routes, Route, Navigate } from "react-router-dom";
import BrochureRequestsTable from "./Enquiries/BrochureRequests";
import ContactUsTable from "./Enquiries/contactTable";
import OffPlanEnquiryTable from "./Enquiries/OffPlanEnquiryTable";
const tabs = [
  { id: "contact", label: "Contact Us" },
  { id: "brochure", label: "Brochure Request" },
  { id: "property", label: "Property Enquiry" },
];

export default function Enquiries() {
  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6">Enquiries</h1>

      {/* Minimal underline tabs like the screenshot */}
      <div className="border-b border-gray-200">
        <div className="flex justify-around sm:justify-start sm:gap-10 overflow-x-auto">
          {tabs.map((t) => (
            <NavLink
              key={t.id}
              to={t.id}
              className={({ isActive }) =>
                `relative px-3 sm:px-4 pt-3 pb-2 text-sm whitespace-nowrap transition-colors ${
                  isActive
                    ? "text-black font-semibold"
                    : "text-gray-400 hover:text-gray-600"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {t.label}
                  <div
                    className={`mx-auto mt-2 mb-[-1px] h-1 rounded-full ${
                      isActive ? "bg-black w-16" : "bg-transparent w-16"
                    }`}
                  />
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>

      {/* Content per tab: table components */}
      <div className="mt-2">
        <Routes>
          <Route index element={<Navigate to="contact" replace />} />
          <Route path="contact" element={<ContactUsTable />} />
          <Route path="brochure" element={<BrochureRequestsTable />} />
          <Route path="property" element={<OffPlanEnquiryTable />} />
        </Routes>
      </div>
    </div>
  );
}

import SimpleTable from "./shared/SimpleTable";
