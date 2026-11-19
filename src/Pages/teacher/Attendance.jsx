import { useEffect, useState } from "react";

const Attendance = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedClassName, setSelectedClassName] = useState("");
  const [students, setStudents] = useState([]);
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);

  // ===============================
  // FETCH CLASSES ✅ FIXED
  // ===============================
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await fetch(
          "https://school-management-node-backend.onrender.com/api/teacher/classes",
          {
            credentials: "include", // 🔥 VERY IMPORTANT
          }
        );

        const data = await res.json();
        console.log("CLASSES DATA:", data);

        // ensure array
        setClasses(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setClasses([]);
      }
    };

    fetchClasses();
  }, []);

  // ===============================
  // SELECT CLASS
  // ===============================
  const handleClassChange = async (e) => {
    const classId = e.target.value;
    setSelectedClassId(classId);

    const selected = classes.find((c) => c._id === classId);
    setSelectedClassName(selected?.className || selected?.name || "");

    try {
      const res = await fetch(
        `https://school-management-node-backend.onrender.com/api/teacher/class/${classId}/students`,
        {
          credentials: "include", // 🔥 IMPORTANT
        }
      );

      const data = await res.json();
      console.log("STUDENTS DATA:", data);

      const formatted = (Array.isArray(data) ? data : []).map((s) => ({
        ...s,
        status: "absent",
      }));

      setStudents(formatted);
    } catch (err) {
      console.error(err);
      setStudents([]);
    }
  };

  // ===============================
  // CHANGE ATTENDANCE
  // ===============================
  const handleAttendanceChange = (index, status) => {
    const updated = [...students];
    updated[index].status = status;
    setStudents(updated);
  };

  // ===============================
  // SAVE ATTENDANCE
  // ===============================
  const handleSave = async () => {
    if (!date || !selectedClassId) {
      alert("Please select date and class");
      return;
    }

    try {
      setLoading(true);

      const records = students.map((s) => ({
        student: s._id,
        status: s.status,
      }));

      const res = await fetch(
        "https://school-management-node-backend.onrender.com/api/attendance/mark",
        
        {
          method: "POST",
          credentials: "include",
          
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            classId: selectedClassId,
            date,
            records,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Error saving attendance");
        return;
      }

      alert("✅ Attendance saved successfully");
    } catch (err) {
      console.error(err);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto bg-white p-8 rounded-2xl shadow-md">
      <h1 className="text-2xl font-bold text-blue-700 mb-6">
        Mark Attendance
      </h1>

      {/* DATE */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-600 mb-2">
          Select Date
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="p-2 border rounded-lg"
        />
      </div>

      {/* CLASS SELECT */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-600 mb-2">
          Select Class
        </label>
        <select
          onChange={handleClassChange}
          value={selectedClassId}
          className="w-full p-2 border rounded-lg"
        >
          <option value="">-- Choose Class --</option>

          {classes.map((cls) => (
            <option key={cls._id} value={cls._id}>
              {cls.className || cls.name}
            </option>
          ))}
        </select>
      </div>

      {/* STUDENTS */}
      {selectedClassId && (
        <>
          <h2 className="font-semibold text-gray-700 mb-4">
            Students – {selectedClassName}
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full border">
              <thead className="bg-blue-50">
                <tr>
                  <th className="border p-2">Roll</th>
                  <th className="border p-2">Name</th>
                  <th className="border p-2">Attendance</th>
                </tr>
              </thead>

              <tbody>
                {students.map((student, index) => (
                  <tr key={student._id}>
                    <td className="border p-2 text-center">
                      {student.roll}
                    </td>
                    <td className="border p-2">
                      {student.name}
                    </td>
                    <td className="border p-2 text-center">
                      <label className="mr-4">
                        <input
                          type="radio"
                          name={`att-${index}`}
                          checked={student.status === "present"}
                          onChange={() =>
                            handleAttendanceChange(index, "present")
                          }
                        />{" "}
                        Present
                      </label>

                      <label>
                        <input
                          type="radio"
                          name={`att-${index}`}
                          checked={student.status === "absent"}
                          onChange={() =>
                            handleAttendanceChange(index, "absent")
                          }
                        />{" "}
                        Absent
                      </label>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            onClick={handleSave}
            disabled={loading}
            className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? "Saving..." : "Save Attendance"}
          </button>
        </>
      )}
    </div>
  );
};

export default Attendance;