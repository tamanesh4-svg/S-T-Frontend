
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const CA_FIELDS = ["ca1", "ca2", "ca3", "ca4"];
const MAX_MARKS = 25;

const API_URL =
  "https://school-management-node-backend.onrender.com";

// ================= AUTH HELPERS =================
const getToken = (navigate) => {
  const token = sessionStorage.getItem("teacherToken");

  if (!token) {
    navigate("/teacher/login");
    return null;
  }

  return token;
};

const handleAuthError = (status, navigate) => {
  if (status === 401 || status === 403) {
    sessionStorage.removeItem("teacherToken");
    sessionStorage.removeItem("teacher");
    navigate("/teacher/login");
    return true;
  }

  return false;
};

const Results = () => {
  const navigate = useNavigate();

  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // ================= FETCH CLASSES =================
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const token = getToken(navigate);
        if (!token) return;

        const response = await fetch(
          `${API_URL}/api/results/classes`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            credentials: "include",
          }
        );

        if (handleAuthError(response.status, navigate)) return;

        if (!response.ok) {
          throw new Error("Failed to fetch classes");
        }

        const data = await response.json();
        setClasses(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchClasses();
  }, [navigate]);

  // ================= FETCH STUDENTS =================
  const handleClassChange = async (e) => {
    const classId = e.target.value;

    setSelectedClassId(classId);
    setStudents([]);

    if (!classId) return;

    try {
      const token = getToken(navigate);
      if (!token) return;

      setLoading(true);

      const response = await fetch(
        `${API_URL}/api/results/classes/${classId}/students`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        }
      );

      if (handleAuthError(response.status, navigate)) return;

      if (!response.ok) {
        throw new Error("Failed to fetch students");
      }

      const data = await response.json();
      setStudents(data);
    } catch (err) {
      console.error(err);
      alert("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  // ================= UPDATE CA MARKS =================
  const handleMarksChange = (studentIndex, field, value) => {
    setStudents((previous) =>
      previous.map((student, index) =>
        index === studentIndex
          ? { ...student, [field]: value }
          : student
      )
    );
  };

  // ================= SAVE RESULTS =================
  const handleSave = async () => {
    if (!selectedClassId) {
      alert("Please select a class");
      return;
    }

    try {
      const token = getToken(navigate);
      if (!token) return;

      setSaving(true);

      const response = await fetch(
        `${API_URL}/api/results`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
          body: JSON.stringify({
            classId: selectedClassId,
            students: students.map((student) => ({
              id: student.id,
              ca1: student.ca1,
              ca2: student.ca2,
              ca3: student.ca3,
              ca4: student.ca4,
            })),
          }),
        }
      );

      if (handleAuthError(response.status, navigate)) return;

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save results");
      }

      alert("CA results saved successfully!");
    } catch (err) {
      console.error(err);
      alert(err.message || "Error saving results");
    } finally {
      setSaving(false);
    }
  };

  // ================= TOTAL FOR EACH STUDENT =================
  const getTotal = (student) =>
    CA_FIELDS.reduce(
      (sum, field) => sum + (Number(student[field]) || 0),
      0
    );

  return (
    <div className="max-w-7xl mx-auto bg-white p-6 md:p-8 rounded-2xl shadow-md">
      <h1 className="text-2xl font-bold text-blue-700 mb-2">
        Continuous Assessment Results
      </h1>

      <p className="text-gray-500 mb-6">
        Enter marks for all four continuous assessments.
        Each assessment is out of {MAX_MARKS}.
      </p>

      {/* SELECT CLASS */}
      <select
        value={selectedClassId}
        onChange={handleClassChange}
        className="w-full p-3 border rounded-lg mb-6"
      >
        <option value="">-- Choose Class --</option>

        {classes.map((cls) => (
          <option key={cls.id} value={cls.id}>
            {cls.name}
          </option>
        ))}
      </select>

      {loading && (
        <p className="text-center py-6 text-gray-500">
          Loading students...
        </p>
      )}

      {/* STUDENT MARKS TABLE */}
      {!loading && students.length > 0 && (
        <>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border text-sm">
              <thead className="bg-blue-50">
                <tr>
                  <th className="border p-3">Roll</th>
                  <th className="border p-3 text-left">Student</th>
                  <th className="border p-3">CA 1</th>
                  <th className="border p-3">CA 2</th>
                  <th className="border p-3">CA 3</th>
                  <th className="border p-3">CA 4</th>
                  <th className="border p-3">Total / 100</th>
                </tr>
              </thead>

              <tbody>
                {students.map((student, index) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="border p-3 text-center">
                      {student.roll}
                    </td>

                    <td className="border p-3 font-medium">
                      {student.name}
                    </td>

                    {CA_FIELDS.map((field) => (
                      <td className="border p-2" key={field}>
                        <input
                          type="number"
                          min="0"
                          max={MAX_MARKS}
                          step="0.5"
                          value={student[field]}
                          onChange={(e) =>
                            handleMarksChange(index, field, e.target.value)
                          }
                          className="w-20 p-2 border rounded text-center"
                          placeholder="—"
                        />
                      </td>
                    ))}

                    <td className="border p-3 text-center font-bold text-blue-700">
                      {getTotal(student)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="mt-6 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-6 py-3 rounded-lg"
          >
            {saving ? "Saving..." : "Save CA Results"}
          </button>
        </>
      )}

      {!loading && selectedClassId && students.length === 0 && (
        <p className="text-center text-gray-500 py-6">
          No students found in this class.
        </p>
      )}
    </div>
  );
};

export default Results;
