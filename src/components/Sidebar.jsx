import { NavLink, useLocation } from "react-router-dom";

export default function Sidebar() {
  const itemBase =
    "w-11 h-11 rounded-lg grid place-items-center shadow-sm ring-1";
  const labelBase = "text-xs mt-1";
  const { pathname } = useLocation();
  const cur = pathname.startsWith("/enquiries")
    ? "enquiries"
    : pathname.startsWith("/data")
    ? "data"
    : pathname.startsWith("/pages")
    ? "pages"
    : "offplan";

  return (
    <aside className="w-20 shrink-0 bg-black text-white flex flex-col justify-between py-4">
      <div className="flex flex-col items-center gap-6">
        {/* Logo / Mark */}
        <div className="w-10 h-10 rounded-full bg-white/10 grid place-items-center font-bold">
          {/* MPINV */}
        </div>

        {/* Nav items */}
        <nav className="mt-2 flex flex-col items-center gap-5">
          {/* Off-Plan */}
          <NavLink
            to="/offplan"
            className="group flex flex-col items-center text-sm font-medium"
            title="Off-Plan Projects"
          >
            <span
              className={`${itemBase} ${
                cur === "offplan"
                  ? "bg-black text-white ring-white/30"
                  : "bg-black text-white ring-white/10"
              }`}
            >
              {/* buildings icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path d="M3 21h18v-2H3v2zM5 17h3v-3H5v3zm0-5h3V9H5v3zm0-5h3V4H6a1 1 0 00-1 1v2zm5 10h3v-3h-3v3zm0-5h3V9h-3v3zm0-5h3V4h-3v3zM18 17h1a1 1 0 001-1V6a2 2 0 00-2-2h-2v13h2zm-2 0V4h-4v13h4z" />
              </svg>
            </span>
            <span
              className={`${labelBase} ${
                cur === "offplan" ? "text-white" : "text-white/90"
              }`}
            >
              Off-Plan
            </span>
          </NavLink>

          {/* Enquiries */}
          <NavLink
            to="/enquiries"
            className="group flex flex-col items-center text-sm font-medium"
            title="Enquiries"
          >
            <span
              className={`${itemBase} ${
                cur === "enquiries"
                  ? "bg-white text-black ring-white/30"
                  : "bg-white/10 text-white ring-white/10"
              }`}
            >
              {/* chat bubble icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path d="M4.5 6.75A2.25 2.25 0 016.75 4.5h10.5A2.25 2.25 0 0119.5 6.75v7.5a2.25 2.25 0 01-2.25 2.25H9.31l-3.56 2.67A.75.75 0 013.75 18V6.75z" />
              </svg>
            </span>
            <span
              className={`${labelBase} ${
                cur === "enquiries" ? "text-white" : "text-white/90"
              }`}
            >
              Enquiries
            </span>
          </NavLink>

          {/* Data */}
          <NavLink
            to="/data"
            className="group flex flex-col items-center text-sm font-medium"
            title="Data"
          >
            <span
              className={`${itemBase} ${
                cur === "data"
                  ? "bg-white text-black ring-white/30"
                  : "bg-white/10 text-white ring-white/10"
              }`}
            >
              {/* database icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path d="M12 3c-4.97 0-9 1.79-9 4v10c0 2.21 4.03 4 9 4s9-1.79 9-4V7c0-2.21-4.03-4-9-4zm0 2c3.87 0 7 .93 7 2s-3.13 2-7 2-7-.93-7-2 3.13-2 7-2zm7 5.09V12c0 1.07-3.13 1.94-7 1.94S5 13.07 5 12V10.09C6.79 11 9.32 11.5 12 11.5s5.21-.5 7-1.41zM5 15c1.79.91 4.32 1.41 7 1.41s5.21-.5 7-1.41V17c0 1.07-3.13 1.94-7 1.94S5 18.07 5 17V15z" />
              </svg>
            </span>
            <span
              className={`${labelBase} ${
                cur === "data" ? "text-white" : "text-white/90"
              }`}
            >
              Data
            </span>
          </NavLink>

          {/* Pages */}
          <NavLink
            to="/pages"
            className="group flex flex-col items-center text-sm font-medium"
            title="Pages"
          >
            <span
              className={`${itemBase} ${
                cur === "pages"
                  ? "bg-white text-black ring-white/30"
                  : "bg-white/10 text-white ring-white/10"
              }`}
            >
              {/* document/page icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path d="M6 2a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6H6z" />
              </svg>
            </span>
            <span
              className={`${labelBase} ${
                cur === "pages" ? "text-white" : "text-white/90"
              }`}
            >
              Pages
            </span>
          </NavLink>

          <NavLink
            to="/users"
            className={({ isActive }) =>
              `group flex flex-col items-center text-sm font-medium`
            }
            title="Users"
          >
            {({ isActive }) => (
              <>
                <span
                  className={`${itemBase} ${
                    isActive
                      ? "bg-white text-black ring-white/30"
                      : "bg-white/10 text-white ring-white/10"
                  }`}
                >
                  {/* user icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6"
                  >
                    <path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5zm-7 9c0-3.866 3.134-7 7-7s7 3.134 7 7H5z" />
                  </svg>
                </span>
                <span
                  className={`${labelBase} ${
                    isActive ? "text-white" : "text-white/90"
                  }`}
                >
                  Users
                </span>
              </>
            )}
          </NavLink>

          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `group flex flex-col items-center text-sm font-medium`
            }
            title="Settings"
          >
            {({ isActive }) => (
              <>
                <span
                  className={`${itemBase} ${
                    isActive
                      ? "bg-white text-black ring-white/30"
                      : "bg-white/10 text-white ring-white/10"
                  }`}
                >
                  {/* cog/settings icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      fillRule="evenodd"
                      d="M11.983 4.083a1 1 0 01.994.918l.143 1.429a6.967 6.967 0 011.627.678l1.235-.713a1 1 0 011.366.366l.715 1.238c.27.468.154 1.063-.27 1.391l-1.027.8c.143.41.241.845.289 1.296l1.435.143a1 1 0 01.918.994v1.25a1 1 0 01-.918.994l-1.435.143a6.967 6.967 0 01-.678 1.627l1.027.8c.424.328.54.923.27 1.391l-.715 1.238a1 1 0 01-1.366.366l-1.235-.713a6.967 6.967 0 01-1.627.678l-.143 1.429a1 1 0 01-.994.918h-1.25a1 1 0 01-.994-.918l-.143-1.429a6.967 6.967 0 01-1.627-.678l-1.235.713a1 1 0 01-1.366-.366l-.715-1.238a1 1 0 01.27-1.391l1.027-.8a6.967 6.967 0 01-.678-1.627l-1.435-.143a1 1 0 01-.918-.994v-1.25a1 1 0 01.918-.994l1.435-.143c.048-.451.146-.886.289-1.296l-1.027-.8a1 1 0 01-.27-1.391l.715-1.238a1 1 0 011.366-.366l1.235.713c.48-.283 1.044-.507 1.627-.678l.143-1.429a1 1 0 01.994-.918h1.25zM12 9a3 3 0 100 6 3 3 0 000-6z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
                <span
                  className={`${labelBase} ${
                    isActive ? "text-white" : "text-white/90"
                  }`}
                >
                  Settings
                </span>
              </>
            )}
          </NavLink>
        </nav>
      </div>

      {/* Profile stub */}
      <div className="flex justify-center">
        <div className="w-10 h-10 rounded-full bg-white/10 ring-2 ring-white/20" />
      </div>
    </aside>
  );
}
