import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#EAF3FF] px-4">
      
      <div
        className="
          bg-white
          p-6 sm:p-8 md:p-10
          rounded-2xl
          shadow-lg
          w-[90%] sm:w-full
          max-w-4xl
          text-center
        "
      >
        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-bold text-blue-700 mb-2">
          Welcome to Teacher – Student Management System
        </h1>

        <p className="text-gray-600 mb-8 sm:mb-10">
          Please choose your role to continue
        </p>

        {/* Role Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          
          {/* Teacher Card */}
          <div
            onClick={() => navigate("/teacher/login")}
            className="
              cursor-pointer
              p-5 sm:p-6 md:p-8
              border border-blue-100
              rounded-xl
              hover:bg-blue-50
              hover:shadow-md
              transition
            "
          >
            <div className="text-4xl sm:text-5xl mb-4">👨‍🏫</div>
            <h2 className="text-lg sm:text-xl font-semibold text-blue-700">
              Teacher Section
            </h2>
            <p className="text-gray-500 mt-2 text-sm sm:text-base">
              Manage classes, results, attendance & notices
            </p>
          </div>

          {/* Student Card */}
          <div
            onClick={() => navigate("/student/login")}
            className="
              cursor-pointer
              p-5 sm:p-6 md:p-8
              border border-blue-100
              rounded-xl
              hover:bg-blue-50
              hover:shadow-md
              transition
            "
          >
            <div className="text-4xl sm:text-5xl mb-4">👩‍🎓</div>
            <h2 className="text-lg sm:text-xl font-semibold text-blue-700">
              Student Section
            </h2>
            <p className="text-gray-500 mt-2 text-sm sm:text-base">
              View results, attendance & future performance
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Home;

