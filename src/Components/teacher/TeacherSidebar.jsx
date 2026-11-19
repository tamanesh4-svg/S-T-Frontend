
import { NavLink } from "react-router-dom";

const TeacherSidebar = ({ onClose }) => {
  const links = [
    { to: "/teacher/home", label: "Home", icon: "⌂" },
    { to: "/teacher/add-class", label: "Add Class / Students", icon: "＋" },
    { to: "/teacher/classes", label: "Existing Classes", icon: "▣" },
    { to: "/teacher/results", label: "Results", icon: "▤" },
    { to: "/teacher/attendance", label: "Attendance", icon: "✓" },
    { to: "/teacher/routine", label: "Routine Generator", icon: "▦" },
    { to: "/teacher/prediction", label: "Prediction", icon: "⌁" },
    { to: "/teacher/publish-notice", label: "Notices", icon: "♢" },
  ];

  return (
    <aside className="w-64 h-screen bg-white border-r border-blue-100 shadow-sm flex flex-col">

      {/* Header */}
      <div className="px-6 py-6 border-b border-blue-100">
        <div className="flex items-center justify-between">

          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xl font-bold shadow-md">
              T
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-800">
                Teacher Panel
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
              className="md:hidden w-8 h-8 rounded-lg text-gray-500 hover:bg-blue-50 hover:text-blue-700 transition"
              aria-label="Close sidebar"
            >
              ✕
            </button>
          )}

        </div>
      </div>

      {/* Navigation */}
      <div className="px-4 pt-6 pb-2">
        <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 px-3">
          Main Menu
        </p>
      </div>

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
      <div className="p-4 border-t border-blue-100">
        <div className="rounded-xl bg-blue-50 p-3">
          <p className="text-xs font-semibold text-blue-800">
            Teacher Workspace
          </p>
          <p className="text-[11px] text-blue-500 mt-1">
            Manage your academic activities
          </p>
        </div>
      </div>

    </aside>
  );
};

export default TeacherSidebar;


/* -------- Sidebar Link -------- */

const SidebarLink = ({ to, label, icon, onClose }) => {
  return (
    <NavLink
      to={to}
      onClick={onClose}
      className={({ isActive }) =>
        `group flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
          isActive
            ? "bg-blue-600 text-white shadow-md shadow-blue-200"
            : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"
        }`
      }
    >
      {({ isActive }) => (
        <>
          <span
            className={`w-8 h-8 flex items-center justify-center rounded-lg text-lg transition ${
              isActive
                ? "bg-white/20 text-white"
                : "bg-gray-100 text-gray-500 group-hover:bg-blue-100 group-hover:text-blue-700"
            }`}
          >
            {icon}
          </span>

          <span>{label}</span>

          {isActive && (
            <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white" />
          )}
        </>
      )}
    </NavLink>
  );
};
