import { useState } from "react";
import { Outlet } from "react-router-dom";
import TeacherSidebar from "../../Components/teacher/TeacherSidebar";

const TeacherLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#EAF3FF] flex">
      
      {/* Sidebar for desktop */}
      <div className="hidden md:block">
        <TeacherSidebar />
      </div>

      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          
          {/* Overlay background */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setSidebarOpen(false)}
          />

          {/* Sidebar */}
          <div className="relative w-64 bg-white shadow-lg z-50">
            <TeacherSidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1">
        
        {/* Top bar (mobile only) */}
        <div className="md:hidden flex items-center bg-white shadow px-4 py-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-2xl text-blue-700"
          >
            ☰
          </button>
          <h1 className="ml-4 text-lg font-semibold text-blue-700">
            Teacher Panel
          </h1>
        </div>

        {/* Page Content */}
        <main className="p-6">
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default TeacherLayout;

