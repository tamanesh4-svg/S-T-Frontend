import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ClassStudents = () => {
  const { classId } = useParams();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch(
          `https://school-management-node-backend.onrender.com/api/teacher/class/${classId}/students`,
          { credentials: "include" }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // ✅ THE FIX: data might be an object like { students: [...] } or null
        const studentList = Array.isArray(data)
          ? data
          : Array.isArray(data.students)
          ? data.students
          : [];

        setStudents(studentList);
      } catch (err) {
        console.error("Failed to fetch students:", err);
        setError("Failed to load students. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [classId]);

  return (
    <div className="max-w-5xl mx-auto bg-white p-8 rounded-xl shadow">
      <h1 className="text-2xl font-bold text-blue-700 mb-6">
        Students in this Class
      </h1>

      {loading ? (
        <p className="text-center text-gray-500 p-4">Loading students...</p>
      ) : error ? (
        <p className="text-center text-red-500 p-4">{error}</p>
      ) : (
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Roll</th>
            </tr>
          </thead>

          <tbody>
            {students.length === 0 ? (
              <tr>
                <td colSpan="2" className="text-center p-4 text-gray-500">
                  No students joined yet
                </td>
              </tr>
            ) : (
              students.map((student) => (
                <tr key={student._id} className="hover:bg-gray-50">
                  <td className="p-2 border">{student.name}</td>
                  <td className="p-2 border">{student.roll || "—"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ClassStudents;