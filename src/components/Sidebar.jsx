import { NavLink, useLocation } from 'react-router-dom'

export default function Sidebar() {
  const itemBase = 'w-11 h-11 rounded-lg grid place-items-center shadow-sm ring-1';
  const labelBase = 'text-xs mt-1';
  const { pathname } = useLocation()
  const cur = pathname.startsWith('/enquiries') ? 'enquiries'
            : pathname.startsWith('/data') ? 'data'
            : pathname.startsWith('/jobs') ? 'jobs'
            : 'offplan'

  return (
    <aside className="w-20 shrink-0 bg-black text-white flex flex-col justify-between py-4">
      <div className="flex flex-col items-center gap-6">
        {/* Logo / Mark */}
        <div className="w-10 h-10 rounded-full bg-white/10 grid place-items-center font-bold">OP</div>

        {/* Nav items */}
        <nav className="mt-2 flex flex-col items-center gap-5">
          {/* Off-Plan */}
          <NavLink to="/offplan" className="group flex flex-col items-center text-sm font-medium" title="Off-Plan Projects">
            <span className={`${itemBase} ${cur === 'offplan' ? 'bg-white text-black ring-white/30' : 'bg-white/10 text-white ring-white/10'}`}>
              {/* construction helmet icon */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path d="M4 15v-1a8 8 0 1116 0v1h-2v-1a6 6 0 10-12 0v1H4z" />
                <rect x="3" y="16" width="18" height="2" rx="1" />
                <rect x="2" y="18" width="20" height="2" rx="1" />
              </svg>
            </span>
            <span className={`${labelBase} ${cur === 'offplan' ? 'text-white' : 'text-white/90'}`}>Off-Plan</span>
          </NavLink>

          {/* Enquiries */}
          <NavLink to="/enquiries" className="group flex flex-col items-center text-sm font-medium" title="Enquiries">
            <span className={`${itemBase} ${cur === 'enquiries' ? 'bg-white text-black ring-white/30' : 'bg-white/10 text-white ring-white/10'}`}>
              {/* chat bubble icon */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path d="M4.5 6.75A2.25 2.25 0 016.75 4.5h10.5A2.25 2.25 0 0119.5 6.75v7.5a2.25 2.25 0 01-2.25 2.25H9.31l-3.56 2.67A.75.75 0 013.75 18V6.75z" />
              </svg>
            </span>
            <span className={`${labelBase} ${cur === 'enquiries' ? 'text-white' : 'text-white/90'}`}>Enquiries</span>
          </NavLink>

          {/* Data */}
          <NavLink to="/data" className="group flex flex-col items-center text-sm font-medium" title="Data">
            <span className={`${itemBase} ${cur === 'data' ? 'bg-white text-black ring-white/30' : 'bg-white/10 text-white ring-white/10'}`}>
              {/* database icon */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path d="M12 3c-4.97 0-9 1.79-9 4v10c0 2.21 4.03 4 9 4s9-1.79 9-4V7c0-2.21-4.03-4-9-4zm0 2c3.87 0 7 .93 7 2s-3.13 2-7 2-7-.93-7-2 3.13-2 7-2zm7 5.09V12c0 1.07-3.13 1.94-7 1.94S5 13.07 5 12V10.09C6.79 11 9.32 11.5 12 11.5s5.21-.5 7-1.41zM5 15c1.79.91 4.32 1.41 7 1.41s5.21-.5 7-1.41V17c0 1.07-3.13 1.94-7 1.94S5 18.07 5 17V15z" />
              </svg>
            </span>
            <span className={`${labelBase} ${cur === 'data' ? 'text-white' : 'text-white/90'}`}>Data</span>
          </NavLink>

          {/* Jobs */}
          <NavLink to="/jobs" className="group flex flex-col items-center text-sm font-medium" title="Jobs">
            <span className={`${itemBase} ${cur === 'jobs' ? 'bg-white text-black ring-white/30' : 'bg-white/10 text-white ring-white/10'}`}>
              {/* briefcase icon */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path d="M9 3a2 2 0 00-2 2v1H5.5A2.5 2.5 0 003 8.5v8A2.5 2.5 0 005.5 19h13a2.5 2.5 0 002.5-2.5v-8A2.5 2.5 0 0018.5 6H17V5a2 2 0 00-2-2H9zm2 3h2V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v1z" />
              </svg>
            </span>
            <span className={`${labelBase} ${cur === 'jobs' ? 'text-white' : 'text-white/90'}`}>Jobs</span>
          </NavLink>
        </nav>
      </div>

      {/* Profile stub */}
      <div className="flex justify-center">
        <div className="w-10 h-10 rounded-full bg-white/10 ring-2 ring-white/20" />
      </div>
    </aside>
  )
}
