import { NavLink } from "react-router-dom";

const StudentSidebar = ({ onClose }) => {
  const links = [
    { to: "/student/home", label: "Home", icon: "⌂" },
    { to: "/student/join-class", label: "Join Class", icon: "＋" },
    { to: "/student/results", label: "My Results", icon: "▤" },
    { to: "/student/attendance", label: "Attendance", icon: "✓" },
    { to: "/student/routine", label: "My Routine", icon: "▦" },
    { to: "/student/prediction", label: "Performance Prediction", icon: "⌁" },
    { to: "/student/notices", label: "Notices", icon: "♢" },
    { to: "/student/messages", label: "Messages", icon: "✉" },
  ];

  return (
    <aside className="w-64 h-full bg-white border-r border-green-100 shadow-sm flex flex-col overflow-hidden">

      {/* Header */}
      <div className="px-6 py-6 border-b border-green-100">
        <div className="flex items-center justify-between">

          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white text-xl font-bold shadow-md">
              S
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-800">
                Student Panel
              </h2>

              <p className="text-xs text-gray-400">
                Academic Workspace
              </p>
            </div>
          </div>

          {/* Mobile Close Button */}
          {onClose && (
            <button
              onClick={onClose}
              className="md:hidden w-8 h-8 rounded-lg text-gray-500 hover:bg-green-50 hover:text-green-700 transition"
              aria-label="Close sidebar"
            >
              ✕
            </button>
          )}

        </div>
      </div>

      {/* Navigation Heading */}
      <div className="px-4 pt-6 pb-2">
        <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 px-3">
          Main Menu
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">

        {links.map((link) => (
          <SidebarLink
            key={link.to}
            {...link}
            onClose={onClose}
          />
        ))}

      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-green-100">
        <div className="rounded-xl bg-green-50 p-3">
          <p className="text-xs font-semibold text-green-800">
            Student Workspace
          </p>

          <p className="text-[11px] text-green-500 mt-1">
            Track your academic progress
          </p>
        </div>
      </div>

    </aside>
  );
};

export default StudentSidebar;


/* -------- Sidebar Link -------- */

const SidebarLink = ({ to, label, icon, onClose }) => {
  return (
    <NavLink
      to={to}
      onClick={onClose}
      className={({ isActive }) =>
        `group flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
          isActive
            ? "bg-green-600 text-white shadow-md shadow-green-200"
            : "text-gray-600 hover:bg-green-50 hover:text-green-700"
        }`
      }
    >
      {({ isActive }) => (
        <>
          {/* Icon */}
          <span
            className={`w-8 h-8 flex items-center justify-center rounded-lg text-lg transition ${
              isActive
                ? "bg-white/20 text-white"
                : "bg-gray-100 text-gray-500 group-hover:bg-green-100 group-hover:text-green-700"
            }`}
          >
            {icon}
          </span>

          {/* Label */}
          <span>{label}</span>

          {/* Active Indicator */}
          {isActive && (
            <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white" />
          )}
        </>
      )}
    </NavLink>
  );
};