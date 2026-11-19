import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const API_URL =
  process.env.REACT_APP_API_URL ||
  "https://school-management-node-backend.onrender.com";

const TeacherHome = () => {
  const navigate = useNavigate();
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeacher = async () => {
      const token = sessionStorage.getItem("teacherToken");

      // no token saved means the user never logged in on this tab
      if (!token) {
        navigate("/teacher/login");
        return;
      }

      try {
        const res = await fetch(`${API_URL}/api/teacher/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });

        if (!res.ok) {
          sessionStorage.removeItem("teacherToken");
          sessionStorage.removeItem("teacher");
          navigate("/teacher/login");
          return;
        }

        const data = await res.json();
        setTeacher(data.teacher || data);
      } catch (err) {
        console.log(err);
        navigate("/teacher/login");
      } finally {
        setLoading(false);
      }
    };

    fetchTeacher();
  }, [navigate]);

  const features = [
    {
      title: "Add Class / Students",
      desc: "Create classrooms and register new students with ease.",
      icon: "👨‍🎓",
      tag: "CLASSROOM",
      path: "/teacher/add-class",
    },
    {
      title: "Existing Classes",
      desc: "Explore your classes and manage student information.",
      icon: "🏫",
      tag: "MANAGEMENT",
      path: "/teacher/classes",
    },
    {
      title: "Manage Results",
      desc: "Enter, update and monitor continuous assessment marks.",
      icon: "📊",
      tag: "ACADEMICS",
      path: "/teacher/results",
    },
    {
      title: "Attendance",
      desc: "Record daily attendance and monitor student presence.",
      icon: "📅",
      tag: "TRACKING",
      path: "/teacher/attendance",
    },
    {
      title: "Publish Notice",
      desc: "Share important announcements with your students.",
      icon: "📢",
      tag: "COMMUNICATION",
      path: "/teacher/publish-notice",
    },
    {
      title: "Routine Manager",
      desc: "Organise class schedules and manage timetables.",
      icon: "🗓️",
      tag: "SCHEDULING",
      path: "/teacher/routine",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#EAF3FF] flex items-center justify-center">
        <div className="bg-white px-8 py-6 rounded-2xl shadow-md text-center">
          <div className="w-9 h-9 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-blue-700 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EAF3FF] px-4 sm:px-6 lg:px-10 py-8 md:py-12">
      <div className="max-w-7xl mx-auto">
        {/* ================= HEADER ================= */}

        <div className="relative overflow-hidden bg-gradient-to-r from-blue-700 via-blue-600 to-sky-500 rounded-3xl p-7 sm:p-10 mb-10 shadow-xl">
          {/* Decorative circles */}
          <div className="absolute -right-10 -top-16 w-64 h-64 rounded-full bg-white/10"></div>
          <div className="absolute right-36 -bottom-24 w-52 h-52 rounded-full bg-white/10"></div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/15 text-white px-4 py-2 rounded-full text-xs font-semibold tracking-wider mb-5 border border-white/20">
                <span className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></span>
                TEACHER PORTAL
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-3">
                Welcome back,
                <br className="sm:hidden" /> {teacher?.name || "Teacher"}!
                <span className="ml-2">👋</span>
              </h1>

              <p className="text-blue-100 text-sm sm:text-base max-w-xl leading-relaxed">
                Your classroom management starts here. Manage students,
                track academic performance and keep everything organised.
              </p>
            </div>

            <div className="hidden md:flex items-center justify-center">
              <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-full bg-white/15 border border-white/30 flex items-center justify-center shadow-inner">
                <span className="text-7xl lg:text-8xl">👨‍🏫</span>
              </div>
            </div>
          </div>
        </div>

        {/* ================= SECTION HEADING ================= */}

        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-7">
          <div>
            <p className="text-blue-600 font-bold text-xs tracking-[0.2em] uppercase mb-2">
              Workspace
            </p>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800">
              Dashboard Overview
            </h2>

            <p className="text-slate-500 text-sm mt-2">
              Everything you need to manage your classroom in one place.
            </p>
          </div>

          <div className="bg-white border border-blue-100 px-4 py-2 rounded-xl shadow-sm text-sm text-blue-700 font-semibold w-fit">
            {features.length} Available Modules
          </div>
        </div>

        {/* ================= FEATURE CARDS ================= */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureBox
              key={feature.title}
              {...feature}
              index={index}
              onClick={() => navigate(feature.path)}
            />
          ))}
        </div>

        {/* ================= FOOTER ================= */}

        <div className="mt-12 text-center">
          <p className="text-slate-400 text-xs">
            Teacher Portal · Academic Management System
          </p>
        </div>
      </div>
    </div>
  );
};

// ================= REUSABLE FEATURE CARD =================

const FeatureBox = ({ title, desc, icon, tag, onClick, index }) => {
  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      style={{ animationDelay: `${index * 80}ms` }}
      className="
        group relative overflow-hidden
        bg-white
        border border-blue-100
        rounded-2xl
        p-6 sm:p-7
        min-h-[225px]
        cursor-pointer
        shadow-[0_4px_20px_rgba(37,99,235,0.05)]
        hover:shadow-[0_15px_35px_rgba(37,99,235,0.13)]
        hover:-translate-y-2
        hover:border-blue-300
        transition-all duration-300 ease-out
        animate-[fadeIn_0.5s_ease-out_both]
        focus:outline-none focus:ring-2 focus:ring-blue-400
      "
    >
      {/* Top accent */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-sky-400"></div>

      {/* Background decoration */}
      <div className="absolute -right-10 -bottom-12 w-36 h-36 rounded-full bg-blue-50 group-hover:scale-150 transition-transform duration-500"></div>

      <div className="relative z-10">
        {/* Icon and tag */}
        <div className="flex items-start justify-between mb-6">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-3xl group-hover:bg-blue-600 group-hover:scale-110 transition-all duration-300">
            <span className="group-hover:scale-110 transition-transform">
              {icon}
            </span>
          </div>

          <span className="text-[10px] font-bold tracking-widest text-blue-500 bg-blue-50 px-3 py-2 rounded-full">
            {tag}
          </span>
        </div>

        {/* Card content */}
        <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-blue-700 transition-colors">
          {title}
        </h3>

        <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
          {desc}
        </p>

        {/* Bottom action */}
        <div className="flex items-center gap-2 mt-6 text-blue-600 font-bold text-sm">
          <span>Explore module</span>

          <span className="text-lg transform group-hover:translate-x-2 transition-transform duration-300">
            →
          </span>
        </div>
      </div>
    </div>
  );
};

export default TeacherHome;