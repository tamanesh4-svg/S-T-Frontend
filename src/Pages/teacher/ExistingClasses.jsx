import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL =
  process.env.REACT_APP_API_URL ||
  "https://school-management-node-backend.onrender.com";

const ExistingClasses = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchClasses = async () => {
      const token = sessionStorage.getItem("teacherToken");

      if (!token) {
        navigate("/teacher/login");
        return;
      }

      try {
        const response = await fetch(
          `${API_URL}/api/teacher/classes`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            credentials: "include",
          }
        );

        if (response.status === 401 || response.status === 403) {
          sessionStorage.removeItem("teacherToken");
          sessionStorage.removeItem("teacher");
          navigate("/teacher/login");
          return;
        }

        if (!response.ok) {
          throw new Error(`Failed to fetch classes: ${response.status}`);
        }

        const data = await response.json();

        setClasses(Array.isArray(data) ? data : data.classes || []);
      } catch (err) {
        console.error("Error fetching classes:", err);
        setError("Unable to load classes. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, [navigate]);

  const handleViewStudents = (classId) => {
    navigate(`/teacher/class/${classId}/students`);
  };

  if (loading) {
    return (
      <div className="text-center p-8">
        Loading classes...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto bg-white p-8 rounded-xl shadow">
      <h1 className="text-2xl font-bold text-blue-700 mb-6">
        Your Classes
      </h1>

      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Class Name</th>
            <th className="p-2 border">Class Code</th>
            <th className="p-2 border">Students</th>
          </tr>
        </thead>

        <tbody>
          {classes.length === 0 ? (
            <tr>
              <td colSpan="3" className="text-center p-4">
                No classes available
              </td>
            </tr>
          ) : (
            classes.map((cls) => (
              <tr key={cls._id}>
                <td className="p-2 border">
                  {cls.className}
                </td>

                <td className="p-2 border font-bold text-blue-600">
                  {cls.classCode}
                </td>

                <td className="p-2 border text-center">
                  <button
                    onClick={() => handleViewStudents(cls._id)}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                  >
                    View Students
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ExistingClasses;