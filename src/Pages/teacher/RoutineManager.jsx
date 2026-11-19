
import { useEffect, useState, useCallback } from "react";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const slots = [1, 2, 3, 4, 5];

const RoutineManager = () => {
  const [classes, setClasses] = useState([]);
  const [routine, setRoutine] = useState([]);
  const [timetable, setTimetable] = useState({});
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedClass, setSelectedClass] = useState("");
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch classes (COOKIE BASED ✅)
  const fetchClasses = useCallback(async () => {
    try {
      const res = await fetch("https://school-management-node-backend.onrender.com/api/teacher/classes", {
        credentials: "include"
      });

      const data = await res.json();
      console.log("CLASSES:", data);

      setClasses(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching classes:", err);
    }
  }, []);

  // 🔹 Fetch routine (COOKIE BASED ✅)
  const fetchRoutine = useCallback(async () => {
    try {
      const res = await fetch("https://school-management-node-backend.onrender.com/api/routine", {
        credentials: "include"
      });

      const data = await res.json();
      console.log("ROUTINE:", data);

      setRoutine(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching routine:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // 🔹 Build timetable
  const buildTable = useCallback(() => {
    let table = {};

    days.forEach(day => {
      table[day] = {};
      slots.forEach(slot => {
        table[day][slot] = null;
      });
    });

    routine.forEach(r => {
      if (table[r.day] && slots.includes(Number(r.slot))) {
        table[r.day][r.slot] = r;
      }
    });

    setTimetable(table);
  }, [routine]);

  // 🔥 Load data
  useEffect(() => {
    fetchClasses();
    fetchRoutine();
  }, [fetchClasses, fetchRoutine]);

  useEffect(() => {
    buildTable();
  }, [buildTable]);

  // 🔹 Add routine
  const handleAdd = async () => {
    if (!selectedClass) return alert("Select class");

    try {
      const response = await fetch("https://school-management-node-backend.onrender.com/api/routine/add", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          classId: selectedClass,
          day: selectedSlot.day,
          slot: selectedSlot.slot
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to add routine");

      setSelectedSlot(null);
      setSelectedClass("");
      fetchRoutine();
    } catch (err) {
      console.error("Error adding routine:", err);
    }
  };

  // 🔹 Delete routine
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`https://school-management-node-backend.onrender.com/api/routine/${id}`, {
        method: "DELETE",
        credentials: "include"
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to delete routine");

      fetchRoutine();
    } catch (err) {
      console.error("Error deleting:", err);
    }
  };

  // 🔹 Loading UI
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading Routine...
      </div>
    );
  }

  return (
    <div className="p-6 text-white">
      <h2 className="text-2xl font-bold mb-4">Routine Manager</h2>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-700 text-center">
          <thead>
            <tr className="bg-gray-800">
              <th className="p-2">Day</th>
              {slots.map(slot => (
                <th key={slot} className="p-2">
                  Slot {slot}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {days.map(day => (
              <tr key={day} className="border-t border-gray-700">
                <td className="p-2 font-semibold">{day}</td>

                {slots.map(slot => {
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

              {classes.map(c => (
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
