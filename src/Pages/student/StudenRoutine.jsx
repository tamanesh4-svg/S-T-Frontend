import { useEffect, useState } from "react";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const slots = [1, 2, 3, 4, 5];

const StudentRoutine = () => {
  const [routine, setRoutine] = useState([]);
  const [timetable, setTimetable] = useState({});
  const [loading, setLoading] = useState(true);

  const token = sessionStorage.getItem("token");

  // 🔹 Fetch student routine
const fetchRoutine = async () => {
  try {
    const res = await fetch("https://school-management-node-backend.onrender.com/api/student/routine", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      cache: "no-store" // ✅ disables caching
    });

    if (!res.ok) {
      throw new Error("Failed to fetch routine");
    }

    const data = await res.json();
    console.log("STUDENT ROUTINE:", data);

    setRoutine(Array.isArray(data) ? data : []);
  } catch (err) {
    console.error("Error fetching routine:", err);
  } finally {
    setLoading(false);
  }
};

  // 🔹 Build timetable
  const buildTable = () => {
    let table = {};

    days.forEach(day => {
      table[day] = {};
      slots.forEach(slot => {
        table[day][slot] = null;
      });
    });

    routine.forEach(r => {
      table[r.day][r.slot] = r;
    });

    setTimetable(table);
  };

  useEffect(() => {
    fetchRoutine();
  }, []);

  useEffect(() => {
    buildTable();
  }, [routine]);

  // 🔹 Loading UI
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading routine...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EAF3FF] px-4 py-8">
      
      {/* Header */}
      <h1 className="text-2xl sm:text-3xl font-bold text-blue-700 text-center mb-6">
        My Class Routine 📅
      </h1>

      {/* Table */}
      <div className="max-w-6xl mx-auto overflow-x-auto bg-white shadow-md rounded-xl">
        <table className="w-full text-center border-collapse">
          
          <thead>
            <tr className="bg-blue-200">
              <th className="p-3 border">Day</th>
              {slots.map(slot => (
                <th key={slot} className="p-3 border">
                  Slot {slot}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {days.map(day => (
              <tr key={day}>
                <td className="p-3 border font-semibold text-blue-700">
                  {day}
                </td>

                {slots.map(slot => {
                  const data = timetable[day]?.[slot];

                  return (
                    <td key={slot} className="p-3 border">
                      {data ? (
                        <div className="bg-blue-500 text-white rounded-lg p-2 shadow">
                          <p className="font-semibold">
                            {data.classId?.className}
                          </p>
                        </div>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
};

export default StudentRoutine;