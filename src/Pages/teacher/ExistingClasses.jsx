import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ExistingClasses = () => {

  const [classes, setClasses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {

    const fetchClasses = async () => {

      const response = await fetch(
        "https://school-management-node-backend.onrender.com/api/teacher/classes",
        {
          credentials: "include"
        }
      );

      const data = await response.json();
      setClasses(data);
    };

    fetchClasses();

  }, []);

  const handleViewStudents = (classId) => {
    navigate(`/teacher/class/${classId}/students`);
  };

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