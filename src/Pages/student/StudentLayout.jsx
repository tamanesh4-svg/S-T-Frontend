import { useState } from "react";
import { Outlet } from "react-router-dom";
import StudentSidebar from "../../Components/student/StudentSidebar";

const StudentLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#EAF3FF]">

      {/* Fixed Desktop Sidebar */}
      <div className="hidden md:block fixed top-0 left-0 h-screen w-64 z-30">
        <StudentSidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">

          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setSidebarOpen(false)}
          />

          {/* Sidebar */}
          <div className="relative z-50 w-64 h-full bg-white">
            <StudentSidebar
              onClose={() => setSidebarOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="md:ml-64 min-h-screen">

        {/* Mobile Topbar */}
        <div className="md:hidden sticky top-0 z-20 flex items-center bg-white shadow px-4 py-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-2xl text-green-700"
          >
            ☰
          </button>

          <h1 className="ml-4 text-lg font-semibold text-green-700">
            Student Panel
          </h1>
        </div>

        {/* Page Content */}
        <main className="min-h-screen p-6">
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default StudentLayout;