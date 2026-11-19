import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const API_URL =
  process.env.REACT_APP_API_URL ||
  "https://school-management-node-backend.onrender.com";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const slots = [1, 2, 3, 4, 5];

const RoutineManager = () => {
  const [classes, setClasses] = useState([]);
  const [routine, setRoutine] = useState([]);
  const [timetable, setTimetable] = useState({});
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedClass, setSelectedClass] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // ===============================
  // GET TEACHER TOKEN
  // ===============================
  const getToken = () => {
    const token = sessionStorage.getItem("teacherToken");

    if (!token) {
      navigate("/teacher/login");
      return null;
    }

    return token;
  };

  // ===============================
  // HANDLE AUTHENTICATION ERRORS
  // ===============================
  const handleAuthError = (status) => {
    if (status === 401 || status === 403) {
      sessionStorage.removeItem("teacherToken");
      sessionStorage.removeItem("teacher");
      navigate("/teacher/login");
      return true;
    }

    return false;
  };

  // ===============================
  // FETCH CLASSES
  // ===============================
  const fetchClasses = useCallback(async () => {
    const token = getToken();

    if (!token) return;

    try {
      const res = await fetch(`${API_URL}/api/teacher/classes`, {
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (handleAuthError(res.status)) return;

      if (!res.ok) {
        throw new Error(`Failed to fetch classes: ${res.status}`);
      }

      const data = await res.json();

      console.log("CLASSES:", data);

      setClasses(
        Array.isArray(data) ? data : data.classes || []
      );
    } catch (err) {
      console.error("Error fetching classes:", err);
    }
  }, [navigate]);

  // ===============================
  // FETCH ROUTINE
  // ===============================
  const fetchRoutine = useCallback(async () => {
    const token = getToken();

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/routine`, {
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (handleAuthError(res.status)) return;

      if (!res.ok) {
        throw new Error(`Failed to fetch routine: ${res.status}`);
      }

      const data = await res.json();

      console.log("ROUTINE:", data);

      setRoutine(
        Array.isArray(data) ? data : data.routine || []
      );
    } catch (err) {
      console.error("Error fetching routine:", err);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  // ===============================
  // BUILD TIMETABLE
  // ===============================
  const buildTable = useCallback(() => {
    const table = {};

    days.forEach((day) => {
      table[day] = {};

      slots.forEach((slot) => {
        table[day][slot] = null;
      });
    });

    routine.forEach((r) => {
      if (table[r.day] && slots.includes(Number(r.slot))) {
        table[r.day][r.slot] = r;
      }
    });

    setTimetable(table);
  }, [routine]);

  // ===============================
  // LOAD DATA
  // ===============================
  useEffect(() => {
    fetchClasses();
    fetchRoutine();
  }, [fetchClasses, fetchRoutine]);

  useEffect(() => {
    buildTable();
  }, [buildTable]);

  // ===============================
  // ADD ROUTINE
  // ===============================
  const handleAdd = async () => {
    if (!selectedClass) {
      alert("Select class");
      return;
    }

    if (!selectedSlot) return;

    const token = getToken();

    if (!token) return;

    try {
      const response = await fetch(`${API_URL}/api/routine/add`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          classId: selectedClass,
          day: selectedSlot.day,
          slot: selectedSlot.slot,
        }),
      });

      if (handleAuthError(response.status)) return;

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add routine");
      }

      setSelectedSlot(null);
      setSelectedClass("");

      await fetchRoutine();
    } catch (err) {
      console.error("Error adding routine:", err);
      alert(err.message || "Failed to add routine");
    }
  };

  // ===============================
  // DELETE ROUTINE
  // ===============================
  const handleDelete = async (id) => {
    const token = getToken();

    if (!token) return;

    try {
      const response = await fetch(`${API_URL}/api/routine/${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (handleAuthError(response.status)) return;

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete routine");
      }

      await fetchRoutine();
    } catch (err) {
      console.error("Error deleting routine:", err);
      alert(err.message || "Failed to delete routine");
    }
  };

  // ===============================
  // LOADING UI
  // ===============================
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading Routine...
      </div>
    );
  }

  return (
    <div className="p-6 text-white">
      <h2 className="text-2xl font-bold mb-4">
        Routine Manager
      </h2>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-700 text-center">
          <thead>
            <tr className="bg-gray-800">
              <th className="p-2">Day</th>

              {slots.map((slot) => (
                <th key={slot} className="p-2">
                  Slot {slot}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {days.map((day) => (
              <tr key={day} className="border-t border-gray-700">
                <td className="p-2 font-semibold">{day}</td>

                {slots.map((slot) => {
                  const data = timetable[day]?.[slot];

                  return (
                    <td key={slot} className="p-2">
                      {data ? (
                        <div className="bg-green-600 p-2 rounded">
                          <p>{data.classId?.className}</p>

                          <button
                            onClick={() => handleDelete(data._id)}
                            className="text-xs text-red-200 mt-1"
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() =>
                            setSelectedSlot({ day, slot })
                          }
                          className="bg-gray-700 px-2 py-1 rounded hover:bg-gray-600"
                        >
                          + Add
                        </button>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {selectedSlot && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center">
          <div className="bg-gray-900 p-6 rounded w-80">
            <h3 className="text-lg mb-3">
              Add Class ({selectedSlot.day} - Slot {selectedSlot.slot})
            </h3>

            <select
              className="w-full p-2 bg-gray-800 border border-gray-600 mb-4"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              <option value="">Select Class</option>

              {classes.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.className}
                </option>
              ))}
            </select>

            <div className="flex justify-between">
              <button
                onClick={handleAdd}
                className="bg-green-600 px-4 py-2 rounded"
              >
                Add
              </button>

              <button
                onClick={() => setSelectedSlot(null)}
                className="bg-red-600 px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoutineManager;